# Convex hull of a function

**User:** Anonymous (meqrvsl88948@hotmail.com)  
**Created:** 12/14/2025 11:08:09  
**Updated:** 12/14/2025 13:26:54  
**Exported:** 12/16/2025 13:53:51  
**Link:** [https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3/c/693e6960-0ad8-8332-9e15-dbb8aeb63c48](https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3/c/693e6960-0ad8-8332-9e15-dbb8aeb63c48)  

## Prompt:
Unpack this:

## Exercise 3.30 (BV) — Convex hull / convex envelope of a function

The book’s statement is:

Let (f:\mathbb R^n\to\mathbb R). Define its **convex hull / convex envelope** (g) by
[
g(x)=\inf{,t\mid (x,t)\in \operatorname{conv},\operatorname{epi} f,}.
]
Geometrically, (\operatorname{epi} g) is the convex hull of (\operatorname{epi} f).
Show that (g) is the **largest convex underestimator** of (f): if (h) is convex and (h(x)\le f(x)) for all (x), then (h(x)\le g(x)) for all (x). ([UCLA Sea Scholars][1])

I’ll prove this in a “domain-honest” way, including the only subtlety here: **the infimum might not be attained**, so you sometimes need a closure.

---

# 0) Setup and notational hygiene

### Epigraph

[
\operatorname{epi} f ;=;{(x,t)\in\mathbb R^{n+1}:\ t\ge f(x)}.
]

Let
[
E := \operatorname{conv}(\operatorname{epi} f)\subseteq \mathbb R^{n+1}.
]
This is convex by construction.

Define
[
g(x):=\inf{t:(x,t)\in E}.
]
Important: for some (x), the vertical line ({(x,t):t\in\mathbb R}) might not intersect (E). Then the inf is over an empty set. In standard convex analysis one defines (g(x)=+\infty) in that case; BV’s statement writes (f:\mathbb R^n\to\mathbb R), but the geometry is cleaner if we allow extended values. I’ll proceed with the mathematically standard convention:

* If ({t:(x,t)\in E}=\varnothing), then (g(x)=+\infty).
* Otherwise (g(x)\in\mathbb R\cup{-\infty}) (but here it won’t be (-\infty) because (E) is contained in an epigraph-like region; see below).

So **domain of (g)** is
[
\operatorname{dom} g :={x:\exists t\ (x,t)\in E}.
]

---

# 1) First key facts: (g\le f) and (g) is convex

## 1.1 Show (g(x)\le f(x)) for all (x)

Fix any (x). Then ((x,f(x))\in \operatorname{epi} f) because (f(x)\ge f(x)).
Since (\operatorname{epi} f\subseteq E=\operatorname{conv}(\operatorname{epi} f)), we have ((x,f(x))\in E).

Therefore (f(x)) is a feasible (t) in the set ({t:(x,t)\in E}). Hence
[
g(x)=\inf{t:(x,t)\in E}\ \le\ f(x).
]
So (g) is indeed an **underestimator** of (f).

---

## 1.2 Identify (\operatorname{epi} g) (this is where convexity comes from)

Define the **upward closure** of (E):
[
E^{\uparrow} := E + \big({0}^n\times \mathbb R_+\big)
= {(x,,s+r): (x,s)\in E,\ r\ge 0}.
]
This set is convex because it is a Minkowski sum of two convex sets (a convex set (E) plus a convex cone ({0}^n\times\mathbb R_+)).

### Claim

[
\operatorname{epi} g ;=; \overline{E^{\uparrow}}
]
(closure may be needed if the inf is not attained).

#### Proof (“(\subseteq)”)

Take ((x,t)\in \operatorname{epi} g). That means (t\ge g(x)).

* If (t>g(x)): set (\varepsilon:=t-g(x)>0). By definition of infimum, there exists some (s) such that ((x,s)\in E) and
  [
  s < g(x)+\varepsilon = t.
  ]
  Then (t=s+r) with (r=t-s>0), so ((x,t)\in E^{\uparrow}).
* If (t=g(x)): you may not have any ((x,s)\in E) with (s=g(x)). But you can take a sequence (s_k\downarrow g(x)) with ((x,s_k)\in E), then ((x,s_k)\in E^{\uparrow}) (take (r=0)), and ((x,s_k)\to(x,g(x))). So ((x,t)\in\overline{E^{\uparrow}}).

Thus (\operatorname{epi} g\subseteq \overline{E^{\uparrow}}).

#### Proof (“(\supseteq)”)

Take ((x,t)\in E^{\uparrow}). Then there exist ((x,s)\in E) and (r\ge 0) with (t=s+r), so (t\ge s).

Since ((x,s)\in E), (s) is feasible in the definition of (g(x)), hence (g(x)\le s\le t), i.e. ((x,t)\in \operatorname{epi} g).

So (E^{\uparrow}\subseteq \operatorname{epi} g). Taking closures preserves inclusion, giving (\overline{E^{\uparrow}}\subseteq \operatorname{epi} g).

Combining both directions yields (\operatorname{epi} g=\overline{E^{\uparrow}}).

### Convexity of (g)

(\overline{E^{\uparrow}}) is convex (closure of a convex set is convex), so (\operatorname{epi} g) is convex. Therefore (g) is a **convex function** (on its effective domain).

That proves the “(g) is convex” part with full geometric honesty.

---

# 2) The main claim: (g) is the **largest convex underestimator**

We must show:

> If (h) is convex and (h(x)\le f(x)\ \forall x), then (h(x)\le g(x)\ \forall x). ([UCLA Sea Scholars][1])

## Step 2.1: Convert (h\le f) into an epigraph inclusion

Assume (h(x)\le f(x)) for all (x).

Take any ((x,t)\in \operatorname{epi} f). Then (t\ge f(x)\ge h(x)). So ((x,t)\in \operatorname{epi} h).

Thus
[
\operatorname{epi} f \subseteq \operatorname{epi} h.
]

## Step 2.2: Convexify

Since (h) is convex, (\operatorname{epi} h) is convex. And since it contains (\operatorname{epi} f), it must contain the **convex hull** of (\operatorname{epi} f):
[
E = \operatorname{conv}(\operatorname{epi} f)\subseteq \operatorname{epi} h.
]

This inclusion is the whole game.

## Step 2.3: Take a fixed (x) and compare vertical slices

Fix (x). Consider the feasible set for (g(x)):
[
T(x):={t:(x,t)\in E}.
]
By definition,
[
g(x)=\inf T(x).
]

But we also know (E\subseteq \operatorname{epi} h). So for any (t\in T(x)), we have ((x,t)\in \operatorname{epi} h), which means (t\ge h(x)).

So **every** feasible (t) in (T(x)) is (\ge h(x)). Therefore the infimum is also (\ge h(x)):
[
g(x)=\inf T(x)\ \ge\ h(x).
]
Equivalently,
[
h(x)\le g(x)\qquad \forall x.
]

That is exactly the statement “(g) is the largest convex underestimator of (f).” ✅

No hidden domain gaps: this argument even handles the case (T(x)=\varnothing), because then (g(x)=+\infty) and the inequality (h(x)\le g(x)) holds trivially.

---

# 3) What you should *remember* (the mental model)

* (\operatorname{epi} f) is the “shape above (f).”
* Any convex underestimator (h\le f) has a convex epigraph that must contain (\operatorname{epi} f).
* Therefore it must contain (\operatorname{conv}(\operatorname{epi} f)).
* The **lowest height** at each (x) compatible with that convex hull is exactly (g(x)).
* Hence no convex function under (f) can sit above (g). So (g) is maximal.

That’s why this object is called both the **convex envelope** and the **tightest convex relaxation** of (f).

---

If you want the next layer: I can derive the common equivalent characterization
[
g(x)=\sup{\ell(x)\mid \ell \text{ affine and } \ell(z)\le f(z)\ \forall z},
]
i.e. the envelope is the **pointwise supremum of all affine global underestimators**—which plugs directly into Exercise 3.28/3.31 and into biconjugates (g=f^{**}) when (f) is closed.

