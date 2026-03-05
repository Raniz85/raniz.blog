---
title: "Generating test flavours in C# part 1: The non-solution"
description:
date: 2024-03-07
thumb: "victoriano-izquierdo-JG35CpZLfVs-unsplash.jpg"
thumbCaption: "Credit: Victoriano Izquierdo via Unsplash"
thumbCaptionHref: "https://unsplash.com/photos/man-on-front-of-vending-machines-at-nighttime-JG35CpZLfVs"
tags:
  - csharp
  - development
  - testing
  - code generation
---
Imagine that you're working on a project that should support multiple different database backends.
Up until now you have only worked with a single database,
and now it is time to add support for another one.

The code has been written with this in mind;
you are using an abstraction layer so that you can write database-independent code.
But because abstractions are never perfect you need to ensure that everything works with both database engines.

---

# Solution alternatives

One way of achieving this would be to copy each test class and modify it to use a different database engine,
but that quickly grows unmaintainable since you'll need to make modifications to every copy once you change or add tests.

Another way would be to make all test classes abstract and create concrete classes for each supported database engine.
Something like this:

```csharp
public abstract class UserRepositoryTests(IDatabaseEngine Engine): IAsyncLifetime
{
    public async Task InitializeAsync()
    {
        await Engine.InitializeAsync();
    }

    public async Task DisposeAsync()
    {
        await Engine.DisposeAsync();
    }
    
    // Tests go here
}

public class UserRepositoryMariaDbTests() : UserRepositoryTests(new MariaDbEngine())
{
}

public class UserRepositoryPostgresTests() : UserRepositoryTests(new PostgresEngine())
{
}
```

This works well,
but you need to remember to create one concrete class for each test class and database backend you support.
With both unit tests and integration tests this quickly becomes very tedious
(the project that inspired this post had around 80 test suites - that's 160 concrete classes to write for 2 backends).
Additionally, if you add support for a third backend in the future you'll have to go through every single test class and add another concrete class for the new backend,
miss one and that test is not run for your new database backend.

A much better way would be to parametrize each class to take a database backend in the constructor and have the test framework
run every test for each available backend.
That way the test framework would be responsible for running all tests against all database backends,
and we would only have to remember to annotate our classes correctly.
Implemented correctly we would only have to add a new implementation of `IDatabaseEngine` and change the parameter-supplying method to run all tests against a third backend.
Neat!

Unfortunately,
this is not currently possible with our testing framework of choice: Xunit.
There is an [open feature request](https://github.com/xunit/xunit/issues/2050) that is -
possibly -
on the [roadmap for Xunit v3](https://github.com/xunit/xunit/issues/2133).

This means we get to implement this behaviour on our own -
that sounds like a fun challenge :)

# Extending Xunit
Ok, let's do this!

Running your tests with Xunit can be divided up into two phases:

1. Discovery
2. Execution

During the discovery phase Xunit scans your assemblies and locates all test classes and the test cases they contain.
Each test case is then added to the execution-list,
complete with all information needed such as theory parameters and fixtures.

In the execution phase all discovered test cases are executed and the results are reported.

Both of these phases have extension points where you can override the behaviour.

## Extending the executor
My first approach was to replace the executor and try to execute each test once for each database backend.
You do this by implementing your own `XunitTestFramework` and having it supply your custom `XunitTestFrameworkExecutor`.

```csharp
public class CustomTestFramework: XunitTestFramework
{
    public CustomTestFramework(IMessageSink messageSink) : base(messageSink)
    {
    }

    protected override ITestFrameworkExecutor CreateExecutor(AssemblyName assemblyName)
    {
        return new CustomTestFrameworkExecutor(assemblyName);
    }
}
```

You then tell Xunit to use this custom framework by adding an attribute referencing it to any file in the assembly:

```csharp
[assembly: Xunit.TestFramework(typeName: "Raniz.CustomTestFramework", assemblyName: "UnitTests")]
```

I am not going to show how to implement `CustomTestFrameworkExecutor`,
because this turned out to be a dead end.
While playing around with executing the same test twice with different names it became apparent that JetBrains Rider did not like undiscovered tests being run -
it messed up the test report view pretty badly and all tests were no longer visible.

If you want to write your own executor for other reasons,
you can find an example in [meziantou](https://www.meziantou.net/)'s [blog post](https://www.meziantou.net/parallelize-test-cases-execution-in-xunit.htm) that I used as inspiration.

## Extending the discoverer
So,
since Rider did not like me executing undiscovered tests I thought I would create new test cases during the discovery phase instead.

Implementing a custom discoverer is very similar to implementing a custom executor -
you just override `protected ITestFrameworkDiscoverer CreateDiscoverer(IAssemblyInfo assemblyInfo)` to provide your custom `ITestFrameworkDiscoverer` instead.

Unfortunately,
that did not work out either.
My idea was to put all tests in a collection fixture and replace the fixture passed to the class constructor for each database backend.
It turned out that Xunit requires the type of the fixture to be an exact match with that of the constructor argument -
i.e. you can't declare your constructor to take an `IDatabaseEngine` and supply an implementation of that in the fixture,
Xunit will produce an error saying that it can not find a suitable argument for the `IDatabaseEngine` typed argument.

This leaves us back on square one,
which means that we need to take a different path.
And that path is called _compile-time code generation_.

You can read about that in [part 2](/2024-04-03_csharp-code-generation-2/).