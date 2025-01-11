I found this [LinkedIn Article](https://www.linkedin.com/pulse/rust-worst-system-level-modelling-language-ever-adam-rose-fza9e/), which pointed out how Rust was in its native form, was a very bad System Level Modelling Language, and it hit me, that [Context Generic Programming](https://contextgeneric.dev), a new programming paradigm for Rust, could be applied as a fix and make it a great one.

In the blog, the big frustration is how Rust's strict ownership/borrowing rules turn it into a nightmare when you try to build out a DAG ([Direct Acyclic Graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) of components and ports all hooking into each other. The only known & obvious ways to do this is either using raw pointers or basically manufacturing a RC/RefCell clones' galore, or else store integer IDs, and look them in some kind of a map, which kind of feels like we're stepping backwards from a type-safe world (because aren't pointers just that?).

Context Generic Programming was introduced just at the end of 2024, as a way to enhance Rust's already great capabilities in building modular, type-safe, and highly expressive code. 
CGP leverages Rust's powerful type system and trait mechanisms to manage dependancies and component interactions in a clean (although confusing at first) way.

CGP, in our use case, can let us store the "who-owns-what" outside of the component defintiions. Each node in the DAG just indicates that "I need acess to my parent, child or some other resource" and then the context becomes the piece that actually *wires* those references together at compile time (or basically providing us a zero-cost, ID based manner completely hidden under veil, giving type safety by the virtue of abstraction).

We can do so by constructing:
- A **Consumer Trait** like `HasParent` or `HasChildren`
- A **Provider Trait** that actually knows (or is programmed with) how to fetch the parent or children from the context.
So in effect, the node in question can remain simple, pure leaving the heavy lifting pertaining to the resolving the reference to the context itself. If we want a multi phase "elaboration", we can do a partial or incremental resolution inside the context, and in each step we wire up the pieces of our DAG without forcibly owning everything in the nodes themselves.

## Example Sketch On A Two Phase Elaboration w/ CGP

Let's actually see how we might do it in the code, understood from the examples, given at https://patterns.contextgeneric.dev/ website. This example follows the Parent-Child DAG problem we went over briefly in the last section.

### A Component Trait
```rust
use cgp::prelude::*;

// this is a "consumer trait" saying "I need to be able to find my parent."
#[cgp_component {
    name: ParentComponent,
    provider: ParentProvider,
    context: Context
}]
pub trait HasParent {
    fn get_parent_id(&self) -> Option<usize>;
}

// similarly for the children
#[cgp_component {
    name: ChildrenComponent,
    provider: ChildrenProvider,
    context: Context
}]
pub trait HasChildren {
    fn get_children_ids(&self) -> &[usize];
}
```

Here, we see that each trait is consumer-facing, and it follows the theory that our node ***consumes*** these abilities, but it doesn't define how they're provided. One thing to notice here is that we don't store raw pointers or any other anti-patterns discussed before, but instead we're just storing or reviewing some ID. We could store direct references, but an ID is simpler to illustrate.

### Provide An Implementation In-Context

Now the actual question comes to, *how do we provide these references?*

Two approaches (you can figure out more) I can think of right now, are Arena-based and ID-based (where the context owns the real data).

```rust
pub struct NodeInfo {
    parent: Option<usize>,
    children: Vec<usize>,
}

# [derive(Default)]
pub struct MyGraphArena {
    pub nodes: Vec<NodeInfo>,
}

pub struct MyContext {
    pub graph: MyGraphArena,
}

pub struct ParentAndChildrenProvider;

impl<Context> ParentProvider<Context> for ParentAndChildrenProvider
where
    Context: HasField<symbol!("graph"), Value = MyGraphArena>,
{
    fn get_parent_id(ctx: &Context, node_id: usize) -> Option<usize> {
        let arena = ctx.get_field(PhantomData::<symbol!("graph")>);
        arena.nodes[node_id].parent
    }
}

impl<Context> ChildrenProvider<Context> for ParentAndChildrenProvider
where
    Context: HasField<symbol!("graph"), Value = MyGraphArena>,
{
    fn get_children_ids(ctx: &Context, node_id: usize) -> &[usize] {
        let arena = ctx.get_field(PhantomData::<symbol!("graph")>);
        &arena.nodes[node_id].children
    }
}
```

Here, the `ParentAndChildProvider` is hooking up the `ParentComponent` and the `ChildrenComponent` to the `MyGraphArena` inside the `MyContext`. By using the `ctx.get_field(PhantomData::<symbol!("graph")>`, we're getting the actual node array, and then the parent and the children nodes are simply discovered by ID lookups, and this gets us near to our goal, CGP tucks away the type-level complexity so that our ID-based if we like, or references if that's our liking, but either way, we do it *safely*.
![[Pasted image 20250109225149.png]]

### Delegating In The Final Context.

Simply following the CGP examples, we could do something like
```rust
pub struct MyContextComponents;

impl HasComponents for MyContext {
    type Components = MyContextComponents;
}

delegate_components! {
    MyContextComponents {
        ParentComponent: ParentAndChildrenProvider,
        ChildrenComponent: ParentAndChildrenProvider,
    }
}
```
Now the benefit is that any structure implementing `HasField<symbol!("graph"),  Value=MyGraphArena>` can become a "parent-child aware" context. If we want to elaborate multiple DAGs or partial references, we can do so in phases, first create placeholders in nodes, then connect them, and them we can be sure to never have Raw Pointer troubles.

In a real system-level modeling environment, you might define your “elaboration” passes as code that manipulates `MyGraphArena` or equivalent, building or rewriting node relationships. Once the context is specced out, the rest of the system can call `component.get_parent_id()` or `component.get_children_ids()` safely. Rust’s borrow checker issues become a compile-time non-problem, because everything is anchored in the single `MyGraphArena` that your context owns.

This gives us:
- Decouples Ownership 
- No Overly-Complex Lifetimes
- Elaboration Friendly (since we can build partial references in our context)
- Follows what Rust does best - safety.

> [!Warning] CGP Is In Its Early Stages
> As also mentioned on the https://contextgeneric.dev/ website, CGP is its in early stages, and is not intended to be used in production. This also means there even might be things that are inconsistent on this blog article, and if so, please feel free to let me know about it so I can update this guide. Thanks!