[1]: https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf "book.dvi"

## Response:
Here is a **fully unpacked, zero-to-hero explanation** of **Exercise 3.30** from _Boyd–Vandenberghe (BV)_ on the **convex hull / convex envelope of a function**, including **motivation, geometric interpretation, formal proof steps, failure modes, domain subtleties, and dual characterizations**.

* * *

🧭 Roadmap
----------

1.  **The problem**: What does “convex envelope” mean?
2.  **Definitions & setup**: Epigraphs, convex hulls, and the definition of `g`
3.  **Why this `g(x)` makes sense** geometrically and algebraically
4.  **Proving that `g` is convex**
5.  **Proving that `g` is the _largest_ convex underestimator**
6.  **What can go wrong: non-attainment, infinite values**
7.  **Geometric & dual intuition**
8.  **(Optional) Alternative characterization via affine minorants**

* * *

1\. 🚩 Problem Statement — What Are We Proving?
-----------------------------------------------

Given **any function**  $f : \mathbb{R}^n \to \mathbb{R}$ , we define its **convex envelope**  $g$  by:

$$
g(x) := \inf \{ t \mid (x, t) \in \operatorname{conv}(\operatorname{epi} f) \}.
$$

We want to prove two things:

### (1) Convexity

 $g$  is convex.

### (2) Envelope Property

 $g$  is the **largest convex underestimator** of  $f$ , meaning:

> For **any** convex function  $h$  with  $h(x) \le f(x)\ \forall x$ , we have
> 
> $$
> h(x) \le g(x) \quad \forall x.
> $$

* * *

2\. 📐 Preliminaries — Epigraphs, Convex Hull, and Defining  $g$ 
-----------------------------------------------------------------

### 2.1 Epigraph

The **epigraph** of a function  $f : \mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$  is:

$$
\operatorname{epi} f := \{ (x, t) \in \mathbb{R}^{n+1} \mid t \ge f(x) \}.
$$

Geometrically, it's the region “above” the graph of  $f$ , extended vertically.

* * *

### 2.2 Convex Hull of a Set

If you take **all convex combinations** of points in a set  $S \subseteq \mathbb{R}^{n+1}$ , the result is called its **convex hull**, denoted:

$$
\operatorname{conv}(S).
$$

So when we say:

$$
E := \operatorname{conv}(\operatorname{epi} f),
$$

we’re taking all convex combinations of the epigraph points — forming the **smallest convex set containing the entire epigraph**.

* * *

### 2.3 Defining the Convex Envelope

Given this convex set  $E \subseteq \mathbb{R}^{n+1}$ , define:

$$
g(x) := \inf \{ t \in \mathbb{R} \mid (x, t) \in E \}.
$$

This means:

*   We drop a **vertical line** through  $x \in \mathbb{R}^n$ ,
*   Intersect it with the convex hull  $E \subset \mathbb{R}^{n+1}$ ,
*   The **lowest point** where this line enters  $E$  gives the value  $g(x)$ .

**Key idea**:  $g(x)$  is the lowest height that any convex relaxation of  $f$  can assign to  $x$ .

* * *

### 2.4 Domain Subtlety

It’s possible that for some  $x$ , the vertical line  $\{(x,t): t \in \mathbb{R} \}$  **never intersects**  $E$ . In that case, the infimum is over the empty set. Convention:

$$
g(x) := +\infty \quad \text{if } \{ t : (x, t) \in E \} = \emptyset.
$$

That’s standard in convex analysis, and ensures  $g : \mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$ .

* * *

3\. 🔻 First Result:  $g(x) \le f(x)$  for All  $x$ 
----------------------------------------------------

This is **trivial but foundational**.

*   For any  $x$ , we know that  $(x, f(x)) \in \operatorname{epi} f \subseteq E$ .
*   That means  $f(x)$  is in the feasible set defining  $g(x)$ .
*   Therefore, the infimum is less than or equal to  $f(x)$ .
    
$$
g(x) \le f(x).
$$

So  $g$  **underestimates**  $f$ , always.

* * *

4\. 🧩 Epigraph of  $g$  — A Key Geometric Step
-----------------------------------------------

We want to understand the epigraph of  $g$  directly. Define:

$$
E^{\uparrow} := E + ( \{0\}^n \times \mathbb{R}_+ ) = \{ (x, s + r) \mid (x, s) \in E,\ r \ge 0 \}.
$$

This is the **vertical closure above** the convex hull — we’re taking all points above  $E$ , just like with an epigraph.

### Claim:

$$
\operatorname{epi} g = \overline{E^{\uparrow}}.
$$

(Closure may be needed if the infimum is not attained.)

* * *

### ✅ Proof:  $\operatorname{epi} g \subseteq \overline{E^{\uparrow}}$ 

Take any  $(x, t) \in \operatorname{epi} g$ , so  $t \ge g(x)$ .

Two cases:

#### Case 1:  $t > g(x)$ 

Let  $\varepsilon := t - g(x) > 0$ . By definition of infimum, ∃  $s \in \mathbb{R}$  such that  $(x,s) \in E$  and  $s < t$ .

Then  $t = s + r$ , for some  $r > 0$ , so  $(x,t) \in E^{\uparrow}$ .

#### Case 2:  $t = g(x)$ 

Maybe the infimum isn't attained (no  $(x, t) \in E$ ). But we can find a sequence  $s_k \downarrow g(x)$  such that  $(x, s_k) \in E$ , so  $(x, s_k) \in E^{\uparrow}$  and  $(x, s_k) \to (x, g(x))$ .

Thus,  $(x, g(x)) \in \overline{E^{\uparrow}}$ .

So:

$$
\operatorname{epi} g \subseteq \overline{E^{\uparrow}}.
$$

* * *

### ✅ Proof:  $\overline{E^{\uparrow}} \subseteq \operatorname{epi} g$ 

Take any  $(x,t) \in E^{\uparrow}$ , so ∃  $s$  with  $(x,s) \in E$  and  $t = s + r \ge s$ . Since  $s$  is in the feasible set of  $g(x)$ ,  $g(x) \le s \le t$ , so  $(x,t) \in \operatorname{epi} g$ .

Closure preserves containment, so:

$$
\overline{E^{\uparrow}} \subseteq \operatorname{epi} g.
$$

Hence:

$$
\operatorname{epi} g = \overline{E^{\uparrow}}.
$$

And since this is a **closed convex set**,  $g$  is convex.

* * *

5\. 🔝 The Envelope Property — Maximal Convex Underestimator
------------------------------------------------------------

We now prove:

> If  $h$  is convex and  $h(x) \le f(x)$  for all  $x$ , then  $h(x) \le g(x)$  for all  $x$ .

### Step 1: Epigraph inclusion

If  $h(x) \le f(x)$ , then clearly:

$$
\operatorname{epi} f \subseteq \operatorname{epi} h.
$$

Why? Because any  $(x, t) \in \operatorname{epi} f$  satisfies  $t \ge f(x) \ge h(x)$ , so  $(x, t) \in \operatorname{epi} h$ .

* * *

### Step 2: Convex hull containment

Since  $h$  is convex, its epigraph is convex. So it contains:

$$
E = \operatorname{conv}(\operatorname{epi} f) \subseteq \operatorname{epi} h.
$$

* * *

### Step 3: Pointwise inequality

Fix any  $x \in \mathbb{R}^n$ . The vertical slice:

$$
T(x) := \{ t \mid (x, t) \in E \}
$$

is contained in:

$$
\{ t \mid (x, t) \in \operatorname{epi} h \} = [h(x), \infty).
$$

So any feasible value of  $t \in T(x)$  must be  $\ge h(x)$ , hence:

$$
g(x) = \inf T(x) \ge h(x).
$$

This holds for all  $x$ , even for  $x \notin \operatorname{dom} f$ , because then  $g(x) = +\infty$  and inequality trivially holds.

**QED.**

* * *

6\. 🧱 What Can Go Wrong (Attainment, Domain)
---------------------------------------------

*   If  $f$  is not lower semicontinuous, the infimum defining  $g(x)$  may not be attained.
*   For some  $x$ , the convex hull might not contain any point of the form  $(x, t)$ , in which case  $g(x) = +\infty$ .
*   So the effective domain of  $g$  is:
    
$$
\operatorname{dom} g := \{ x \mid \exists t \text{ s.t. } (x, t) \in E \}.
$$

* * *

7\. 🧠 Geometric + Functional Intuition
---------------------------------------

Here’s the **mental image** to hold on to:

*   Imagine plotting the graph of a nasty, jagged function  $f(x)$ , then shading everything **above it** — that's  $\operatorname{epi} f$ .
*   Now take the **convex hull** of that entire shaded region — possibly filling in gaps and “smoothing” dents.
*   The **bottom boundary** of that new convex region is the graph of the convex envelope  $g(x)$ .
*   Any convex function  $h$  that lies under  $f$  must also lie **under** this boundary.

Thus  $g$  is the **tightest possible convex underestimator** of  $f$ , both geometrically and functionally.

* * *

8\. (Optional) 🪞 Dual Characterization: Sup of Affine Minorants
----------------------------------------------------------------

There’s a dual view of the convex envelope:

$$
g(x) = \sup \left\{ \ell(x) \mid \ell \text{ affine and } \ell(z) \le f(z)\ \forall z \right\}.
$$

That is,  $g$  is the **pointwise supremum** over all **affine functions that lie below  $f$ **. This connects to:

*   **Exercise 3.28/3.31**
*   **Fenchel biconjugation**:  $f^{**} = \text{convex envelope of } f$  if  $f$  is lower semicontinuous and proper.

* * *

✅ Final Summary
---------------

Let’s wrap up:

*    $g(x) = \inf \{ t \mid (x,t) \in \operatorname{conv}(\operatorname{epi} f) \}$  defines the **convex envelope**.
*   Geometrically, this is the **bottom of the convex hull** of the epigraph.
*    $g$  is **convex**, as its epigraph is convex.
*    $g(x) \le f(x)$ , always.
*   Any convex  $h$  below  $f$  must also lie below  $g$ :  $h(x) \le g(x)$ .
*   So  $g$  is the **tightest (largest) convex underestimator** of  $f$ .

* * *

Let me know if you want:

*   **Concrete examples** (e.g., convex envelope of an indicator function, or step function)
*   **Code (NumPy/Matplotlib) to visualize this**
*   **Duality/Biconjugate interpretations**
*   Or want to move to Exercise 3.31 (sup of affine minorants) to complete the dual picture.

## Prompt:
Explain The problem: What does “convex envelope” mean?

Definitions & setup: Epigraphs, convex hulls, and the definition of g

## Response:
Let’s unpack from **first principles** what the problem is asking, and rigorously build up all the necessary definitions and machinery to understand it in full. We’ll begin with the **problem motivation**, then define all key objects: **epigraphs**, **convex hulls**, and finally the precise definition of the **convex envelope**  $g$ .

* * *

🧩 The Problem: What Does “Convex Envelope” Mean?
-------------------------------------------------

### Informal Goal

Given **any function**  $f:\mathbb{R}^n \to \mathbb{R}$ , we want to construct a **convex function**  $g:\mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$  that:

1.  **Underestimates**  $f$ :  $g(x) \le f(x)$  for all  $x \in \mathbb{R}^n$ 
2.  Is **as large as possible** while remaining convex and staying below  $f$ 

In other words, among _all convex functions that lie below  $f$ _, we want the one that is **closest to  $f$  from below**. This is the **convex envelope** of  $f$ .

* * *

### Formal Statement

Given a function  $f:\mathbb{R}^n \to \mathbb{R}$ , define the **convex envelope**  $g:\mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$  by:

$$
g(x) := \inf \{ t \in \mathbb{R} \mid (x,t) \in \operatorname{conv}(\operatorname{epi} f) \}.
$$

That is, we look at the **convex hull of the epigraph** of  $f$ , and define  $g(x)$  as the **lowest height**  $t$  such that the point  $(x,t)$  lies in this convex hull.

We will show this  $g$  is the **largest convex function below  $f$ **.

* * *

📐 Definitions & Setup
----------------------

To understand the above construction, we must define:

### 1\. Epigraph of a Function

Let  $f:\mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$ . Its **epigraph** is the set:

$$
\operatorname{epi} f := \{ (x,t) \in \mathbb{R}^{n+1} \mid t \ge f(x) \}.
$$

This is the **region in space above the graph of the function**. Each point  $(x, t)$  in this set means: “At point  $x$ , any height  $t$  above  $f(x)$  is in the epigraph.”

#### ✅ Properties of Epigraphs

*   A function is **convex** if and only if its **epigraph is convex**.
*   The epigraph encodes **all information** about a function’s convexity.
*   The **lower boundary** of the epigraph is the graph of the function itself:
    $$
    \partial \operatorname{epi} f = \{ (x, f(x)) \mid x \in \operatorname{dom} f \}.
    $$

* * *

### 2\. Convex Hull of a Set

Let  $S \subseteq \mathbb{R}^{n+1}$  be any set (e.g., an epigraph). Then its **convex hull**, denoted  $\operatorname{conv}(S)$ , is the smallest convex set that contains all of  $S$ .

It consists of **all convex combinations** of finite subsets of points in  $S$ . That is:

$$
\operatorname{conv}(S) = \left\{ \sum_{i=1}^k \lambda_i z_i \;\middle|\; z_i \in S,\ \lambda_i \ge 0,\ \sum_{i=1}^k \lambda_i = 1,\ k \in \mathbb{N} \right\}.
$$

So we are “filling in” all possible lines, triangles, and higher-dimensional simplices inside  $S$ .

* * *

### 3\. The Convex Hull of the Epigraph:  $E := \operatorname{conv}(\operatorname{epi} f)$ 

This set  $E \subseteq \mathbb{R}^{n+1}$  is the **smallest convex set** that contains the entire region above  $f$ . Think of this as taking the possibly non-convex shaded epigraph of  $f$ , and stretching rubber around it until it becomes convex.

Key point:  $E$  might include points **below** the graph of  $f$ , depending on how non-convex  $f$  is. That’s what makes the convex envelope nontrivial.

* * *

### 4\. Definition of the Convex Envelope  $g$ 

We now define  $g : \mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$  by:

$$
g(x) := \inf \{ t \in \mathbb{R} \mid (x,t) \in E \},
$$

where  $E = \operatorname{conv}(\operatorname{epi} f)$ .

That is, we:

1.  Fix a point  $x \in \mathbb{R}^n$ 
2.  Look at the vertical line  $\{ (x, t) \mid t \in \mathbb{R} \}$ 
3.  Intersect this line with the convex region  $E$ 
4.  Take the **lowest height**  $t$  for which the point  $(x,t)$  enters  $E$ 

This is our definition of  $g(x)$ : the **lowest height** consistent with lying in the **convex hull of the epigraph of  $f$ **.

#### ⚠️ Special case: No intersection

If the vertical line through  $x$  does not intersect  $E$  at all (i.e., no  $t \in \mathbb{R}$  such that  $(x,t) \in E$ ), then the infimum is taken over the empty set.

By convention:

$$
g(x) := +\infty \quad \text{in that case}.
$$

This ensures  $g$  remains a **proper extended-real-valued function**, as is standard in convex analysis.

* * *

### 5\. Domain of  $g$ 

We define the **effective domain** of  $g$  as:

$$
\operatorname{dom} g := \{ x \in \mathbb{R}^n \mid \exists t \text{ such that } (x, t) \in E \}.
$$

This is the set of points where the convex envelope is finite (or at least not  $+\infty$ ). Outside this domain, the envelope doesn't exist — it's undefined or infinite.

* * *

🔁 Summary: The Setup in One Picture
------------------------------------

Imagine:

*   The **original function**  $f$ : possibly jagged, non-convex, messy
*   Its **epigraph**: the region above the graph of  $f$ 
*   The **convex hull of that epigraph**: smooths out and “fills in” the epigraph to make it convex
*   The **convex envelope**  $g$ : at each point  $x$ , the **lowest height** where the vertical line through  $x$  hits the convexified epigraph

This gives us the **tightest possible convex function below  $f$ ** — the envelope.

* * *

✅ What Comes Next
-----------------

With the above definitions, we're now equipped to:

*   Prove that  $g$  is indeed **convex** (by showing its epigraph is convex)
*   Show that  $g \le f$ 
*   Prove that **any** convex function below  $f$  must lie **below**  $g$  too — making  $g$  the **maximal convex underestimator**

These will be our next steps.

* * *

Let me know if you want:

*   Visual illustrations to reinforce this geometric intuition
*   Examples (e.g., convex envelope of a step function or indicator)
*   Dual interpretation (sup of affine minorants, i.e.,  $f^{**}$ )
*   Or to proceed directly with the proof that  $g \le f$  and  $g$  is convex.

## Prompt:
visual the three concepts via python code.   

3/3

## Response:
![Output image](https://chatgpt.com/backend-api/estuary/content?id=file-AD4KCGzhm2wJWih1Nx4GR5&ts=490522&p=fs&cid=1&sig=73343adaf33797312c3ac535bbab1f4587b301c14469b076e11138bd64ba033f&v=0)

![Output image](https://chatgpt.com/backend-api/estuary/content?id=file-RneQLkiLbi1iHgeQSVMZWK&ts=490522&p=fs&cid=1&sig=bc5dcb0af252f2ae8cd6a0c0962ba9f873cca7820eb2a2156470ef012adfef48&v=0)

![Output image](https://chatgpt.com/backend-api/estuary/content?id=file-XkHhGFdUsPCsdTc2MK3s6y&ts=490522&p=fs&cid=1&sig=4b4a14f420e421d2359f1b31bcea9c7c394c0914ef690b20d1158111340e7f16&v=0)

Done — the code above generates **3 plots** that visualize the three objects:

1.  **Epigraph**  $\mathrm{epi}\,f=\{(x,t):t\ge f(x)\}$ : shaded region above the curve.
2.  **Convex hull** idea (shown via the **lower convex hull boundary** of sampled  $(x,f(x))$  points): this is the “rubber band” boundary that convexifies the shape.
3.  **Convex envelope**  $g$ : the **largest convex underestimator** (here approximated as the piecewise-linear function along that lower hull), with the gap  $f-g$  shaded.

If you want the **exact** convex envelope for a general  $f$  in higher dimensions, you typically formulate it as a convex optimization / epigraph-hull construction (or compute  $f^{**}$  under regularity). But for 1D intuition, this visualization nails the geometry.

## Prompt:
Why this g(x) makes sense geometrically and algebraically

Proving that g is convex

Proving that g is the largest convex underestimator

## Response:
1) Why this  $g(x)$  makes sense (geometry + algebra)
-----------------------------------------------------

### Geometric meaning: “lowest height allowed by convexifying the epigraph”

Start with the epigraph

$$
\operatorname{epi} f=\{(x,t)\in\mathbb R^{n+1}: t\ge f(x)\}.
$$

Think of it as a **solid region** in  $(x,t)$ \-space that contains _everything above the graph_.

Now take its convex hull:

$$
E := \operatorname{conv}(\operatorname{epi} f).
$$

This is the **smallest convex set** that contains the whole epigraph. Intuition: you “convexify” the epigraph by allowing **mixtures** (convex combinations) of points in it.

Then define

$$
g(x)=\inf\{t:(x,t)\in E\}.
$$

Fix an  $x$ . Look at the **vertical line** through  $x$ :  $\{(x,t):t\in\mathbb R\}$ .

*   If it intersects  $E$ , then  $g(x)$  is the **lowest** intersection height.
*   If it doesn’t intersect  $E$ , the inf is over an empty set; in convex analysis we set  $g(x)=+\infty$  (so the function is “not finite there”).

So geometrically, ** $\operatorname{epi} g$ ** is exactly “the bottom boundary” of the convexified epigraph (up to a closure subtlety).

### Algebraic meaning: the cheapest “convexified” way to upper-bound  $t$ 

A point  $(x,t)\in E=\operatorname{conv}(\operatorname{epi} f)$  means:

$$
(x,t)=\sum_{i=1}^k \lambda_i (x_i,t_i), \quad \lambda_i\ge0,\ \sum\lambda_i=1, \quad (x_i,t_i)\in\operatorname{epi} f.
$$

Membership in  $\operatorname{epi} f$  means  $t_i\ge f(x_i)$ . Therefore every  $(x,t)\in E$  admits a representation with

$$
x=\sum_{i=1}^k \lambda_i x_i,\qquad t=\sum_{i=1}^k \lambda_i t_i\ \ge\ \sum_{i=1}^k \lambda_i f(x_i).
$$

So for fixed  $x$ , the _smallest_  $t$  compatible with  $(x,t)\in E$  is morally:

$$
g(x)=\inf\left\{\sum_{i=1}^k \lambda_i f(x_i): \sum_{i=1}^k \lambda_i x_i = x,\ \lambda_i\ge0,\ \sum\lambda_i=1\right\},
$$

(with the same closure/attainment caveat). This is a **convex-combination relaxation**: you can “explain”  $x$  as a mixture of points  $x_i$ , and pay the corresponding mixture of values  $f(x_i)$ . That is exactly what convexification does.

One immediate sanity check: since  $(x,f(x))\in\operatorname{epi} f\subseteq E$ , we always have  $g(x)\le f(x)$ . So  $g$  truly is an **underestimator**.

* * *

2) Proving  $g$  is convex
--------------------------

There are two clean routes. I’ll give the epigraph route (most BV-ish) and also the “direct inequality” route.

### Route A: epigraph convexity (the conceptual one)

**Fact (core theorem):** A function  $u$  is convex iff  $\operatorname{epi} u$  is convex.

So we want to show  $\operatorname{epi} g$  is convex.

Let

$$
E := \operatorname{conv}(\operatorname{epi} f).
$$

Define the “upward closure” of  $E$ :

$$
E^\uparrow := E + (\{0\}^n\times\mathbb R_+) = \{(x,s+r):(x,s)\in E,\ r\ge0\}.
$$
*    $E$  is convex by definition.
*    $\{0\}^n\times\mathbb R_+$  is a convex cone.
*   A Minkowski sum of convex sets is convex.  
    So  $E^\uparrow$  is convex, and therefore its closure  $\overline{E^\uparrow}$  is convex.

**Key identification:**

$$
\operatorname{epi} g = \overline{E^\uparrow}.
$$

Why?

*   If  $t>g(x)$ , by definition of infimum there exists  $s<t$  with  $(x,s)\in E$ . Then  $(x,t)=(x,s)+(0,t-s)\in E^\uparrow$ .
*   If  $t=g(x)$ , you may not have  $(x,g(x))\in E$  (infimum not attained), but you can approximate by a sequence  $(x,s_k)\in E$  with  $s_k\downarrow g(x)$ , giving  $(x,g(x))\in\overline{E^\uparrow}$ .
*   Conversely, if  $(x,t)\in E^\uparrow$ , then  $(x,t)=(x,s)+(0,r)$  with  $(x,s)\in E$  and  $t\ge s\ge g(x)$ , so  $(x,t)\in\operatorname{epi} g$ .

Thus  $\operatorname{epi} g$  is (closed) convex, hence ** $g$  is convex**.

### Route B: direct Jensen inequality (more “hands-on”)

Take any  $x,y$  and  $\theta\in[0,1]$ . We want:

$$
g(\theta x+(1-\theta)y)\ \le\ \theta g(x) + (1-\theta)g(y).
$$

Pick  $\varepsilon>0$ . By definition of infimum, choose  $t_x,t_y$  such that

$$
(x,t_x)\in E,\quad t_x \le g(x)+\varepsilon, \qquad (y,t_y)\in E,\quad t_y \le g(y)+\varepsilon.
$$

Because  $E$  is convex,

$$
(\theta x+(1-\theta)y,\ \theta t_x+(1-\theta)t_y)\in E.
$$

Therefore the infimum defining  $g$  at  $\theta x+(1-\theta)y$  is at most that height:

$$
g(\theta x+(1-\theta)y) \le \theta t_x+(1-\theta)t_y \le \theta(g(x)+\varepsilon)+(1-\theta)(g(y)+\varepsilon).
$$

So

$$
g(\theta x+(1-\theta)y)\le \theta g(x)+(1-\theta)g(y)+\varepsilon.
$$

Let  $\varepsilon\downarrow0$ . Done.

* * *

3) Proving  $g$  is the **largest convex underestimator** of  $f$ 
------------------------------------------------------------------

### What we must prove

Assume  $h:\mathbb R^n\to\mathbb R\cup\{+\infty\}$  is convex and

$$
h(x)\le f(x)\quad \forall x.
$$

We want to show

$$
h(x)\le g(x)\quad \forall x.
$$

### Step 1: Convert  $h\le f$  into epigraph inclusion

Take any  $(x,t)\in \operatorname{epi} f$ . By definition,  $t\ge f(x)$ .  
Since  $h(x)\le f(x)$ , we get  $t\ge f(x)\ge h(x)$ . Hence  $(x,t)\in\operatorname{epi} h$ .

So:

$$
\operatorname{epi} f \subseteq \operatorname{epi} h.
$$

### Step 2: Convexify

Because  $h$  is convex,  $\operatorname{epi} h$  is convex. Any convex set containing  $\operatorname{epi} f$  must contain its convex hull, so:

$$
E=\operatorname{conv}(\operatorname{epi} f)\subseteq \operatorname{epi} h.
$$

### Step 3: Take vertical slices at a fixed  $x$ 

Fix  $x$ . Define the feasible heights of  $E$  above  $x$ :

$$
T(x):=\{t:(x,t)\in E\}.
$$

Then by definition:

$$
g(x)=\inf T(x).
$$

But since  $E\subseteq \operatorname{epi} h$ , every  $(x,t)\in E$  satisfies  $t\ge h(x)$ . In other words:

$$
t\in T(x)\ \Rightarrow\ t\ge h(x).
$$

So the infimum of  $T(x)$  is also at least  $h(x)$ :

$$
g(x)=\inf T(x)\ \ge\ h(x).
$$

Equivalently:

$$
h(x)\le g(x)\quad\forall x.
$$

That’s exactly the “largest convex underestimator” statement.

### Edge case sanity check

If  $T(x)=\varnothing$ , we define  $g(x)=+\infty$ . Then  $h(x)\le g(x)$  holds trivially. So the statement is domain-safe.

* * *

Mental picture that won’t betray you later
------------------------------------------

*   A convex underestimator  $h\le f$  means: **epi $f$  sits inside epi $h$ **.
*   epi $h$  is convex, so it must contain **the convex hull** of epi $f$ .
*   That convex hull determines a “lowest possible boundary” at each  $x$ ; that boundary is  $g$ .
*   Therefore every such  $h$  must lie below  $g$ . So (

## Prompt:
g(x) is the inf vertical difference between f and its convex hull?

## Response:
Short answer: **almost, but not quite**.  
Long answer: let’s pin it down precisely so the geometry doesn’t drift into a false picture.

* * *

The precise geometric truth
---------------------------

### ❌ What is **not** correct

It is **not** accurate to say:

> “ $g(x)$  is the inf vertical difference between  $f$  and its convex hull.”

because:

*   The **convex hull is not a function**.
*   The convex hull lives in  $\mathbb R^{n+1}$ , not in  $\mathbb R^n$ .
*   There is no meaningful object called “the convex hull of  $f$ ” at the level of graphs.

So there is no vertical difference “between two functions” here.

* * *

✅ The correct geometric statement
---------------------------------

The correct statement is:

> ** $g(x)$  is the lowest vertical height at which the vertical line through  $x$  intersects the convex hull of the epigraph of  $f$ .**

Formally:

$$
g(x)=\inf\{t\in\mathbb R : (x,t)\in \operatorname{conv}(\operatorname{epi} f)\}.
$$

That is the entire definition, and every correct intuition must reduce to that.

* * *

Rephrasing it safely (intuition-preserving)
-------------------------------------------

Here are **equivalent, correct** ways to say it.

### Version 1 — vertical slice language

Fix  $x$ . Look at the vertical line

$$
L_x := \{(x,t): t\in\mathbb R\}.
$$

Then:

*    $\operatorname{conv}(\operatorname{epi} f)$  is a convex region in  $(x,t)$ \-space.
*    $g(x)$  is the **lowest point of intersection** between  $L_x$  and that region.

No subtraction, no difference — just intersection height.

* * *

### Version 2 — “bottom boundary” language

$$
\operatorname{epi} g = \text{the bottom boundary of } \operatorname{conv}(\operatorname{epi} f)
$$

(up to closure).

So  $g$  is the **function whose epigraph equals the convex hull of the epigraph of  $f$ **.

This is the cleanest geometric characterization.

* * *

### Version 3 — convex-combination interpretation (algebraic intuition)

A point  $(x,t)$  lies in  $\operatorname{conv}(\operatorname{epi} f)$  **iff**

$$
x=\sum_{i=1}^k \lambda_i x_i, \qquad t\ge \sum_{i=1}^k \lambda_i f(x_i), \qquad \lambda_i\ge0,\ \sum\lambda_i=1.
$$

Therefore:

$$
\boxed{ g(x) = \inf_{\substack{x=\sum \lambda_i x_i\\ \lambda_i\ge0,\ \sum\lambda_i=1}} \sum_{i=1}^k \lambda_i f(x_i) }
$$

This shows exactly what  $g(x)$  is doing:

*   You are allowed to **explain  $x$ ** as a convex combination of other points.
*   You pay the corresponding **convex combination of function values**.
*    $g(x)$  is the **cheapest possible such explanation**.

This is why  $g$  is convex and why it sits below  $f$ .

* * *

Where the “vertical difference” intuition _can_ be salvaged
-----------------------------------------------------------

You _can_ safely say:

> The **gap**  $f(x)-g(x)$  is the vertical distance between the graph of  $f$  and the bottom boundary of the convex hull of its epigraph.

That is correct, because now both objects are evaluated at the same  $x$ :

*   top point:  $(x,f(x))\in\operatorname{epi} f$ 
*   bottom point:  $(x,g(x))\in\partial\,\operatorname{conv}(\operatorname{epi} f)$ 

But crucially:

*    $g(x)$  itself is **not a difference**
*   It is a **height**, defined independently of  $f(x)$ 

* * *

One-sentence canonical formulation (worth memorizing)
-----------------------------------------------------

> **The convex envelope  $g$  is the unique function whose epigraph is the convex hull of the epigraph of  $f$ .**

Everything else follows from that.

* * *

If you want, next we can:

*   connect this directly to **supporting hyperplanes / affine minorants**
*   show why this equals the **biconjugate  $f^{**}$ **
*   or dissect a pathological example where the infimum is not attained (domain subtleties)

This is one of those definitions where getting the geometry _exactly right_ saves you from years of silent confusion later.

## Prompt:
is the lowest height of the convex hull?

## Response:
Yes — **with one precision tweak**:

### What’s exactly true

For each fixed  $x$ ,

$$
g(x)=\inf\{t:(x,t)\in \operatorname{conv}(\operatorname{epi} f)\}
$$

is the **lowest height (smallest  $t$ ) on the vertical line above  $x$ ** that lies inside the convex hull of the epigraph.

So it’s the “lowest height of the convex hull” **at that  $x$ ** (i.e., the bottom of the vertical slice).

### What’s _not_ the right interpretation

It is **not** “the globally lowest height anywhere in the convex hull” (that would be a single number). It’s a **function of  $x$ **: you take the lowest point _over each vertical line_.

### Clean mental picture

*   Build  $E=\operatorname{conv}(\operatorname{epi} f)$  in  $\mathbb R^{n+1}$ .
*   For each  $x$ , drop a vertical line.
*    $g(x)$  is where that line first hits  $E$  from below (or  $+\infty$  if it never hits).

That’s the convex envelope in one image.

## Prompt:
is the map of the function on the lowest possible height of convex hull?

## Response:
Yes — that’s basically the right mental model. Here’s the precise, “no-handwaving” version so it doesn’t mislead you later.

The clean statement
-------------------

Let

$$
E := \operatorname{conv}(\operatorname{epi} f)\subset \mathbb{R}^{n+1}.
$$

For each  $x\in\mathbb{R}^n$ , define the **vertical slice**

$$
E_x := \{\, t\in\mathbb{R} : (x,t)\in E \,\}.
$$

Then the convex envelope is exactly the map

$$
\boxed{g(x) = \inf E_x.}
$$

So: ** $g$  maps each  $x$  to the lowest possible height  $t$ ** such that  $(x,t)$  lies in the convex hull  $E$ .

What this means geometrically
-----------------------------

*   You take the convex hull  $E$  (a convex “solid” in  $(x,t)$ \-space).
*   For each  $x$ , you look straight up/down along the vertical line over  $x$ .
*    $g(x)$  is the “floor height” of  $E$  above that  $x$ .

Equivalently (the best epigraph phrasing):

$$
\operatorname{epi} g = \overline{\,E + (\{0\}^n\times\mathbb{R}_+)\,}
$$

(closure only matters if the infimum is not attained).

Two important caveats (so the picture stays honest)
---------------------------------------------------

1.  **“Lowest possible height of the convex hull” is per  $x$ **, not a single global minimum.  
    It’s the lowest boundary **in each vertical slice**.
2.  **That “floor” might not be an actual point in  $E$ ** (infimum not attained).  
    So sometimes  $(x,g(x))\notin E$  even though  $g(x)$  is defined as the infimum. That’s why closures show up in the rigorous proof.

* * *

If you want a super crisp one-liner to remember:

> ** $g$  is the function whose epigraph is the convex hull of the epigraph of  $f$ ** (up to closure), so  $g(x)$  is the bottom boundary height of that convexified epigraph above  $x$ .

## Prompt:
Back to the proof.

## Response:
Cool. Let’s go back to the proof and do it **cleanly, step-by-step, with no geometry handwaving**.

We’re proving **Exercise 3.30 (BV)**:

Given  $f:\mathbb R^n\to\mathbb R$  (really best treated as extended-real when needed), define

$$
E := \operatorname{conv}(\operatorname{epi} f)\subset \mathbb R^{n+1}, \qquad g(x):=\inf\{t\in\mathbb R:\ (x,t)\in E\}.
$$

Claim:  $g$  is convex and is the **largest convex underestimator** of  $f$ :  
if  $h$  is convex and  $h\le f$  pointwise, then  $h\le g$ .

I’ll prove, in order:

1.   $g\le f$ 
2.   $g$  is convex
3.  maximality: any convex  $h\le f$  satisfies  $h\le g$ 

(And I’ll keep the “inf not attained” subtlety honest.)

* * *

0) Definitions you must keep straight
-------------------------------------

### Epigraph

$$
\operatorname{epi} f := \{(x,t)\in\mathbb R^{n+1}: t\ge f(x)\}.
$$

### Convex hull

 $\operatorname{conv}(S)$  is the set of all finite convex combinations of points in  $S$ :

$$
\operatorname{conv}(S) = \left\{ \sum_{i=1}^k\lambda_i z_i :\ z_i\in S,\ \lambda_i\ge0,\ \sum_{i=1}^k\lambda_i=1 \right\}.
$$

### The vertical slice at  $x$ 

$$
T(x):=\{t\in\mathbb R:(x,t)\in E\}.
$$

Then

$$
g(x)=\inf T(x),
$$

and if  $T(x)=\varnothing$ , it’s standard to set  $g(x)=+\infty$ . (BV often suppresses this, but it makes statements domain-safe.)

* * *

1) First easy but essential fact:  $g(x)\le f(x)$ 
--------------------------------------------------

Fix any  $x\in\mathbb R^n$ .

*   By definition of epigraph,  $(x,f(x))\in\operatorname{epi} f$  because  $f(x)\ge f(x)$ .
*   Since  $\operatorname{epi} f\subseteq \operatorname{conv}(\operatorname{epi} f)=E$ , we also have  $(x,f(x))\in E$ .

So  $f(x)\in T(x)$  (it’s a feasible height), hence the infimum over  $T(x)$  is no bigger:

$$
g(x)=\inf T(x)\le f(x).
$$

So  $g$  is an **underestimator** of  $f$ .

* * *

2) Prove  $g$  is convex (direct Jensen-style proof)
----------------------------------------------------

We must show: for all  $x,y\in\mathbb R^n$  and  $\theta\in[0,1]$ ,

$$
g(\theta x+(1-\theta)y)\ \le\ \theta g(x) + (1-\theta)g(y).
$$

### Step 2.1: Use “infimum” correctly (introduce  $\varepsilon$ )

Let  $\varepsilon>0$  be arbitrary.

Because  $g(x)=\inf T(x)$ , we can find some  $t_x\in T(x)$  such that

$$
t_x \le g(x)+\varepsilon, \quad\text{and}\quad (x,t_x)\in E.
$$

Similarly, choose  $t_y\in T(y)$  such that

$$
t_y \le g(y)+\varepsilon, \quad\text{and}\quad (y,t_y)\in E.
$$

(Why is this always possible? Because “infimum” means there exist feasible points arbitrarily close above it, even if the infimum isn’t attained.)

### Step 2.2: Use convexity of  $E$ 

Since  $E$  is convex and  $(x,t_x),(y,t_y)\in E$ , their convex combination lies in  $E$ :

$$
\big(\theta x+(1-\theta)y,\ \theta t_x+(1-\theta)t_y\big)\in E.
$$

That means the height  $\theta t_x+(1-\theta)t_y$  is feasible for  $g(\theta x+(1-\theta)y)$ . So:

$$
g(\theta x+(1-\theta)y) \le \theta t_x+(1-\theta)t_y.
$$

### Step 2.3: Substitute the  $\varepsilon$ \-bounds

Using  $t_x\le g(x)+\varepsilon$  and  $t_y\le g(y)+\varepsilon$ ,

$$
\theta t_x+(1-\theta)t_y \le \theta(g(x)+\varepsilon)+(1-\theta)(g(y)+\varepsilon) = \theta g(x)+(1-\theta)g(y)+\varepsilon.
$$

So we have

$$
g(\theta x+(1-\theta)y) \le \theta g(x)+(1-\theta)g(y)+\varepsilon.
$$

### Step 2.4: Send  $\varepsilon\downarrow 0$ 

Because this holds for every  $\varepsilon>0$ , we conclude

$$
g(\theta x+(1-\theta)y) \le \theta g(x)+(1-\theta)g(y).
$$

So ** $g$  is convex.**

That proof is fully “inf-attainment safe”.

* * *

3) Prove maximality:  $g$  is the largest convex underestimator
---------------------------------------------------------------

Assume  $h$  is convex and  $h(x)\le f(x)$  for all  $x$ . We must show:

$$
h(x)\le g(x)\quad\forall x.
$$

### Step 3.1: Translate  $h\le f$  into epigraph inclusion

Take any  $(x,t)\in\operatorname{epi} f$ . Then  $t\ge f(x)$ .  
Since  $h(x)\le f(x)$ , we get  $t\ge f(x)\ge h(x)$ , which exactly says  $(x,t)\in\operatorname{epi} h$ .

So:

$$
\operatorname{epi} f \subseteq \operatorname{epi} h.
$$

### Step 3.2: Convexify the inclusion

Because  $h$  is convex,  $\operatorname{epi} h$  is convex (standard theorem: epigraph convex ⇔ function convex).

Since  $\operatorname{epi} h$  is convex and contains  $\operatorname{epi} f$ , it must contain the **smallest convex set** containing  $\operatorname{epi} f$ , namely its convex hull:

$$
E=\operatorname{conv}(\operatorname{epi} f)\subseteq \operatorname{epi} h.
$$

### Step 3.3: Use vertical slices

Fix  $x$ . Consider again

$$
T(x)=\{t:(x,t)\in E\}.
$$

If  $t\in T(x)$ , then  $(x,t)\in E\subseteq \operatorname{epi} h$ . But  $(x,t)\in\operatorname{epi} h$  means exactly:

$$
t\ge h(x).
$$

So **every feasible height**  $t\in T(x)$  satisfies  $t\ge h(x)$ .

Therefore the infimum of  $T(x)$  also satisfies:

$$
g(x)=\inf T(x)\ \ge\ h(x).
$$

Equivalently:

$$
h(x)\le g(x)\quad\forall x.
$$

That proves  $g$  is the **largest** convex function lying below  $f$ .

(And if  $T(x)=\varnothing$ , then  $g(x)=+\infty$  by convention and the inequality still holds automatically.)

* * *

What we proved (tight summary)
------------------------------

*    $g\le f$  because  $(x,f(x))\in\operatorname{epi} f\subseteq E$ .
*    $g$  is convex because  $E$  is convex and the inf definition plus an  $\varepsilon$ \-argument yields Jensen’s inequality.
*    $g$  is the **largest convex underestimator** because any convex  $h\le f$  implies  $\operatorname{epi} f\subseteq \operatorname{epi} h$ , hence  $E\subseteq\operatorname{epi} h$ , forcing  $h(x)\le \inf\{t:(x,t)\in E\}=g(x)$ .

* * *

If you want the next layer of the same proof: I can show the common equivalent formula

$$
g(x)=\inf_{\substack{x=\sum \lambda_i x_i\\ \sum\lambda_i=1,\ \lambda_i\ge0}} \sum \lambda_i f(x_i),
$$

and explain exactly where Carathéodory’s theorem enters (why you only need  $k\le n+2$  points in  $\mathbb R^{n+1}$ , hence  $k\le n+1$  in  $\mathbb R^n$  depending on formulation).

## Prompt:
![Uploaded image](https://chatgpt.com/backend-api/estuary/content?id=file_000000009dd871f5b9674ab2876f143c&ts=490522&p=fs&cid=1&sig=bbc6134f600739be1e705bbab938d656df8fdb3189480914dfa49c5d0f5eae23&v=0)

![Uploaded image](https://chatgpt.com/backend-api/estuary/content?id=file_0000000048b871f58751523c75d57f74&ts=490522&p=fs&cid=1&sig=b8d95d896f1209c1ed395e9e97c837ae81a161b47ce89556e3e4363cb407668c&v=0)

## Response:
Thought for 42s

Great — **4.7 is one of BV’s “secret weapons” problems**: it teaches you how to turn certain _fractional_ objectives into either (i) **quasiconvex feasibility via sublevel sets**, or (ii) an **honest convex program** via the **perspective transform**.

I’ll do (a)(b)(c) in a tight logical chain, with the exact change of variables and the “why convex?” checks made explicit.

* * *

Setup (common to all parts)
===========================

We consider

$$
\min_x \ \frac{f_0(x)}{c^T x + d} \quad\text{s.t.}\quad f_i(x)\le 0,\ i=1,\dots,m,\qquad Ax=b,
$$

with  $f_0,f_1,\dots,f_m$  convex, and objective domain

$$
\{x\in\mathrm{dom}\,f_0:\ c^Tx+d>0\}.
$$

A key construction: the **perspective** of a function  $f$ .

Perspective definition (BV §3.2.6)
----------------------------------

For a function  $f:\mathbb R^n\to\mathbb R\cup\{+\infty\}$ , its perspective is the function

$$
\tilde f(y,t) = \begin{cases} t\, f\!\left(\dfrac{y}{t}\right), & t>0,\\[6pt] +\infty, & t\le 0. \end{cases}
$$

BV denotes these as  $g_i(y,t)$  in this problem.

**Fact:** If  $f$  is convex, then its perspective  $\tilde f$  is convex on  $\{(y,t):t>0\}$ .

* * *

(a) Show the problem is quasiconvex
===================================

A problem is **quasiconvex** if all its **sublevel sets** are convex, i.e. for every real  $\alpha$ ,

$$
\{x: \text{objective}(x)\le \alpha\ \text{and constraints}\} \quad\text{is convex}.
$$

So fix any  $\alpha\in\mathbb R$ . Consider the sublevel set

$$
S_\alpha = \left\{ x: \frac{f_0(x)}{c^Tx+d}\le \alpha,\ f_i(x)\le 0,\ Ax=b,\ c^Tx+d>0 \right\}.
$$

Because  $c^Tx+d>0$  on the domain, we can multiply the inequality safely:

$$
\frac{f_0(x)}{c^Tx+d}\le \alpha \quad\Longleftrightarrow\quad f_0(x)\le \alpha(c^Tx+d).
$$

Move everything to one side:

$$
f_0(x)-\alpha(c^Tx+d)\le 0.
$$

Now check convexity:

*    $f_0(x)$  is convex by assumption.
*    $\alpha(c^Tx+d)$  is **affine** in  $x$  (for fixed  $\alpha$ ).
*   Convex minus affine is convex (adding an affine function never changes convexity).

So the function

$$
\phi_\alpha(x):=f_0(x)-\alpha(c^Tx+d)
$$

is convex, hence its sublevel set  $\{x:\phi_\alpha(x)\le 0\}$  is convex.

The other constraints:

*    $f_i(x)\le 0$  are convex constraints because each  $f_i$  is convex.
*    $Ax=b$  is affine (hence convex).
*    $c^Tx+d>0$  is an open half-space (convex).

Therefore  $S_\alpha$  is an intersection of convex sets ⇒ **convex**.

So every sublevel set is convex ⇒ the objective is **quasiconvex**, and the whole problem is a **quasiconvex optimization problem**.

* * *

(b) Equivalence to a convex problem via perspective
===================================================

BV claims the problem is equivalent to:

$$
\begin{aligned} \min_{y,t}\quad & g_0(y,t)\\ \text{s.t.}\quad & g_i(y,t)\le 0,\ i=1,\dots,m\\ & Ay=bt\\ & c^Ty+dt=1, \end{aligned}
$$

where  $g_i$  is the perspective of  $f_i$ :

$$
g_i(y,t)=t\,f_i\!\left(\frac{y}{t}\right),\quad t>0.
$$

Step 1: The change of variables (the “fraction killer”)
-------------------------------------------------------

Given a feasible  $x$  with  $c^Tx+d>0$ , define

$$
t := \frac{1}{c^Tx+d} \quad (>0), \qquad y := \frac{x}{c^Tx+d} = t x.
$$

Then automatically:

$$
c^T y + d t = c^T(tx)+dt = t(c^Tx+d)=1.
$$

Also, if  $Ax=b$ , then

$$
Ay = A(tx)=tAx = tb,
$$

so

$$
Ay=bt.
$$

And for each constraint  $f_i(x)\le 0$ , note  $x=y/t$ , so

$$
f_i\!\left(\frac{y}{t}\right)\le 0 \quad\Longleftrightarrow\quad t\,f_i\!\left(\frac{y}{t}\right)\le 0 \quad\Longleftrightarrow\quad g_i(y,t)\le 0,
$$

because  $t>0$ .

Finally the objective transforms as

$$
\frac{f_0(x)}{c^Tx+d} = t f_0(x) = t f_0\!\left(\frac{y}{t}\right) = g_0(y,t).
$$

So any feasible  $x$  maps to a feasible  $(y,t)$  with the same objective value.

Step 2: Inverse map (to show true equivalence)
----------------------------------------------

Now start with feasible  $(y,t)$  with  $t>0$  and  $c^Ty+dt=1$ .  
Define

$$
x := \frac{y}{t}.
$$

Then

$$
c^Tx + d = c^T\left(\frac{y}{t}\right)+d = \frac{c^Ty+dt}{t} = \frac{1}{t}>0.
$$

Also  $Ay=bt \Rightarrow A(y/t)=b$ , so  $Ax=b$ .  
And  $g_i(y,t)\le 0$  means  $t f_i(y/t)\le 0$ , and since  $t>0$ ,  $f_i(x)\le 0$ .

Objective matches:

$$
g_0(y,t) = t f_0(y/t)= \frac{f_0(x)}{c^Tx+d}.
$$

So this is a **bijective transformation between feasible sets** (modulo the natural domains), preserving objective value ⇒ the problems are **equivalent**.

* * *

Step 3: Show the transformed problem is convex
----------------------------------------------

We check each piece:

1.  **Objective**  $g_0(y,t)=t f_0(y/t)$  is a perspective of convex  $f_0$  ⇒  $g_0$  is convex on  $t>0$ .
2.  Inequalities  $g_i(y,t)\le 0$ : each  $g_i$  is convex ⇒ convex constraints.
3.  Equalities:
    *    $Ay=bt$  is affine in  $(y,t)$ .
*    $c^Ty+dt=1$  is affine.

Thus: minimize a convex function subject to convex inequalities + affine equalities ⇒ **convex optimization problem**.

* * *

(c) Convex formulation for convex–concave fractional problem
============================================================

Now objective is

$$
\min_x \ \frac{f_0(x)}{h(x)} \quad\text{s.t.}\quad f_i(x)\le 0,\ Ax=b,
$$

where:

*    $f_0,f_i$  convex,
*    $h$  concave,
*   domain includes  $h(x)>0$ ,
*   and BV assumes  $f_0(x)\ge 0$  everywhere (this matters for scaling/meaningfulness).

There are **two correct “convex ways” to handle it**, and BV’s hint says “following a similar argument”, so I’ll give the perspective-style convex program that mirrors (b), and also the quasiconvex feasibility form (which is the practical algorithmic route).

* * *

(c1) Quasiconvex sublevel-set formulation (the cleanest logic)
--------------------------------------------------------------

Fix  $\alpha$ . The sublevel condition

$$
\frac{f_0(x)}{h(x)}\le \alpha \quad\Longleftrightarrow\quad f_0(x)\le \alpha\, h(x), \quad (h(x)>0).
$$

Rewrite as

$$
f_0(x) - \alpha h(x)\le 0.
$$

Now check convexity **for  $\alpha\ge 0$ **:

*    $f_0$  convex.
*    $h$  concave ⇒  $-h$  convex.
*   Multiply by  $\alpha\ge 0$ :  $-\alpha h$  is convex.
*   Sum convex + convex ⇒ convex.

So for  $\alpha\ge 0$ , the feasibility problem

$$
\text{find }x\text{ s.t. } f_0(x)-\alpha h(x)\le 0,\ f_i(x)\le 0,\ Ax=b,\ h(x)>0
$$

is a **convex feasibility problem**.

Hence the original fractional problem is **quasiconvex** and can be solved by **bisection on  $\alpha$ ** with convex feasibility checks.

That’s already a “convex formulation” in the BV sense: it reduces to solving a sequence of convex problems.

* * *

(c2) Perspective-style convex program (closest in spirit to part (b))
---------------------------------------------------------------------

We try to mimic the trick  $t=1/\text{denominator}$ , but now denominator is  $h(x)$  (concave). Define variables  $y\in\mathbb R^n, t>0$  and interpret  $x=y/t$ . Consider:

*   Objective:
    
$$
g_0(y,t)=t f_0(y/t)
$$

(convex, perspective of convex  $f_0$ ).

*   Constraints  $f_i(x)\le 0$  become
    
$$
t f_i(y/t)\le 0 \quad\Longleftrightarrow\quad g_i(y,t)\le 0
$$

(convex).

*   Equality  $Ax=b$  becomes
    
$$
A(y/t)=b \ \Longleftrightarrow\ Ay=bt
$$

(affine).

Now we need to encode “ $t = 1/h(x)$ ” without using a nonconvex equality. Use the **perspective of the concave function**  $h$ :

$$
\hat h(y,t):=t\,h(y/t).
$$

**Fact:** if  $h$  is concave, then  $\hat h$  is concave on  $t>0$ . (Perspective preserves concavity too.)

We want the normalization corresponding to  $h(x)=1/t$ , i.e.

$$
t h(y/t)=1.
$$

Equality to a concave function is not convex, but we can use the **inequality**

$$
t h(y/t)\ \ge\ 1.
$$

This is a **superlevel set of a concave function**, hence **convex**:

$$
\{(y,t): \hat h(y,t)\ge 1\}\ \text{is convex because }\hat h\text{ is concave}.
$$

Putting it together, a convex formulation is:

$$
\boxed{ \begin{aligned} \min_{y,t}\quad & t f_0(y/t)\\ \text{s.t.}\quad & t f_i(y/t)\le 0,\ i=1,\dots,m\\ & Ay = bt\\ & t\,h(y/t)\ \ge\ 1\\ & t>0. \end{aligned}}
$$

### Why this still matches the original fraction

At an optimum, the constraint  $t h(y/t)\ge 1$  will be **tight** (intuitively: if you can scale  $(y,t)$  down while maintaining feasibility, the objective—being positively homogeneous of degree 1—scales down too, so you push until the normalization binds). With the binding constraint,  $t=1/h(x)$  and objective becomes  $f_0(x)/h(x)$  exactly, paralleling (b).

So (c2) is a genuine convex program in  $(y,t)$  whose optimum corresponds to the fractional optimum.

* * *

The given example (trace over geometric mean)
=============================================

They propose:

$$
f_0(x)=\frac{\mathrm{tr}(F(x))}{m}, \qquad h(x)=(\det F(x))^{1/m},
$$

with  $F(x)=F_0+\sum_{i=1}^n x_i F_i \in \mathbb S^m$  and domain  $F(x)\succ 0$ .

*    $\mathrm{tr}(F(x))$  is affine in  $x$ , hence convex.
*    $(\det F)^{1/m}$  is concave on  $F\succ 0$  (classical matrix concavity result:  $\log\det$  concave ⇒  $\det^{1/m}$  concave).  
    So it fits convex/concave fractional framework perfectly, and you can apply (c1) bisection or (c2) perspective normalization.

* * *

What to take away
-----------------

*   (a) is about **quasiconvexity** via convex sublevel sets.
*   (b) is the special affine-denominator case where a **single convex reformulation** exists via **perspective + linear normalization**.
*   (c) generalizes to concave denominator: you still get convex feasibility (bisection), and you can also write a perspective-style convex program using a **concave perspective superlevel constraint**.

If you want, I can also write the (c1) bisection procedure explicitly (including how to pick initial  $\alpha_{\min},\alpha_{\max}$  and what convex feasibility problem you solve each step), since BV often expects you to operationalize it.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)