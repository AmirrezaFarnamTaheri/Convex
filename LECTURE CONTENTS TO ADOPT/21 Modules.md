# Detailed optimization breakdown

**User:** Anonymous (meqrvsl88948@hotmail.com)  
**Created:** 12/16/2025 14:17:42  
**Updated:** 12/16/2025 15:33:21  
**Exported:** 12/16/2025 15:37:44  
**Link:** [https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3-expanded/c/694138cc-40e0-8328-a1f9-4973025bdd57](https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3-expanded/c/694138cc-40e0-8328-a1f9-4973025bdd57)  

## Prompt:
Further unpack, breakdown this. Be more granular, detailed, deeper, rigorous. Explain completer, zero to hero, more detailed, make everything crystal clear as a newcomer walkthrough.

# Module 0 — Mathematical atoms (fully rigorous + fully intuitive)

## 0) The meta-skill you’re building

In convex optimization and duality, you’ll repeatedly do these three moves:

1. **Mixing**: understand what “combining points” means and what shapes it preserves.
2. **Measuring**: understand “size” and “alignment” as geometry encoded in algebra.
3. **Pullback**: understand constraints as **preimages** of sets under functions.

If you master these now, later modules won’t feel like symbol manipulation—they’ll feel like inevitable geometry.

---

# 1) Scalars, vectors, matrices — definitions and “what equality means”

## 1.1 Scalars

A **scalar** is an element of (\mathbb R). Equality is the usual equality on real numbers.

---

## 1.2 Vectors in (\mathbb R^n)

### Definition

A **vector** is an ordered (n)-tuple of real numbers:
[
x=(x_1,\dots,x_n)^\top \in \mathbb R^n.
]

### Equality of vectors (componentwise)

**Claim.**
[
x=y \quad\Longleftrightarrow\quad x_i=y_i \text{ for all } i=1,\dots,n.
]
**Reason:** by definition, an ordered tuple is determined by its entries.

### Addition and scalar multiplication

Define operations for (x,y\in\mathbb R^n), (\alpha\in\mathbb R):
[
(x+y)_i := x_i+y_i,\qquad (\alpha x)_i := \alpha x_i.
]

**Verbal picture (useful):**

* (x+y): add displacements (arrow head-to-tail).
* (\alpha x): scale/stretch/flip the arrow.

These operations are what “linearity” means later: “respects + and scalar multiplication”.

---

## 1.3 Matrices (A\in\mathbb R^{m\times n})

### Definition

A matrix is an array of real numbers (A=(a_{ij})) with (m) rows and (n) columns.

### Equality of matrices

[
A=B\quad\Longleftrightarrow\quad a_{ij}=b_{ij}\text{ for all } i,j.
]

### Matrix–vector product (definition + two viewpoints)

For (A\in\mathbb R^{m\times n}), (x\in\mathbb R^n), define (Ax\in\mathbb R^m) by:
[
(Ax)*i := \sum*{j=1}^n a_{ij}x_j.
]

Two ways to *see* this:

* **Row view:** row (i) is (A_{i:}\in\mathbb R^n), and
  [
  (Ax)*i = A*{i:}^\top x \quad\text{(dot product with row i)}.
  ]
* **Column view:** columns are (A_{:j}\in\mathbb R^m), and
  [
  Ax=\sum_{j=1}^n x_j A_{:j}.
  ]
  So (Ax) is a linear combination of columns with coefficients (x_j).

**Why this matters later:** “(b) is representable as (Ax)” means “(b) lies in the span of columns.”

---

# 2) Functions: domain/codomain/range/preimage (and proofs of preimage laws)

## 2.1 Function anatomy

A function is a map
[
f:\mathcal X\to \mathcal Y.
]

* **Domain** (\mathcal X): allowed inputs.
* **Codomain** (\mathcal Y): declared output space.

### Range (image)

[
\mathrm{range}(f)=f(\mathcal X)={f(x):x\in\mathcal X}\subseteq \mathcal Y.
]

**Important:** range is what happens; codomain is what you promised.

---

## 2.2 Preimage (inverse image)

### Definition

For any set (B\subseteq \mathcal Y), the **preimage** is
[
f^{-1}(B)={x\in\mathcal X : f(x)\in B}.
]

**Verbal meaning:** preimage is “the set of inputs that land inside (B).”

This exists even if (f) is not invertible.

---

## 2.3 Preimage laws (proved rigorously)

These are not “facts to memorize”; they are one-line logic.

Let (B,C\subseteq\mathcal Y). Then:

### (i) Union law

[
f^{-1}(B\cup C)=f^{-1}(B)\cup f^{-1}(C).
]

**Proof.** For any (x\in\mathcal X),
[
x\in f^{-1}(B\cup C)
\iff f(x)\in B\cup C
\iff (f(x)\in B)\ \text{or}\ (f(x)\in C)
]
[
\iff (x\in f^{-1}(B))\ \text{or}\ (x\in f^{-1}(C))
\iff x\in f^{-1}(B)\cup f^{-1}(C).
]
Since membership is equivalent for all (x), the sets are equal. ∎

### (ii) Intersection law

[
f^{-1}(B\cap C)=f^{-1}(B)\cap f^{-1}(C).
]

**Proof.** Same logic with “and”:
[
x\in f^{-1}(B\cap C)
\iff f(x)\in B\cap C
\iff (f(x)\in B)\ \text{and}\ (f(x)\in C)
]
[
\iff (x\in f^{-1}(B))\ \text{and}\ (x\in f^{-1}(C))
\iff x\in f^{-1}(B)\cap f^{-1}(C).
]
∎

### (iii) Complement law

Let complement be relative to (\mathcal Y): (B^c:=\mathcal Y\setminus B). Then
[
f^{-1}(B^c) = \big(f^{-1}(B)\big)^c \quad\text{(complement relative to }\mathcal X\text{)}.
]

**Proof.**
[
x\in f^{-1}(B^c)
\iff f(x)\in B^c
\iff f(x)\notin B
\iff x\notin f^{-1}(B)
\iff x\in (f^{-1}(B))^c.
]
∎

**Why this matters later:** constraints and level sets are preimages. Convexity/quasiconvexity are statements about those preimages being convex.

---

# 3) Linear / affine / convex combinations (mixing points correctly)

Let (x^{(1)},\dots,x^{(k)}\in\mathbb R^n), coefficients (\theta_1,\dots,\theta_k\in\mathbb R).

## 3.1 Linear combination

[
\sum_{i=1}^k \theta_i x^{(i)} \quad(\theta_i\in\mathbb R \text{ arbitrary}).
]

**Meaning:** you can add, subtract, overshoot, cancel. This generates spans/subspaces.

---

## 3.2 Affine combination

[
\sum_{i=1}^k \theta_i x^{(i)}\quad \text{with}\quad \sum_{i=1}^k \theta_i=1.
]

### Translation invariance (proved cleanly)

If you shift all points by (v), the affine combination shifts by (v).
Let (z=\sum_i\theta_i x^{(i)}) and (\sum_i\theta_i=1). Then
[
\sum_i\theta_i(x^{(i)}+v)=\sum_i\theta_i x^{(i)}+\left(\sum_i\theta_i\right)v=z+v.
]
So affine combinations are the right algebra for “geometry not tied to the origin” (lines/planes).

---

## 3.3 Convex combination

[
\sum_{i=1}^k \theta_i x^{(i)}\quad\text{with}\quad \theta_i\ge 0,\ \sum_{i=1}^k\theta_i=1.
]

**Meaning:** a weighted average; you cannot use negative “ingredients,” so you stay inside the filled-in shape.

### 2-point convex combinations = line segment (rigorous)

Fix (x,y\in\mathbb R^n). Consider
[
S:={(1-t)x+ty: t\in[0,1]}.
]

**Claim:** (S) is exactly the line segment from (x) to (y).

There are two ways to define “the line segment.” The cleanest is:

> The segment between (x) and (y) is the set ({x+t(y-x):t\in[0,1]}).

Now observe:
[
x+t(y-x)=x+ty-tx=(1-t)x+ty.
]
So the two parameterizations are identical, hence the sets are equal. ∎

**Why it’s foundational:** a set (C) is convex iff it contains this entire segment for every pair (x,y\in C).

---

# 4) Inner products and dot products (alignment, angles, orthogonality)

## 4.1 Inner product axioms

An inner product (\langle\cdot,\cdot\rangle) is a function (\mathbb R^n\times\mathbb R^n\to\mathbb R) such that for all (x,y,z) and scalars (\alpha,\beta):

1. Linearity in first argument:
   [
   \langle \alpha x+\beta z, y\rangle = \alpha\langle x,y\rangle+\beta\langle z,y\rangle
   ]
2. Symmetry:
   [
   \langle x,y\rangle=\langle y,x\rangle
   ]
3. Positive definite:
   [
   \langle x,x\rangle\ge 0,\quad \langle x,x\rangle=0 \iff x=0.
   ]

These are exactly what you need so that “length” and “angle” behave sensibly.

---

## 4.2 Dot product is an inner product (proved)

Define
[
\langle x,y\rangle := x^\top y := \sum_{i=1}^n x_i y_i.
]

### Linearity (full)

Let (u=\alpha x+\beta z). Then
[
\langle u,y\rangle=\sum_{i=1}^n (\alpha x_i+\beta z_i)y_i
=\alpha\sum_{i=1}^n x_i y_i + \beta\sum_{i=1}^n z_i y_i
=\alpha\langle x,y\rangle+\beta\langle z,y\rangle.
]

### Symmetry

[
\langle x,y\rangle=\sum_i x_i y_i=\sum_i y_i x_i=\langle y,x\rangle.
]

### Positive definiteness

[
\langle x,x\rangle=\sum_{i=1}^n x_i^2 \ge 0.
]
If (\sum_i x_i^2=0), then each (x_i^2=0), hence each (x_i=0), so (x=0). Conversely, if (x=0) then (\langle x,x\rangle=0). ∎

---

# 5) Norms and the three (\ell_p) norms (with all norm axioms proved)

## 5.1 Norm axioms (repeat, but now you *use* them)

A norm (|\cdot|) must satisfy:

1. (|x|\ge 0), and (|x|=0\iff x=0)
2. (|\alpha x|=|\alpha|,|x|)
3. (|x+y|\le |x|+|y|)

---

## 5.2 (\ell_1) is a norm (complete proof)

### Definition

[
|x|*1:=\sum*{i=1}^n |x_i|.
]

**(1) Nonnegativity + definiteness.**
Each (|x_i|\ge 0), so the sum is (\ge 0).
If (|x|_1=0), then (\sum |x_i|=0), so every (|x_i|=0), hence every (x_i=0), so (x=0).

**(2) Homogeneity.**
[
|\alpha x|_1=\sum_i |\alpha x_i|=\sum_i (|\alpha||x_i|)=|\alpha|\sum_i |x_i|=|\alpha||x|_1.
]

**(3) Triangle inequality.**
Using the scalar inequality (|a+b|\le |a|+|b|) (proved below),
[
|x+y|_1=\sum_i |x_i+y_i|\le \sum_i(|x_i|+|y_i|)=|x|_1+|y|_1.
]
∎

---

## 5.3 (\ell_\infty) is a norm (complete proof)

### Definition

[
|x|*\infty:=\max*{1\le i\le n}|x_i|.
]

**(1) Nonnegativity + definiteness.**
A maximum of nonnegative numbers is nonnegative.
If (|x|_\infty=0), then (\max_i |x_i|=0), so every (|x_i|=0), so (x=0).

**(2) Homogeneity.**
[
|\alpha x|*\infty=\max_i|\alpha x_i|=\max_i(|\alpha||x_i|)=|\alpha|\max_i|x_i|=|\alpha||x|*\infty.
]

**(3) Triangle inequality.**
For each (i),
[
|x_i+y_i|\le |x_i|+|y_i|\le |x|*\infty+|y|*\infty.
]
Take max over (i):
[
|x+y|*\infty=\max_i|x_i+y_i|\le |x|*\infty+|y|_\infty.
]
∎

---

## 5.4 (\ell_2) is a norm (complete proof)

### Definition

[
|x|_2:=\sqrt{x^\top x}=\sqrt{\sum_i x_i^2}.
]

**(1) Nonnegativity + definiteness.**
Square root of a sum of squares is (\ge 0).
If (|x|_2=0), then (\sum x_i^2=0), hence each (x_i=0), so (x=0).

**(2) Homogeneity.**
[
|\alpha x|_2=\sqrt{(\alpha x)^\top(\alpha x)}=\sqrt{\alpha^2 x^\top x}=|\alpha|\sqrt{x^\top x}=|\alpha||x|_2.
]

**(3) Triangle inequality.**
This one is the real work; we’ll prove it after Cauchy–Schwarz, because (\ell_2) geometry is inner-product geometry.

---

# 6) Foundational scalar lemmas (proved cleanly)

## Lemma A: 1D triangle inequality

For all (a,b\in\mathbb R),
[
|a+b|\le |a|+|b|.
]

### Proof (rigorous, no handwave)

Square both sides (both sides are (\ge 0), so squaring preserves inequality if we prove it):
[
(|a|+|b|)^2 = a^2 + 2|a||b| + b^2,
]
[
(a+b)^2 = a^2 + 2ab + b^2.
]
So
[
(|a|+|b|)^2 - (a+b)^2 = 2(|a||b|-ab).
]
Now note: (|a||b|\ge ab) always, because:

* if (ab\ge 0), then (|a||b|=ab);
* if (ab<0), then (|a||b|=-ab > ab).
  So the difference is (\ge 0), hence
  [
  (|a|+|b|)^2 \ge (a+b)^2.
  ]
  Taking square roots gives (|a|+|b|\ge |a+b|). ∎

**Equality condition:** (|a||b|=ab) ⇔ (ab\ge 0) (same sign or one is zero).

---

## Lemma B: Quadratic nonnegativity via completing the square

Let (q(t)=at^2+bt+c) with (a>0). Then (q(t)\ge 0\ \forall t\in\mathbb R) iff (b^2-4ac\le 0).

### Proof

[
q(t)=a\left(t+\frac{b}{2a}\right)^2 + \left(c-\frac{b^2}{4a}\right).
]
The squared term is (\ge 0), so (q(t)\ge 0\ \forall t) iff the constant term is (\ge 0):
[
c-\frac{b^2}{4a}\ge 0 \iff b^2\le 4ac \iff b^2-4ac\le 0.
]
∎

---

# 7) Cauchy–Schwarz (full proof + equality + meaning)

## Theorem (Cauchy–Schwarz)

For all (x,y\in\mathbb R^n),
[
|x^\top y|\le |x|_2|y|_2.
]

### Proof (the clean “distance can’t be negative” proof)

If (y=0), then LHS (=0), RHS (=|x|_2\cdot 0=0). True.

Assume (y\neq 0). Define
[
\phi(t)=|x-ty|_2^2 \ge 0 \quad\forall t\in\mathbb R.
]
Expand:
[
\phi(t)=(x-ty)^\top(x-ty)=x^\top x -2t x^\top y + t^2 y^\top y.
]
So (\phi(t)) is a quadratic:
[
\phi(t) = (y^\top y)t^2 -2(x^\top y)t + (x^\top x),
]
with
[
a=y^\top y=|y|_2^2>0,\quad b=-2(x^\top y),\quad c=x^\top x=|x|_2^2.
]
Since (\phi(t)\ge 0) for all (t), Lemma B implies:
[
b^2-4ac \le 0.
]
Compute:
[
(-2x^\top y)^2 - 4|y|_2^2|x|_2^2 \le 0
\iff (x^\top y)^2 \le |x|_2^2|y|_2^2.
]
Take square roots:
[
|x^\top y|\le |x|_2|y|_2.
]
∎

### Equality condition (precise)

Equality holds iff the discriminant is zero iff the quadratic touches 0 iff (\exists t) such that (|x-ty|_2^2=0), i.e. (x=ty).
So equality ⇔ (x) and (y) are linearly dependent (collinear).

### Meaning (non-poetic, exact)

(\frac{x^\top y}{|y|_2}) is the scalar projection length of (x) onto direction (y).
C–S says: projection length ≤ total length.

---

# 8) Triangle inequality for (\ell_2) (proved rigorously now)

## Theorem (Minkowski for (\ell_2))

[
|x+y|_2\le |x|_2+|y|_2.
]

### Proof (expand the square + C–S)

[
|x+y|_2^2=(x+y)^\top(x+y)=x^\top x + 2x^\top y + y^\top y
=|x|_2^2 + 2x^\top y + |y|_2^2.
]
By Cauchy–Schwarz, (x^\top y \le |x^\top y|\le |x|_2|y|_2). Hence
[
|x+y|_2^2 \le |x|_2^2 + 2|x|_2|y|_2 + |y|_2^2
= (|x|_2+|y|_2)^2.
]
Take square roots (both sides (\ge 0)):
[
|x+y|_2 \le |x|_2+|y|_2.
]
∎

### Equality condition (exact)

Equality holds iff (x^\top y = |x|_2|y|_2), i.e. equality in C–S with nonnegative alignment. This occurs iff (x=\alpha y) with (\alpha\ge 0).

---

# 9) Unit balls and convexity (a small theorem that matters later)

## Claim: the unit ball of any norm is convex

Let (B={x:|x|\le 1}). Then (B) is convex.

### Proof

Take any (x,y\in B), so (|x|\le 1), (|y|\le 1). For any (t\in[0,1]),
[
|(1-t)x+ty| \le |(1-t)x|+|ty|
= (1-t)|x| + t|y|
\le (1-t)\cdot 1 + t\cdot 1 = 1.
]
So ((1-t)x+ty\in B). Hence (B) is convex. ∎

**Meaning:** triangle inequality + homogeneity exactly encode convexity of “balls,” which is why norms and convexity are welded together.

---

# 10) Projection viewpoint (proved as an optimization problem, not folklore)

We claimed that minimizing (|x-ty|_2^2) finds the projection of (x) onto (\mathrm{span}{y}). Let’s prove the full story.

## Problem

Given (x\in\mathbb R^n) and nonzero (y\in\mathbb R^n), solve
[
\min_{t\in\mathbb R}\ |x-ty|_2^2.
]

### Solution (calculus method)

We already expanded:
[
\phi(t)=|x|_2^2 -2t(x^\top y)+t^2|y|_2^2.
]
Derivative:
[
\phi'(t)=-2(x^\top y)+2t|y|_2^2.
]
Set (\phi'(t)=0):
[
t^\star=\frac{x^\top y}{|y|_2^2}.
]

### Why this is a minimum (not a maximum)

Second derivative:
[
\phi''(t)=2|y|_2^2>0,
]
so (\phi) is strictly convex in (t), hence (t^\star) is the unique global minimizer.

### Orthogonality of residual (proved)

Let (r:=x-t^\star y). Then
[
y^\top r = y^\top x - t^\star y^\top y
= x^\top y - \frac{x^\top y}{|y|_2^2}|y|_2^2=0.
]
So the error (r) is orthogonal to (y).

### Pythagorean decomposition (derived)

Because (t^\star y \perp r),
[
|x|_2^2=|t^\star y + r|_2^2=|t^\star y|_2^2+|r|_2^2.
]
This is the algebraic form of “right triangle” in (\mathbb R^n).

**Why you should care later:** for least squares, the same orthogonality becomes (A^\top(Ax-b)=0), i.e. normal equations.

---

# 11) End-of-Module 0 “no gaps” checkpoint

You’re genuinely ready to move on only if you can reproduce these *with proof*:

1. Preimage laws (union/intersection/complement) by logical equivalences.
2. “Affine combination shifts correctly” proof using (\sum\theta_i=1).
3. Cauchy–Schwarz via (|x-ty|^2\ge 0) + discriminant/completing square.
4. Triangle inequalities for (\ell_1,\ell_\infty,\ell_2) with equality conditions.
5. Projection minimization with uniqueness + orthogonality + Pythagorean decomposition.
6. Convexity of a norm ball from triangle inequality + homogeneity.

---

## One sentence that bridges into Module 1 (dual norms)

Once unit balls feel real, this becomes obvious and important:

[
\sup_{|x|\le 1} y^\top x
]
is the “height” (support) of the unit ball in direction (y).
That quantity *is* the dual norm. This is where duality starts, quietly, before KKT.

---

Next we can prove the **polarization identity** and show how inner products can be recovered from norms (in Euclidean spaces), which locks in why “norm-from-inner-product” is special.

## Response:
Thought for 24s

Alright. We’re going to take your Module 0 and **atomize it further**—not by adding “more words”, but by adding the missing _micro-lemmas_, _logic moves_, _edge-case warnings_, and _geometric invariants_ that later become KKT/duality reflexes.

I’ll keep your structure, but I’ll insert the “why this step is legal” scaffolding everywhere.

* * *

Roadmap for this deeper pass
----------------------------

1.  **Meta-skill = “rewrite everything as membership logic.”**  
    Most convex-optimization “magic” is: _turn constraints into set membership_, _pull them back through functions_, _use convexity closure properties_.
2.  **We’ll make explicit**:
    *   how to prove **set equality** (two inclusions vs “iff membership”),
    *   why matrix–vector multiplication is _the_ definition that makes linearity inevitable,
    *   why “convex combination” is exactly “no negative ingredients + weights sum to 1,”
    *   how **Cauchy–Schwarz** is really a statement about “a squared distance can’t go negative,”
    *   how **norm axioms** are precisely what you need for convexity of balls.

* * *

0) The meta-skill you’re building (even more explicit)
======================================================

When you do convex optimization, you constantly convert between three languages:

### Language A: algebra

Expressions like  $Ax=b$ ,  $\|x\|\le 1$ ,  $f(x)\le t$ .

### Language B: geometry

“ $x$  lies in a subspace,” “inside a ball,” “below a surface.”

### Language C: logic/set membership

$$
x\in \{x:Ax=b\},\quad x\in \{x:\|x\|\le 1\},\quad x\in f^{-1}((-\infty,t]).
$$

**The core move** is:

> turn every constraint into “ $x \in \text{(some set)}$ ” and then understand how that set behaves under mixing and pullbacks.

That’s why preimages and convex combinations are not “background”—they _are_ the engine.

* * *

1) Scalars, vectors, matrices — definitions and “what equality means”
=====================================================================

1.0 Micro-lemma: how to prove equality (objects vs sets)
--------------------------------------------------------

*   For **numbers/vectors/matrices**: you usually prove equality by proving each coordinate/entry matches.
*   For **sets**: you almost never prove “ $A=B$ ” directly. You do either:
    1.  **Membership iff**: show  $\forall x,\ x\in A \iff x\in B$ .
    2.  **Two inclusions**: show  $A\subseteq B$  and  $B\subseteq A$ .  
        (And recall:  $A\subseteq B$  means  $\forall x,\ x\in A\Rightarrow x\in B$ .)

This is the exact pattern you used in preimage laws—good. We’ll reuse it everywhere.

* * *

1.1 Scalars
-----------

A scalar is just an element of  $\mathbb R$ .  
Equality is the usual equality relation on  $\mathbb R$ :  $a=b$ .

**Tiny but important:** the reason we can “subtract  $b$  from both sides” etc. is that  $(\mathbb R,+,\cdot)$  is a field. Later we rely on these cancellation laws implicitly.

* * *

1.2 Vectors in  $\mathbb R^n$ 
------------------------------

### Definition (fully formal)

 $\mathbb R^n$  is the set of all functions  $\{1,\dots,n\}\to\mathbb R$ .  
Concretely we represent such a function by an ordered  $n$ \-tuple:

$$
x=(x_1,\dots,x_n)^\top.
$$

### Equality (why componentwise is _the_ definition)

Two ordered tuples are equal iff all entries match:

$$
x=y \iff (\forall i\in\{1,\dots,n\})\ x_i=y_i.
$$

This is not a theorem; it’s how “ordered tuple” is defined.

### Addition and scalar multiplication (why those formulas are chosen)

We define:

$$
(x+y)_i:=x_i+y_i,\qquad (\alpha x)_i:=\alpha x_i.
$$

**Why these definitions are “the right ones”:** they make  $\mathbb R^n$  into a **vector space**, meaning the basic algebra rules you expect actually hold:

*    $x+y=y+x$ ,
*    $(x+y)+z=x+(y+z)$ ,
*    $\alpha(x+y)=\alpha x+\alpha y$ ,
*    $(\alpha+\beta)x=\alpha x+\beta x$ , etc.

If you want to be brutally rigorous: each of these can be proved entrywise using the corresponding property in  $\mathbb R$ . Example:

$$
(\alpha(x+y))_i=\alpha(x_i+y_i)=\alpha x_i+\alpha y_i=(\alpha x+\alpha y)_i \Rightarrow \alpha(x+y)=\alpha x+\alpha y.
$$

This “prove it coordinatewise” pattern is everywhere in matrix calculus and convex analysis.

* * *

1.3 Matrices  $A\in\mathbb R^{m\times n}$ 
------------------------------------------

### Definition

A matrix is a function  $\{1,\dots,m\}\times\{1,\dots,n\}\to\mathbb R$ , represented as entries  $a_{ij}$ .

### Equality

$$
A=B \iff (\forall i,j)\ a_{ij}=b_{ij}.
$$

Again: equality of functions = equality on all inputs.

* * *

1.4 Matrix–vector product (the definition, then the inevitability)
------------------------------------------------------------------

### Definition

For  $A\in\mathbb R^{m\times n}$ ,  $x\in\mathbb R^n$ , define  $Ax\in\mathbb R^m$  by

$$
(Ax)_i:=\sum_{j=1}^n a_{ij}x_j.
$$

### Why this is _the_ right definition

Because it makes the map  $x\mapsto Ax$  automatically **linear**:

#### Claim:  $A(x+y)=Ax+Ay$ .

Proof (entrywise):

$$
(A(x+y))_i=\sum_j a_{ij}(x_j+y_j)=\sum_j a_{ij}x_j+\sum_j a_{ij}y_j=(Ax)_i+(Ay)_i.
$$

So equality holds for every  $i$ , hence vectors are equal.

#### Claim:  $A(\alpha x)=\alpha Ax$ .

$$
(A(\alpha x))_i=\sum_j a_{ij}(\alpha x_j)=\alpha\sum_j a_{ij}x_j=\alpha(Ax)_i.
$$

So matrix multiplication isn’t “random”: it’s the coordinate formula that _forces_ linearity.

### Row view vs column view (with explicit equivalence)

*   Row view:  
    Let row  $i$  be  $A_{i:}\in\mathbb R^n$ . Then
    $$
    (Ax)_i = A_{i:}^\top x = \langle A_{i:},x\rangle.
    $$
*   Column view:  
    Let column  $j$  be  $A_{:j}\in\mathbb R^m$ . Then
    $$
    Ax = \sum_{j=1}^n x_j A_{:j}.
    $$

**Proof of column view:** check entry  $i$ :

$$
\left(\sum_j x_jA_{:j}\right)_i=\sum_j x_j(A_{:j})_i=\sum_j x_ja_{ij}=(Ax)_i.
$$

### Why “ $b$  is representable as  $Ax$ ” matters

$$
\{Ax: x\in\mathbb R^n\} = \text{span of columns of }A.
$$

So solving  $Ax=b$  is: “is  $b$  in the column space?”  
This becomes the geometric heart of feasibility and duality certificates later.

* * *

2) Functions: domain/codomain/range/preimage (and why preimage laws are _the_ laws)
===================================================================================

2.1 Function anatomy (with the subtle but crucial distinction)
--------------------------------------------------------------

A function  $f:\mathcal X\to\mathcal Y$  is a rule assigning **exactly one** output  $f(x)\in\mathcal Y$  to each input  $x\in\mathcal X$ .

*   **Domain**  $\mathcal X$ : what inputs are allowed.
*   **Codomain**  $\mathcal Y$ : what type of outputs you claim to produce.
*   **Range/image**:
    $$
    f(\mathcal X)=\{f(x):x\in\mathcal X\}\subseteq\mathcal Y.
    $$

Range is what actually happens.

### Why you must care in optimization

When a textbook says “ $\mathrm{dom}\,f$  is convex,” it means the set of points where  $f(x)$  is _finite/defined_ is convex. Domain issues are not pedantry; they decide if convexity statements are even meaningful.

* * *

2.2 Preimage  $f^{-1}(B)$  (and why the notation is dangerous)
--------------------------------------------------------------

### Definition

For any  $B\subseteq\mathcal Y$ ,

$$
f^{-1}(B)=\{x\in\mathcal X: f(x)\in B\}.
$$

### Big warning

 $f^{-1}(B)$  **does not mean** “the inverse function.”  
It exists even when  $f$  is not injective, not surjective, not invertible, not continuous, not anything.

**Example:** if  $f(x)=0$  for all  $x$ , then for any set  $B$ ,

*   if  $0\in B$ ,  $f^{-1}(B)=\mathcal X$ ,
*   if  $0\notin B$ ,  $f^{-1}(B)=\varnothing$ .

No inverse function exists, but preimages do.

* * *

2.3 Preimage laws (two proofs styles)
-------------------------------------

You gave “iff membership” proofs. That’s perfect. Let me add the _two-inclusion_ template because you’ll use it in convexity proofs.

### Union law

$$
f^{-1}(B\cup C)=f^{-1}(B)\cup f^{-1}(C).
$$

**Two-inclusion proof:**

1.  Show  $f^{-1}(B\cup C)\subseteq f^{-1}(B)\cup f^{-1}(C)$ .  
    Take  $x\in f^{-1}(B\cup C)$ . Then  $f(x)\in B\cup C$ , so  $f(x)\in B$  or  $f(x)\in C$ . Hence  $x\in f^{-1}(B)$  or  $x\in f^{-1}(C)$ . So  $x\in f^{-1}(B)\cup f^{-1}(C)$ .
2.  Reverse inclusion similarly.

Same content, different packaging. Both are worth being fluent in.

### Intersection and complement laws

Same idea; “or” becomes “and,” and complement becomes “not.”

* * *

2.4 The one preimage fact you’ll use constantly in convexity
------------------------------------------------------------

For a real-valued function  $f:\mathbb R^n\to\mathbb R$ , the **sublevel set**

$$
\{x: f(x)\le t\}
$$

is exactly the preimage:

$$
f^{-1}((-\infty,t]).
$$

So quasiconvexity (“all sublevel sets are convex”) is literally:

> preimages of convex sets  $(-\infty,t]$  under  $f$  are convex.

That’s why you drilled preimages.

* * *

3) Linear / affine / convex combinations (mixing points correctly)
==================================================================

We’ll add the “hulls” explicitly, because later you’ll need:

*   span,
*   affine hull,
*   convex hull.

3.1 Linear combinations and span
--------------------------------

A linear combination is  $\sum_i \theta_i x^{(i)}$  with  $\theta_i\in\mathbb R$ .

The set of all such combinations is the **span**:

$$
\mathrm{span}\{x^{(1)},\dots,x^{(k)}\}=\left\{\sum_i\theta_i x^{(i)}:\theta_i\in\mathbb R\right\}.
$$

It’s the smallest subspace containing those vectors.

**Key geometric feature:** spans are anchored at the origin (because subspaces must contain  $0$ ).

* * *

3.2 Affine combinations and affine hull
---------------------------------------

Affine combination:  $\sum_i\theta_i x^{(i)}$  with  $\sum_i\theta_i=1$ .

All affine combinations form the **affine hull**:

$$
\mathrm{aff}\{x^{(i)}\}=\left\{\sum_i\theta_i x^{(i)}:\sum_i\theta_i=1\right\}.
$$

It’s the smallest affine set (shifted subspace) containing the points.

### Translation invariance (why  $\sum\theta_i=1$  is exactly the condition)

You already proved:

$$
\sum_i\theta_i(x^{(i)}+v)=\left(\sum_i\theta_i x^{(i)}\right)+\left(\sum_i\theta_i\right)v.
$$

So if  $\sum_i\theta_i=1$ , shifting all points shifts the combination by the same  $v$ .  
This is precisely “geometry independent of origin.”

* * *

3.3 Convex combinations and convex hull
---------------------------------------

Convex combination:  $\theta_i\ge 0$  and  $\sum_i\theta_i=1$ .

All convex combinations form the **convex hull**:

$$
\mathrm{conv}\{x^{(i)}\}=\left\{\sum_i\theta_i x^{(i)}:\theta_i\ge 0,\ \sum_i\theta_i=1\right\}.
$$

It’s the smallest convex set containing the points.

### Why the nonnegativity matters

If you allow negatives, you can “subtract mass” and jump outside the filled-in shape.  
Convex combinations are literally “weighted averages,” and averages don’t use negative weights.

* * *

3.4 Two-point convex combos = segment (extra clarity)
-----------------------------------------------------

You showed parameterizations match:

$$
(1-t)x+ty = x+t(y-x).
$$

**What’s the conceptual content?**

*    $y-x$  is the direction from  $x$  to  $y$ .
*    $t\in[0,1]$  means you travel from “0% to 100%” of that direction.
*   Rewriting as  $(1-t)x+ty$  emphasizes “mixing ingredients.”

Both views are useful later:

*   direction form  $x+t(y-x)$  is good for derivatives along lines,
*   mixing form  $(1-t)x+ty$  is good for convexity inequalities.

* * *

4) Inner products and dot products (alignment, angles, orthogonality)
=====================================================================

4.1 Inner product axioms (why these exact three)
------------------------------------------------

An inner product  $\langle\cdot,\cdot\rangle$  is designed so that:

1.  **Linearity** gives you algebraic control (expansion, distributivity).
2.  **Symmetry** makes “angle between” symmetric.
3.  **Positive definiteness** makes  $\langle x,x\rangle$  behave like a squared length.

From these you define a norm:

$$
\|x\|:=\sqrt{\langle x,x\rangle}.
$$

And then geometry drops out (C–S, triangle inequality, projections).

So inner product → norm → convex balls → dual norms → duality. It’s a pipeline.

* * *

4.2 Dot product is an inner product (already good; here’s the hidden lemma)
---------------------------------------------------------------------------

Your proof is correct. The hidden lemma you used is:

> If  $\sum_{i=1}^n x_i^2=0$  and each term is  $\ge 0$ , then each term must be 0.

This is a general “nonnegative sum is zero ⇒ each term is zero” fact.

You’ll reuse that logic when proving KKT complementarity conditions imply something vanishes termwise.

* * *

4.3 A powerful generalization you’ll want soon: weighted inner products
-----------------------------------------------------------------------

For any symmetric positive definite matrix  $P\in\mathbf S_{++}^n$ , define

$$
\langle x,y\rangle_P := x^\top P y.
$$

Then  $\langle\cdot,\cdot\rangle_P$  is an inner product, and the induced norm is

$$
\|x\|_P = \sqrt{x^\top P x}.
$$

This is the algebra behind ellipsoids, quadratic objectives, and trust regions. (It’s not “extra”; it’s optimization’s native tongue.)

* * *

5) Norms and the  $\ell_1,\ell_2,\ell_\infty$  norms (deeper structure)
=======================================================================

5.1 Norm axioms (what each one _buys you_)
------------------------------------------

1.   $\|x\|\ge 0$  and  $\|x\|=0\iff x=0$ : prevents “different points have zero distance.”
2.   $\|\alpha x\|=|\alpha|\|x\|$ : scaling geometry behaves like scaling space.
3.   $\|x+y\|\le \|x\|+\|y\|$ : the straight path is shortest (metric geometry), and balls become convex.

A norm is exactly “a convex, homogeneous gauge with symmetry.” That’s why it’s glued to convex analysis.

* * *

5.2  $\ell_1$  and  $\ell_\infty$  proofs (your proofs are fine; here’s the micro-detail)
-----------------------------------------------------------------------------------------

When you wrote  $\sum_i |x_i+y_i|\le \sum_i(|x_i|+|y_i|)$ , you used:

*   scalar triangle inequality termwise,
*   then the fact that summation preserves inequalities: if  $a_i\le b_i$  for each  $i$ , then  $\sum_i a_i\le \sum_i b_i$ .

For  $\ell_\infty$ , you used:

*   for each  $i$ ,  $|x_i|\le \max_j|x_j|=\|x\|_\infty$ ,
*   then max preserves inequalities: if  $a_i\le M$  for all  $i$ , then  $\max_i a_i\le M$ .

Those “order-preserving” moves (sum/max preserve inequalities) are tiny but everywhere.

* * *

5.3  $\ell_2$ : why it’s special
--------------------------------

 $\ell_2$  is special because it comes from an inner product. That implies:

*   Cauchy–Schwarz,
*   parallelogram law,
*   exact projection geometry,
*   Pythagorean theorem.

Other norms do **not** generally have orthogonal projections with those properties.

* * *

6) Foundational scalar lemmas (make them “mental assembly instructions”)
========================================================================

Lemma A (1D triangle inequality): your proof + the conceptual core
------------------------------------------------------------------

Your squaring proof is great because it avoids case-bashing. The core fact is:

$$
|a||b| - ab \ge 0.
$$

That itself is essentially “absolute values remove sign.”

Equality condition  $ab\ge 0$  = “same direction on the number line.”

* * *

Lemma B (quadratic nonnegativity): what you’re really doing
-----------------------------------------------------------

When you define  $\phi(t)=\|x-ty\|^2\ge 0$ , you’re using:

> A squared norm is never negative, so the quadratic polynomial you get can’t dip below 0.

Then Lemma B converts “never negative quadratic” into “discriminant ≤ 0.”  
This is the algebraic bridge between geometry and inequalities.

* * *

7) Cauchy–Schwarz (deeper: what each step relies on)
====================================================

You did the standard proof. Let’s annotate every dependency:

1.  Define  $\phi(t)=\|x-ty\|_2^2$ .  
    Dependency:  $\|z\|_2^2=z^\top z\ge 0$ .
2.  Expand  $(x-ty)^\top(x-ty)$ .  
    Dependency: distributivity of matrix multiplication + symmetry of scalar product.
3.  You get a quadratic in  $t$  with leading coefficient  $y^\top y>0$  if  $y\neq 0$ .  
    Dependency: positive definiteness of  $\ell_2$ .
4.  Since  $\phi(t)\ge 0$  for all  $t$ , discriminant ≤ 0.  
    Dependency: Lemma B.
5.  Rearrange to  $(x^\top y)^2\le \|x\|_2^2\|y\|_2^2$ .  
    Dependency: algebra.
6.  Take square roots.  
    Dependency: both sides are nonnegative.

### Equality condition (why it’s exactly collinearity)

Equality means discriminant = 0, meaning the quadratic touches 0, meaning there exists  $t$  such that  $\phi(t)=0$ , meaning  $x=ty$ . No wiggle room.

* * *

8) Triangle inequality for  $\ell_2$  (why C–S is the “key”)
============================================================

You expanded:

$$
\|x+y\|_2^2=\|x\|_2^2+2x^\top y+\|y\|_2^2.
$$

Then you upper-bounded  $x^\top y\le \|x\|_2\|y\|_2$ . That is _exactly_ where geometry enters.

### Equality condition (more precise)

You wrote: equality iff  $x=\alpha y$  with  $\alpha\ge 0$ .  
Why “ $\ge 0$ ” not just “ $\neq 0$ ”? Because you need  $x^\top y=+\|x\|\|y\|$ , not  $-\|x\|\|y\|$ . So they must be collinear _and pointing the same way_.

* * *

9) Unit balls are convex (this is secretly _the_ norm–convexity equivalence)
============================================================================

Your proof is correct. Here’s the deeper punchline:

> Triangle inequality + homogeneity are exactly the two algebraic properties that make the sublevel set  $\{x:\|x\|\le 1\}$  closed under convex mixing.

So whenever you see a “norm constraint,” your convexity alarm should go off automatically.

* * *

10) Projection viewpoint (turn it into a reusable template)
===========================================================

You solved:

$$
\min_t \|x-ty\|_2^2.
$$

This is the 1D version of least squares. The reusable pattern is:

1.  expand the square → get a convex quadratic,
2.  set derivative = 0 → normal equation,
3.  interpret residual orthogonality.

### The key structural fact

Residual orthogonality:

$$
y^\top (x-t^\star y)=0
$$

is the baby version of:

$$
A^\top(Ax^\star-b)=0
$$

for least squares. That equation is not “calculus trivia”—it is the geometric statement “error is orthogonal to the feasible direction space.”

This becomes the template for KKT: optimality = no feasible direction can reduce objective → orthogonality to tangent cone → multipliers.

* * *

11) Extra “sanity checks” and common failure modes
==================================================

### Sanity checks you should be able to do instantly

*   If  $f$  is constant, compute  $f^{-1}(B)$  correctly.
*   Given two points  $x,y$ , verify a proposed set is convex by testing the segment condition.
*   For any norm, confirm  $\|0\|=0$  and  $\|\alpha x\|=|\alpha|\|x\|$  _before_ attempting triangle inequality.

### Failure modes that wreck later theory

*   Confusing **preimage** with inverse function.
*   Forgetting complements are **relative** to the ambient set.
*   Ignoring domain: writing “ $\log f$ ” without checking  $f>0$  on its domain.
*   Treating “affine” as “linear” (origin dependence is the whole distinction).

* * *

12) The bridge sentence into dual norms (made slightly more explicit)
=====================================================================

The quantity

$$
\sup_{\|x\|\le 1} y^\top x
$$

is the **support function** of the unit ball in direction  $y$ . For norms, that support function is exactly the **dual norm**  $\|y\|_\*$ .

So duality starts as:

> “How big can the dot product with  $y$  get if  $x$  is constrained to a unit ball?”

That’s literally “a constrained maximization problem,” i.e., optimization already.

* * *

If you continue to Module 1, the next “no-gaps” step is to prove (from scratch) the **dual norm definition**, prove it’s a norm, and compute the classic pairs:

$$
(\ell_1)^\*=\ell_\infty,\quad (\ell_2)^\*=\ell_2,\quad (\ell_\infty)^\*=\ell_1,
$$

and then connect “support function / polar set / separating hyperplane” as the geometric origin of Lagrange multipliers.

## Prompt:
Now this one:

Awesome. Let’s go **Module 1** at the same “no gaps, prove everything, explain everything” level.

---

# Module 1 — Norms, dual norms, and the geometry of unit balls

## 0) What this module is secretly doing

Module 0 taught you two primitives:

* **A norm ball** (B={x:|x|\le 1}) is convex (we proved it).
* Linear functionals look like (x\mapsto y^\top x).

Module 1 fuses them into a single recurring pattern that will later *become duality*:

[
\boxed{\text{“sup of a linear functional over a convex set”}}
]

Specifically:

[
\boxed{\ |y|** := \sup*{|x|\le 1} y^\top x\ }
]

This is the **dual norm**. It measures how “big” the linear functional (x\mapsto y^\top x) can get on the unit ball of (|\cdot|).

If you truly internalize this, then later:

* support functions,
* separation,
* dual cones,
* Lagrange duality,

all stop feeling like different topics. They become the same geometric move in different costumes.

---

## 1) Warm-up: the unit ball is compact (so the sup is actually a max)

We’ll work in (\mathbb R^n) (finite-dimensional). This matters.

### Definition (unit ball)

[
B := {x\in\mathbb R^n : |x|\le 1}.
]

### Claim 1: (B) is closed

**Proof.** The map (x\mapsto |x|) is continuous (true for all norms; you can show it from triangle inequality: (||x|-|z||\le |x-z|)). Then (B=|,\cdot,|^{-1}((-\infty,1])) is the preimage of a closed set, hence closed. ∎

### Claim 2: (B) is bounded

**Proof.** If (|x|\le 1), then (x) cannot “blow up” in any direction. Formally: pick the standard basis vectors (e_i). Let
[
M := \max_{i=1,\dots,n} |e_i| \quad (\text{finite since there are only }n\text{ of them}).
]
For any (x=\sum_{i=1}^n x_i e_i), triangle inequality + homogeneity gives
[
|x| \le \sum_{i=1}^n |x_i|,|e_i| \le M\sum_{i=1}^n |x_i| = M|x|_1.
]
So if (|x|\le 1), then (|x|_1 \ge |x|/M \ge 0) (this inequality is one-sided, but it’s enough to show you can’t have (|x|_1\to\infty) while (|x|\le 1)). More directly: if (|x|\le 1), then (|x_i|=|x_i e_i|/|e_i|\le 1/\min_j|e_j|) whenever (\min_j|e_j|>0) (it is, since norms of nonzero vectors are positive). Hence each coordinate is bounded, so (B) is bounded in (\mathbb R^n). ∎

### Corollary: (B) is compact

In (\mathbb R^n), **closed + bounded ⇒ compact** (Heine–Borel). ∎

### Why we cared

The function (x\mapsto y^\top x) is continuous. A continuous function attains its maximum on a compact set. Therefore:

[
\sup_{|x|\le 1} y^\top x \quad\text{is finite and is actually a maximum.}
]

So the dual norm is not “a supremum floating in the void”; it’s a real geometric optimum.

---

## 2) Support functions: the geometric object hiding inside the dual norm

### Definition (support function)

For a set (C\subseteq\mathbb R^n), define
[
\sigma_C(y) := \sup_{x\in C} y^\top x.
]

**Meaning:** (\sigma_C(y)) is the farthest you can go in direction (y) while staying inside (C), measured by the linear “height” (y^\top x).

For a norm ball (B={x:|x|\le 1}),
[
\boxed{\ |y|_* = \sigma_B(y)\ }
]
So: **the dual norm is the support function of the primal unit ball.**

This is the first place where “duality” starts being literal geometry:

* a direction (y),
* a convex body (B),
* a supporting hyperplane.

---

## 3) Dual norm: definition and immediate consequences

### Definition (dual norm)

Given a norm (|\cdot|) on (\mathbb R^n), define
[
\boxed{\ |y|** := \sup*{|x|\le 1} y^\top x\ }.
]

### Claim 1: You can restrict to the boundary (|x|=1) (unless (y=0))

For (y\neq 0),
[
\sup_{|x|\le 1} y^\top x = \sup_{|x|=1} y^\top x.
]

**Proof.**

* “(\ge)” direction is trivial since ({x:|x|=1}\subseteq{x:|x|\le 1}).
* For “(\le)”: take any (x) with (|x|<1). Define (\tilde x = x/|x|) (well-defined since (x\neq 0); if (x=0) then (y^\top x=0) which is never optimal if (y\neq 0)). Then (|\tilde x|=1) and
  [
  y^\top \tilde x = \frac{1}{|x|}y^\top x \ge y^\top x
  ]
  whenever (y^\top x\ge 0). If (y^\top x<0), it’s not helpful for maximizing anyway. More formally, the maximum is achieved (compactness), and at any maximizer we must have (|x|=1) unless (y=0) (otherwise scaling up increases the objective). ∎

**Geometric meaning:** a linear functional increases as you move outward along a ray, so the maximum over a ball happens on the boundary (a “touching point”).

---

## 4) The dual norm is really a norm (full proof)

We must prove the three axioms for (|\cdot|_*).

### Axiom 1: nonnegativity and definiteness

**(i) Nonnegativity.**
Since the feasible set contains (x=0), we have
[
|y|**=\sup*{|x|\le 1} y^\top x \ge y^\top 0 = 0.
]

**(ii) Definiteness: (|y|_*=0 \Rightarrow y=0).**
Assume (y\neq 0). Then some coordinate (y_i\neq 0). Consider (x = \operatorname{sign}(y_i), e_i). This vector is nonzero, so (|x|>0). Scale it to unit norm:
[
u := \frac{x}{|x|} \quad\Rightarrow\quad |u|=1.
]
Then
[
y^\top u = \frac{1}{|x|} y^\top x = \frac{1}{|x|} |y_i| > 0.
]
Hence (\sup_{|z|\le 1} y^\top z \ge y^\top u > 0), so (|y|**>0). Contradiction. Therefore (|y|**=0) implies (y=0). ∎

---

### Axiom 2: homogeneity

We want (|\alpha y|** = |\alpha|,|y|**).

**Proof.**
[
|\alpha y|** = \sup*{|x|\le 1} (\alpha y)^\top x = \sup_{|x|\le 1} \alpha (y^\top x).
]
If (\alpha\ge 0), pull out (\alpha):
[
= \alpha \sup_{|x|\le 1} y^\top x = \alpha|y|**.
]
If (\alpha<0),
[
\sup*{|x|\le 1} \alpha(y^\top x) = |\alpha|\sup_{|x|\le 1} (-y^\top x)=|\alpha||{-y}|**.
]
But (|{-y}|**=|y|_*) because the feasible set is symmetric ((x\in B\Rightarrow -x\in B)), giving:
[
|{-y}|**=\sup*{|x|\le 1} (-y^\top x)=\sup_{|x|\le 1} y^\top(-x)=\sup_{|u|\le 1} y^\top u=|y|**.
]
So (|\alpha y|**=|\alpha||y|_*). ∎

---

### Axiom 3: triangle inequality

We want (|y+z|**\le |y|**+|z|_*).

**Proof.**
For any (x) with (|x|\le 1),
[
(y+z)^\top x = y^\top x + z^\top x \le \sup_{|u|\le 1} y^\top u ;+; \sup_{|v|\le 1} z^\top v
= |y|**+|z|**.
]
Since this upper bound holds for every feasible (x), it holds for the supremum over (x):
[
|y+z|_*=\sup_{|x|\le 1} (y+z)^\top x \le |y|**+|z|**.
]
∎

So (|\cdot|_*) is a norm.

---

## 5) The fundamental inequality (general Hölder): dot products are bounded by primal×dual

### Theorem (Hölder for a norm and its dual)

For all (x,y\in\mathbb R^n),
[
\boxed{\ y^\top x \le |y|**,|x|\ }.
]
And therefore
[
\boxed{\ |y^\top x| \le |y|**,|x|\ }.
]

**Proof.**
If (x=0), both sides are 0.

Assume (x\neq 0). Define (u = x/|x|). Then (|u|=1), so (u) is feasible in the definition of the dual norm. Thus
[
|y|** = \sup*{|v|\le 1} y^\top v \ge y^\top u = y^\top \frac{x}{|x|}.
]
Multiply both sides by (|x|>0):
[
|y|**,|x| \ge y^\top x.
]
For the absolute value, apply the same inequality to (\pm y):
[
|y^\top x|=\max{y^\top x,(-y)^\top x}\le |y|**,|x|.
]
∎

**Interpretation:** (|y|_*) is exactly the smallest constant (C) such that
[
|y^\top x|\le C|x|\quad\forall x.
]
So the dual norm measures the “operator size” of the linear functional (x\mapsto y^\top x).

This statement is the ancestor of:

* Lipschitz bounds,
* dual feasibility certificates,
* sensitivity bounds,
* and later, KKT multipliers.

---

# 6) Compute dual norms in the key cases (with maximizers)

## 6.1 Dual of (\ell_2) is (\ell_2)

### Claim

[
\boxed{\ |y|_{2,*} = |y|_2\ }.
]

**Proof.**
By Cauchy–Schwarz (Module 0),
[
y^\top x \le |y|_2|x|_2.
]
If (|x|_2\le 1), then (y^\top x\le |y|*2). Taking supremum:
[
\sup*{|x|_2\le 1} y^\top x \le |y|_2.
]
Now show achievability (so it’s equality). If (y\neq 0), choose
[
x^\star := \frac{y}{|y|_2}.
]
Then (|x^\star|_2=1) and
[
y^\top x^\star = y^\top \frac{y}{|y|_2}=\frac{|y|_2^2}{|y|_2}=|y|_2.
]
So the supremum is at least (|y|_2), hence equals (|y|_2). ∎

**Geometric meaning:** the Euclidean ball is perfectly symmetric; the supporting hyperplane in direction (y) touches it at the normalized direction (y/|y|_2).

---

## 6.2 Dual of (\ell_\infty) is (\ell_1)

### Claim

[
\boxed{\ |y|*{\infty,*} = |y|*1\ } \quad\text{where}\quad |y|*{\infty,*}:=\sup*{|x|_\infty\le 1} y^\top x.
]

**Proof (upper bound).**
If (|x|*\infty\le 1), then (|x_i|\le 1) for all (i). Then
[
y^\top x = \sum*{i=1}^n y_i x_i \le \sum_{i=1}^n |y_i||x_i| \le \sum_{i=1}^n |y_i| = |y|*1.
]
So (\sup*{|x|_\infty\le 1} y^\top x \le |y|_1).

**Proof (achievability).**
Choose
[
x^\star_i := \operatorname{sign}(y_i)\in{-1,0,1}.
]
Then (|x^\star|_\infty\le 1) and
[
y^\top x^\star = \sum_i y_i,\operatorname{sign}(y_i)=\sum_i |y_i|=|y|_1.
]
So the supremum is at least (|y|_1), hence equals (|y|_1). ∎

**Geometric meaning:** the (\ell_\infty) unit ball is a cube; the maximizer hits a corner determined by the signs of (y).

---

## 6.3 Dual of (\ell_1) is (\ell_\infty)

### Claim

[
\boxed{\ |y|*{1,*} = |y|*\infty\ } \quad\text{where}\quad |y|*{1,*}:=\sup*{|x|_1\le 1} y^\top x.
]

**Proof (upper bound).**
Let (M=|y|_\infty=\max_i |y_i|). Then for any (x),
[
y^\top x \le \sum_i |y_i||x_i| \le M\sum_i |x_i| = M|x|*1.
]
If (|x|*1\le 1), then (y^\top x\le M=|y|*\infty). Hence
[
\sup*{|x|*1\le 1} y^\top x \le |y|*\infty.
]

**Proof (achievability).**
Let (i^\star\in\arg\max_i |y_i|). Define
[
x^\star := \operatorname{sign}(y_{i^\star}),e_{i^\star}.
]
Then (|x^\star|*1=1) and
[
y^\top x^\star = y*{i^\star}\operatorname{sign}(y_{i^\star})=|y_{i^\star}|=|y|_\infty.
]
So equality holds. ∎

**Geometric meaning:** the (\ell_1) ball is a cross-polytope (diamond in 2D). Supporting hyperplanes touch it on an axis vertex—one coordinate takes all the “budget”.

---

## 6.4 Summary table (the dual pairs you must remember)

[
\boxed{\ (\ell_2)^*=\ell_2,\qquad (\ell_1)^*=\ell_\infty,\qquad (\ell_\infty)^*=\ell_1\ }.
]

---

# 7) The support-hyperplane picture (why dual norm = “touching height”)

Let (B={x:|x|\le 1}). For any nonzero (y), define
[
h_y(x)=y^\top x.
]
The set ({x: y^\top x = c}) is a hyperplane perpendicular to (y). Increasing (c) slides the hyperplane outward along direction (y).

Then (|y|**=\max*{x\in B} y^\top x) is exactly the **largest** (c) such that the hyperplane still intersects the ball. At the max:

* the hyperplane is **supporting** (B),
* it **touches** (B) at some maximizer (x^\star),
* and (y) is the outward normal.

This is the geometric embryo of “dual certificate”: later, dual variables define supporting hyperplanes separating feasible from infeasible.

---

# 8) “Do” skills (computations) + how to find the maximizer

### Task A: compute dual norm and maximizer for (\ell_1)

Given (y=(2,-5,1)):

* (|y|*{1,*}=|y|*\infty=5).
* maximizer (x^\star=\operatorname{sign}(y_2)e_2 = (-1)e_2=(0,-1,0)).
  Check: (|x^\star|_1=1), (y^\top x^\star=5).

### Task B: compute dual norm and maximizer for (\ell_\infty)

Same (y):

* (|y|_{\infty,*}=|y|_1=8).
* maximizer (x^\star=\operatorname{sign}(y)=(1,-1,1)).
  Check: (|x^\star|_\infty=1), (y^\top x^\star=2+5+1=8).

### Task C: compute dual norm and maximizer for (\ell_2)

* (|y|_{2,*}=|y|_2=\sqrt{2^2+(-5)^2+1^2}=\sqrt{30}).
* maximizer (x^\star=y/|y|_2).

---

# 9) End-of-Module 1 sanity checklist (if these don’t feel inevitable, don’t advance)

You should be able to:

1. Prove (|\cdot|_*) is a norm (all three axioms, cleanly).
2. Prove the general inequality ( |y^\top x|\le |y|_*|x|) by scaling (x/|x|).
3. Compute dual norms for (\ell_1,\ell_2,\ell_\infty) and produce an explicit maximizer (x^\star) achieving the supremum.
4. Explain the geometric meaning: dual norm = support function of the primal unit ball = height of a supporting hyperplane with normal (y).
5. Explain *why* (\ell_1) ↔ (\ell_\infty) happens (budget spread vs budget concentrated; corners vs vertices).

---

## Response:
Thought for 40s

Cool — Module 1 is where convex optimization stops being “algebra with constraints” and becomes **geometry of supporting hyperplanes**. But your draft has a couple subtle holes (especially the “boundedness” argument), so I’m going to rewrite it as a **fully rigorous, no-gaps** walkthrough, and I’ll explicitly flag and fix the gaps.

I’ll use notation:

*   primal norm:  $\|x\|$ 
*   dual norm:  $\|y\|_\*$ 
*   unit ball:  $B=\{x:\|x\|\le 1\}$ 

* * *

Module 1 — Norms, dual norms, support functions (zero-to-hero, no gaps)
=======================================================================

0) What this module is secretly doing
-------------------------------------

Module 0 gave you:

1.  **Convex norm balls**  $B=\{x:\|x\|\le 1\}$ 
2.  **Linear functionals**  $x\mapsto y^\top x$ 

Module 1 fuses them into a single recurring pattern:

$$
\boxed{\text{maximize a linear functional over a convex set}}
$$

That’s the DNA of:

*   support functions,
*   separating hyperplanes,
*   polar sets / dual cones,
*   and eventually Lagrange duality.

The key definition:

$$
\boxed{\|y\|_\* := \sup_{\|x\|\le 1} y^\top x}
$$

Read it literally: **how high can direction  $y$  “lift” points inside the unit ball?**

* * *

1) Why the supremum is actually a maximum (finite-dimensional miracle)
======================================================================

This section is _not optional_. In infinite-dimensional spaces, the unit ball is often not compact, so the supremum may **fail to be attained**. In  $\mathbb R^n$ , we get compactness and everything behaves nicely.

1.1 Lemma: every norm is Lipschitz w.r.t. itself, hence continuous
------------------------------------------------------------------

### Lemma (reverse triangle inequality for norms)

For all  $x,z\in\mathbb R^n$ ,

$$
\boxed{\big|\|x\|-\|z\|\big|\le \|x-z\|}
$$

### Proof (no gaps)

Triangle inequality says:

$$
\|x\|=\|(x-z)+z\|\le \|x-z\|+\|z\| \Rightarrow \|x\|-\|z\|\le \|x-z\|.
$$

Swap  $x,z$ :

$$
\|z\|\le \|z-x\|+\|x\|=\|x-z\|+\|x\| \Rightarrow \|z\|-\|x\|\le \|x-z\|.
$$

Combine both inequalities:

$$
-\|x-z\|\le \|x\|-\|z\|\le \|x-z\| \Rightarrow |\|x\|-\|z\||\le \|x-z\|.
$$

So  $x\mapsto \|x\|$  is continuous. ∎

* * *

1.2 The unit ball is closed
---------------------------

Let  $B=\{x:\|x\|\le 1\}$ . Since  $\|x\|$  is continuous and  $(-\infty,1]$  is closed in  $\mathbb R$ ,

$$
B=\|\,\cdot\,\|^{-1}((-\infty,1])
$$

is a preimage of a closed set under a continuous function, hence closed. ∎

* * *

1.3 The unit ball is bounded (this is where your draft had a real gap)
----------------------------------------------------------------------

Your draft tried to show boundedness by proving  $\|x\|\le M\|x\|_1$ . That inequality is true (for some  $M$ ), but it does **not** imply boundedness of  $\{x:\|x\|\le 1\}$ , because it points the wrong way: from  $\|x\|\le 1$  you cannot deduce  $\|x\|_1$  is bounded if all you know is  $\|x\|\le M\|x\|_1$ .

What you need is the reverse direction:

$$
\boxed{\|x\|\ge c\|x\|_2\ \text{or}\ \|x\|\ge c\|x\|_1}
$$

for some  $c>0$ . This is a special finite-dimensional fact: **all norms are equivalent**.

### Theorem (norm equivalence via compactness of the Euclidean sphere)

Let  $\|\cdot\|$  be any norm on  $\mathbb R^n$ . Then there exist constants  $m,M>0$  such that for all  $x$ ,

$$
\boxed{m\|x\|_2 \le \|x\| \le M\|x\|_2.}
$$

#### Proof (fully explicit)

Consider the Euclidean unit sphere:

$$
S=\{u\in\mathbb R^n:\|u\|_2=1\}.
$$

Facts:

1.   $S$  is compact in  $\mathbb R^n$  (closed and bounded).
2.  The function  $u\mapsto \|u\|$  is continuous (from Lemma 1.1).

Therefore, by Weierstrass, it attains a minimum and maximum on  $S$ :

$$
m:=\min_{u\in S}\|u\|,\qquad M:=\max_{u\in S}\|u\|.
$$

Now check  $m>0$ :  
If  $m=0$ , then there exists  $u\in S$  with  $\|u\|=0$ . But norms satisfy definiteness:  $\|u\|=0\iff u=0$ . Contradiction since  $u\in S$  implies  $\|u\|_2=1$  so  $u\neq 0$ . Hence  $m>0$ .

Now take any  $x\neq 0$ . Write  $x=\|x\|_2 u$  where  $u=x/\|x\|_2\in S$ . By homogeneity:

$$
\|x\|=\|\|x\|_2 u\|=\|x\|_2\|u\|.
$$

Since  $u\in S$ , we have  $m\le \|u\|\le M$ . Multiply by  $\|x\|_2$ :

$$
m\|x\|_2 \le \|x\| \le M\|x\|_2.
$$

If  $x=0$ , the inequality holds trivially. ∎

### Corollary: the unit ball  $B=\{x:\|x\|\le 1\}$  is bounded

If  $\|x\|\le 1$ , then from  $m\|x\|_2\le \|x\|$ ,

$$
m\|x\|_2 \le 1 \Rightarrow \|x\|_2 \le \frac{1}{m}.
$$

So  $B\subseteq \{x:\|x\|_2\le 1/m\}$ , a Euclidean ball of finite radius. Hence  $B$  is bounded. ∎

* * *

1.4 Compactness, and why we care
--------------------------------

In  $\mathbb R^n$ , **Heine–Borel** says: closed + bounded ⇒ compact. So  $B$  is compact.

Now fix  $y$ . The function  $x\mapsto y^\top x$  is continuous (it’s a polynomial / linear map). Therefore:

$$
\boxed{\sup_{\|x\|\le 1} y^\top x \text{ is finite and attained; i.e. it equals } \max_{\|x\|\le 1} y^\top x.}
$$

This is why the dual norm is a **real geometric “touching hyperplane” optimum**, not a ghost supremum.

* * *

2) Support functions: the object hiding inside the dual norm
============================================================

2.1 Definition
--------------

For any set  $C\subseteq\mathbb R^n$ ,

$$
\boxed{\sigma_C(y) := \sup_{x\in C} y^\top x.}
$$

If  $C$  is compact, it’s a maximum.

2.2 Immediate structure: support functions are sublinear
--------------------------------------------------------

Assuming the sup is finite (e.g. if  $C$  is bounded), then:

*   **positive homogeneity**:  $\sigma_C(\alpha y)=\alpha\sigma_C(y)$  for  $\alpha\ge 0$ 
*   **subadditivity**:  $\sigma_C(y+z)\le \sigma_C(y)+\sigma_C(z)$ 

Proofs are one-liners from “sup distributes over ≤”.

2.3 Dual norm = support function of the unit ball
-------------------------------------------------

For  $B=\{x:\|x\|\le 1\}$ ,

$$
\boxed{\|y\|_\*=\sigma_B(y).}
$$

So dual norm geometry is: **supporting hyperplanes to the primal unit ball**.

* * *

3) Dual norm: definition and the “boundary only” principle
==========================================================

3.1 Definition (dual norm)
--------------------------

Given a norm  $\|\cdot\|$ ,

$$
\boxed{\|y\|_\* := \sup_{\|x\|\le 1} y^\top x.}
$$

Because  $B$  is symmetric ( $x\in B\Rightarrow -x\in B$ ), you automatically have:

$$
\|y\|_\*=\sup_{\|x\|\le 1} y^\top x=\sup_{\|x\|\le 1} |y^\top x|.
$$

Reason:  $\sup |y^\top x|=\max\{\sup y^\top x,\sup (-y)^\top x\}=\max\{\|y\|_\*,\|-y\|_\*\}=\|y\|_\*$ .

3.2 Claim: for  $y\neq 0$ , a maximizer lies on  $\|x\|=1$ 
-----------------------------------------------------------

### Claim

If  $y\neq 0$ , then any maximizer  $x^\star$  of  $\max_{\|x\|\le 1} y^\top x$  satisfies  $\|x^\star\|=1$ .

### Proof (scaling argument, fully clean)

Assume  $y\neq 0$ . Let  $x^\star$  maximize  $y^\top x$  over  $\|x\|\le 1$ . If  $x^\star=0$ , then objective is  $0$ . But we will show there exists some feasible point with strictly positive objective, so  $0$  cannot be optimal.

Pick any index  $i$  with  $y_i\neq 0$ . Let  $v=\mathrm{sign}(y_i)e_i$ . Then  $y^\top v=|y_i|>0$ . Scale  $v$  to be feasible:  $u=v/\|v\|$ , so  $\|u\|=1$  and  $y^\top u=|y_i|/\|v\|>0$ . Hence the maximum value is  $>0$ , so  $x^\star\neq 0$  and  $y^\top x^\star>0$ .

Now suppose for contradiction that  $\|x^\star\|<1$ . Define  $\tilde x:=x^\star/\|x^\star\|$ . Then  $\|\tilde x\|=1$  and

$$
y^\top \tilde x = \frac{1}{\|x^\star\|}y^\top x^\star > y^\top x^\star
$$

because  $y^\top x^\star>0$  and  $1/\|x^\star\|>1$ . This contradicts optimality of  $x^\star$ . Therefore  $\|x^\star\|=1$ . ∎

Geometric translation: linear objectives increase along rays; the best point in a ball is a **boundary touch point**.

* * *

4) The dual norm is actually a norm (all axioms, no gaps)
=========================================================

We verify the 3 norm axioms for  $\|\cdot\|_\*$ .

4.1 Nonnegativity + definiteness
--------------------------------

### Nonnegativity

Since  $0$  is feasible,

$$
\|y\|_\*=\sup_{\|x\|\le 1} y^\top x \ge y^\top 0=0.
$$

### Definiteness:  $\|y\|_\*=0 \Rightarrow y=0$ 

Assume  $y\neq 0$ . Pick  $i$  with  $y_i\neq 0$ . Let  $v=\mathrm{sign}(y_i)e_i$ . Then  $y^\top v=|y_i|>0$ . Let  $u=v/\|v\|$  so  $\|u\|=1$ . Then  $u$  is feasible and

$$
\|y\|_\*\ge y^\top u=\frac{|y_i|}{\|v\|}>0.
$$

Contradiction. Hence if  $\|y\|_\*=0$ , must have  $y=0$ . ∎

4.2 Homogeneity
---------------

For any scalar  $\alpha$ ,

$$
\|\alpha y\|_\*=\sup_{\|x\|\le 1} (\alpha y)^\top x=\sup_{\|x\|\le 1} \alpha(y^\top x).
$$
*   If  $\alpha\ge 0$ ,  $\sup \alpha(\cdot)=\alpha\sup(\cdot)$ , so  $\|\alpha y\|_\*=\alpha\|y\|_\*$ .
*   If  $\alpha<0$ , write  $\alpha=-|\alpha|$ :
    
$$
\|\alpha y\|_\*=\sup_{\|x\|\le 1} -|\alpha|\, y^\top x =|\alpha| \sup_{\|x\|\le 1} (-y^\top x).
$$

But  $\sup_{\|x\|\le 1} (-y^\top x)=\sup_{\|x\|\le 1} y^\top x$  because  $x$  ranges over a symmetric set (replace  $x$  by  $-x$ ). Hence  $\|\alpha y\|_\*=|\alpha|\|y\|_\*$ . ∎

4.3 Triangle inequality
-----------------------

For any feasible  $x$  ( $\|x\|\le 1$ ):

$$
(y+z)^\top x = y^\top x+z^\top x \le \sup_{\|u\|\le 1}y^\top u + \sup_{\|v\|\le 1}z^\top v=\|y\|_\*+\|z\|_\*.
$$

Take supremum over  $x$  on the left:

$$
\|y+z\|_\*=\sup_{\|x\|\le 1}(y+z)^\top x \le \|y\|_\*+\|z\|_\*.
$$

∎

So  $\|\cdot\|_\*$  is a norm. ✅

* * *

5) The fundamental inequality (general Hölder)
==============================================

This is the universal “dot product is controlled by primal×dual”.

Theorem (Hölder for a norm and its dual)
----------------------------------------

For all  $x,y\in\mathbb R^n$ ,

$$
\boxed{y^\top x \le \|y\|_\*\,\|x\|}\quad\text{and}\quad \boxed{|y^\top x|\le \|y\|_\*\,\|x\|}.
$$

### Proof (scaling, no gaps)

If  $x=0$ , trivial. Assume  $x\neq 0$ . Let  $u=x/\|x\|$ . Then  $\|u\|=1$ , so  $u$  is feasible in the definition of  $\|y\|_\*$ . Hence:

$$
\|y\|_\*=\sup_{\|v\|\le 1} y^\top v \ge y^\top u = y^\top \frac{x}{\|x\|}.
$$

Multiply by  $\|x\|>0$ :

$$
\|y\|_\*\,\|x\| \ge y^\top x.
$$

For absolute value, apply the same bound to  $-y$  and take max:

$$
|y^\top x|=\max\{y^\top x,(-y)^\top x\}\le \|y\|_\*\,\|x\|.
$$

∎

### Key interpretation (operator norm viewpoint)

Define the linear functional  $L_y(x)=y^\top x$ . Then

$$
\boxed{\|y\|_\*=\sup_{x\neq 0}\frac{|y^\top x|}{\|x\|}}
$$

i.e. the dual norm is the **operator norm** of  $L_y$  when the input space is normed by  $\|\cdot\|$ .

This is one of the main bridges into duality: dual variables are linear functionals, and their norm controls sensitivity.

* * *

6) Compute dual norms in the big three cases (with maximizers)
==============================================================

Now we do the canonical triplet. The important part is not just the value, but the **maximizing  $x^\star$ ** (the touching point).

6.1  $(\ell_2)^\*=\ell_2$ 
--------------------------

Let the primal norm be  $\|x\|_2$ . Then

$$
\|y\|_\*=\sup_{\|x\|_2\le 1} y^\top x.
$$

**Upper bound:** by Cauchy–Schwarz,

$$
y^\top x \le \|y\|_2\|x\|_2 \le \|y\|_2.
$$

So  $\|y\|_\*\le \|y\|_2$ .

**Achievability:** if  $y\neq 0$ , choose  $x^\star=y/\|y\|_2$ . Then  $\|x^\star\|_2=1$  and

$$
y^\top x^\star = y^\top \frac{y}{\|y\|_2}=\|y\|_2.
$$

So  $\|y\|_\*=\|y\|_2$ . If  $y=0$ , both are 0. ∎

Geometric picture: Euclidean ball touched at the normalized direction.

* * *

6.2  $(\ell_\infty)^\*=\ell_1$ 
-------------------------------

Primal:  $\|x\|_\infty\le 1$  means  $|x_i|\le 1$  for all  $i$ .

**Upper bound:**

$$
y^\top x=\sum_i y_i x_i \le \sum_i |y_i||x_i|\le \sum_i |y_i|=\|y\|_1.
$$

So the sup is  $\le \|y\|_1$ .

**Achievability:** pick  $x^\star_i=\mathrm{sign}(y_i)$  (choose  $0$  if  $y_i=0$ ). Then  $\|x^\star\|_\infty=1$  and

$$
y^\top x^\star = \sum_i y_i\,\mathrm{sign}(y_i)=\sum_i |y_i|=\|y\|_1.
$$

So  $\sup=\|y\|_1$ . ∎

Geometric picture: cube touched at a corner determined by signs.

* * *

6.3  $(\ell_1)^\*=\ell_\infty$ 
-------------------------------

Primal:  $\|x\|_1\le 1$  means  $\sum_i |x_i|\le 1$  (“budget of absolute weight”).

Let  $M=\|y\|_\infty=\max_i |y_i|$ .

**Upper bound:**

$$
y^\top x\le \sum_i |y_i||x_i| \le M\sum_i |x_i| = M\|x\|_1\le M.
$$

So sup  $\le \|y\|_\infty$ .

**Achievability:** choose  $i^\star\in\arg\max_i |y_i|$  and  $x^\star=\mathrm{sign}(y_{i^\star})e_{i^\star}$ . Then  $\|x^\star\|_1=1$  and

$$
y^\top x^\star = |y_{i^\star}|=\|y\|_\infty.
$$

So sup  $=\|y\|_\infty$ . ∎

Geometric picture: diamond/cross-polytope touched at an axis vertex (one coordinate spends the whole budget).

* * *

7) Polar sets: the dual ball is the polar of the primal ball (this is _huge_)
=============================================================================

Define the **polar** of a set  $C$  containing the origin:

$$
C^\circ := \{y: y^\top x\le 1\ \text{for all }x\in C\}.
$$

Take  $C=B=\{x:\|x\|\le 1\}$ . Then:

Proposition
-----------

$$
\boxed{B^\circ = \{y:\|y\|_\*\le 1\}}
$$

i.e. **the dual unit ball is exactly the polar of the primal unit ball**.

### Proof (membership logic, no gaps)

By definition,  $y\in B^\circ$  iff

$$
y^\top x\le 1\quad \forall x\in B.
$$

But  $\sup_{x\in B} y^\top x\le 1$  is exactly saying  $\|y\|_\*\le 1$  (since  $\|y\|_\*=\sup_{x\in B}y^\top x$ ). Hence:

$$
y\in B^\circ \iff \|y\|_\*\le 1.
$$

So the sets are equal. ∎

This is where “duality” becomes literal: taking the dual norm is the same as taking a polar body.

* * *

8) (Optional but foundational) Double dual gives you back the primal norm
=========================================================================

In finite dimensions, you also have:

$$
\boxed{\|x\|=\sup_{\|y\|_\*\le 1} y^\top x.}
$$

This says: the primal norm is the support function of the **dual unit ball**.

*   “ $\le$ ” direction is immediate from Hölder:
    $$
    y^\top x \le \|y\|_\*\|x\|\le \|x\| \Rightarrow \sup_{\|y\|_\*\le 1}y^\top x \le \|x\|.
    $$
*   “ $\ge$ ” direction requires existence of a supporting hyperplane to the convex set  $B$  at the boundary point  $x/\|x\|$ . That’s a separation/supporting-hyperplane theorem fact (convex analysis). This is exactly the theorem that later powers Lagrange multipliers.

So: **duality is support + separation** wearing different masks.

* * *

9) End-of-Module 1 “no gaps” checklist
======================================

You’re actually fluent only if you can do these without handwaving:

1.  Prove norm equivalence  $m\|x\|_2\le \|x\|\le M\|x\|_2$  using compactness of the Euclidean sphere.
2.  Use that to prove the unit ball is compact.
3.  Prove  $\|\cdot\|_\*$  satisfies the 3 norm axioms.
4.  Prove Hölder:  $|y^\top x|\le \|y\|_\*\|x\|$ .
5.  Compute  $(\ell_1)^\*=\ell_\infty$ ,  $(\ell_\infty)^\*=\ell_1$ ,  $(\ell_2)^\*=\ell_2$ , **and produce an explicit maximizer**  $x^\star$ .
6.  Prove  $B^\circ=\{y:\|y\|_\*\le 1\}$  (polar = dual ball).

* * *

Bridge to Module 2 (support/separation → cones → duality)
---------------------------------------------------------

Once you believe “dual ball = polar ball,” you’re one tiny step from:

*   **dual cones**  $K^\*=\{y: y^\top x\ge 0\ \forall x\in K\}$ ,
*   and then Lagrangian duality is basically “polar/separation applied to epigraphs and constraint cones.”

If you continue, Module 2 should be: **polar sets, dual cones, and the separating hyperplane theorem**, because that theorem is the legal foundation under the KKT multipliers’ feet.

## Prompt:
Now this:

Awesome. Let’s go **Module 1** at the same “no gaps, prove everything, explain everything” level.

---

# Module 1 — Norms, dual norms, and the geometry of unit balls

## 0) What this module is secretly doing

Module 0 taught you two primitives:

* **A norm ball** (B={x:|x|\le 1}) is convex (we proved it).
* Linear functionals look like (x\mapsto y^\top x).

Module 1 fuses them into a single recurring pattern that will later *become duality*:

[
\boxed{\text{“sup of a linear functional over a convex set”}}
]

Specifically:

[
\boxed{\ |y|** := \sup*{|x|\le 1} y^\top x\ }
]

This is the **dual norm**. It measures how “big” the linear functional (x\mapsto y^\top x) can get on the unit ball of (|\cdot|).

If you truly internalize this, then later:

* support functions,
* separation,
* dual cones,
* Lagrange duality,

all stop feeling like different topics. They become the same geometric move in different costumes.

---

## 1) Warm-up: the unit ball is compact (so the sup is actually a max)

We’ll work in (\mathbb R^n) (finite-dimensional). This matters.

### Definition (unit ball)

[
B := {x\in\mathbb R^n : |x|\le 1}.
]

### Claim 1: (B) is closed

**Proof.** The map (x\mapsto |x|) is continuous (true for all norms; you can show it from triangle inequality: (||x|-|z||\le |x-z|)). Then (B=|,\cdot,|^{-1}((-\infty,1])) is the preimage of a closed set, hence closed. ∎

### Claim 2: (B) is bounded

**Proof.** If (|x|\le 1), then (x) cannot “blow up” in any direction. Formally: pick the standard basis vectors (e_i). Let
[
M := \max_{i=1,\dots,n} |e_i| \quad (\text{finite since there are only }n\text{ of them}).
]
For any (x=\sum_{i=1}^n x_i e_i), triangle inequality + homogeneity gives
[
|x| \le \sum_{i=1}^n |x_i|,|e_i| \le M\sum_{i=1}^n |x_i| = M|x|_1.
]
So if (|x|\le 1), then (|x|_1 \ge |x|/M \ge 0) (this inequality is one-sided, but it’s enough to show you can’t have (|x|_1\to\infty) while (|x|\le 1)). More directly: if (|x|\le 1), then (|x_i|=|x_i e_i|/|e_i|\le 1/\min_j|e_j|) whenever (\min_j|e_j|>0) (it is, since norms of nonzero vectors are positive). Hence each coordinate is bounded, so (B) is bounded in (\mathbb R^n). ∎

### Corollary: (B) is compact

In (\mathbb R^n), **closed + bounded ⇒ compact** (Heine–Borel). ∎

### Why we cared

The function (x\mapsto y^\top x) is continuous. A continuous function attains its maximum on a compact set. Therefore:

[
\sup_{|x|\le 1} y^\top x \quad\text{is finite and is actually a maximum.}
]

So the dual norm is not “a supremum floating in the void”; it’s a real geometric optimum.

---

## 2) Support functions: the geometric object hiding inside the dual norm

### Definition (support function)

For a set (C\subseteq\mathbb R^n), define
[
\sigma_C(y) := \sup_{x\in C} y^\top x.
]

**Meaning:** (\sigma_C(y)) is the farthest you can go in direction (y) while staying inside (C), measured by the linear “height” (y^\top x).

For a norm ball (B={x:|x|\le 1}),
[
\boxed{\ |y|_* = \sigma_B(y)\ }
]
So: **the dual norm is the support function of the primal unit ball.**

This is the first place where “duality” starts being literal geometry:

* a direction (y),
* a convex body (B),
* a supporting hyperplane.

---

## 3) Dual norm: definition and immediate consequences

### Definition (dual norm)

Given a norm (|\cdot|) on (\mathbb R^n), define
[
\boxed{\ |y|** := \sup*{|x|\le 1} y^\top x\ }.
]

### Claim 1: You can restrict to the boundary (|x|=1) (unless (y=0))

For (y\neq 0),
[
\sup_{|x|\le 1} y^\top x = \sup_{|x|=1} y^\top x.
]

**Proof.**

* “(\ge)” direction is trivial since ({x:|x|=1}\subseteq{x:|x|\le 1}).
* For “(\le)”: take any (x) with (|x|<1). Define (\tilde x = x/|x|) (well-defined since (x\neq 0); if (x=0) then (y^\top x=0) which is never optimal if (y\neq 0)). Then (|\tilde x|=1) and
  [
  y^\top \tilde x = \frac{1}{|x|}y^\top x \ge y^\top x
  ]
  whenever (y^\top x\ge 0). If (y^\top x<0), it’s not helpful for maximizing anyway. More formally, the maximum is achieved (compactness), and at any maximizer we must have (|x|=1) unless (y=0) (otherwise scaling up increases the objective). ∎

**Geometric meaning:** a linear functional increases as you move outward along a ray, so the maximum over a ball happens on the boundary (a “touching point”).

---

## 4) The dual norm is really a norm (full proof)

We must prove the three axioms for (|\cdot|_*).

### Axiom 1: nonnegativity and definiteness

**(i) Nonnegativity.**
Since the feasible set contains (x=0), we have
[
|y|**=\sup*{|x|\le 1} y^\top x \ge y^\top 0 = 0.
]

**(ii) Definiteness: (|y|_*=0 \Rightarrow y=0).**
Assume (y\neq 0). Then some coordinate (y_i\neq 0). Consider (x = \operatorname{sign}(y_i), e_i). This vector is nonzero, so (|x|>0). Scale it to unit norm:
[
u := \frac{x}{|x|} \quad\Rightarrow\quad |u|=1.
]
Then
[
y^\top u = \frac{1}{|x|} y^\top x = \frac{1}{|x|} |y_i| > 0.
]
Hence (\sup_{|z|\le 1} y^\top z \ge y^\top u > 0), so (|y|**>0). Contradiction. Therefore (|y|**=0) implies (y=0). ∎

---

### Axiom 2: homogeneity

We want (|\alpha y|** = |\alpha|,|y|**).

**Proof.**
[
|\alpha y|** = \sup*{|x|\le 1} (\alpha y)^\top x = \sup_{|x|\le 1} \alpha (y^\top x).
]
If (\alpha\ge 0), pull out (\alpha):
[
= \alpha \sup_{|x|\le 1} y^\top x = \alpha|y|**.
]
If (\alpha<0),
[
\sup*{|x|\le 1} \alpha(y^\top x) = |\alpha|\sup_{|x|\le 1} (-y^\top x)=|\alpha||{-y}|**.
]
But (|{-y}|**=|y|_*) because the feasible set is symmetric ((x\in B\Rightarrow -x\in B)), giving:
[
|{-y}|**=\sup*{|x|\le 1} (-y^\top x)=\sup_{|x|\le 1} y^\top(-x)=\sup_{|u|\le 1} y^\top u=|y|**.
]
So (|\alpha y|**=|\alpha||y|_*). ∎

---

### Axiom 3: triangle inequality

We want (|y+z|**\le |y|**+|z|_*).

**Proof.**
For any (x) with (|x|\le 1),
[
(y+z)^\top x = y^\top x + z^\top x \le \sup_{|u|\le 1} y^\top u ;+; \sup_{|v|\le 1} z^\top v
= |y|**+|z|**.
]
Since this upper bound holds for every feasible (x), it holds for the supremum over (x):
[
|y+z|_*=\sup_{|x|\le 1} (y+z)^\top x \le |y|**+|z|**.
]
∎

So (|\cdot|_*) is a norm.

---

## 5) The fundamental inequality (general Hölder): dot products are bounded by primal×dual

### Theorem (Hölder for a norm and its dual)

For all (x,y\in\mathbb R^n),
[
\boxed{\ y^\top x \le |y|**,|x|\ }.
]
And therefore
[
\boxed{\ |y^\top x| \le |y|**,|x|\ }.
]

**Proof.**
If (x=0), both sides are 0.

Assume (x\neq 0). Define (u = x/|x|). Then (|u|=1), so (u) is feasible in the definition of the dual norm. Thus
[
|y|** = \sup*{|v|\le 1} y^\top v \ge y^\top u = y^\top \frac{x}{|x|}.
]
Multiply both sides by (|x|>0):
[
|y|**,|x| \ge y^\top x.
]
For the absolute value, apply the same inequality to (\pm y):
[
|y^\top x|=\max{y^\top x,(-y)^\top x}\le |y|**,|x|.
]
∎

**Interpretation:** (|y|_*) is exactly the smallest constant (C) such that
[
|y^\top x|\le C|x|\quad\forall x.
]
So the dual norm measures the “operator size” of the linear functional (x\mapsto y^\top x).

This statement is the ancestor of:

* Lipschitz bounds,
* dual feasibility certificates,
* sensitivity bounds,
* and later, KKT multipliers.

---

# 6) Compute dual norms in the key cases (with maximizers)

## 6.1 Dual of (\ell_2) is (\ell_2)

### Claim

[
\boxed{\ |y|_{2,*} = |y|_2\ }.
]

**Proof.**
By Cauchy–Schwarz (Module 0),
[
y^\top x \le |y|_2|x|_2.
]
If (|x|_2\le 1), then (y^\top x\le |y|*2). Taking supremum:
[
\sup*{|x|_2\le 1} y^\top x \le |y|_2.
]
Now show achievability (so it’s equality). If (y\neq 0), choose
[
x^\star := \frac{y}{|y|_2}.
]
Then (|x^\star|_2=1) and
[
y^\top x^\star = y^\top \frac{y}{|y|_2}=\frac{|y|_2^2}{|y|_2}=|y|_2.
]
So the supremum is at least (|y|_2), hence equals (|y|_2). ∎

**Geometric meaning:** the Euclidean ball is perfectly symmetric; the supporting hyperplane in direction (y) touches it at the normalized direction (y/|y|_2).

---

## 6.2 Dual of (\ell_\infty) is (\ell_1)

### Claim

[
\boxed{\ |y|*{\infty,*} = |y|*1\ } \quad\text{where}\quad |y|*{\infty,*}:=\sup*{|x|_\infty\le 1} y^\top x.
]

**Proof (upper bound).**
If (|x|*\infty\le 1), then (|x_i|\le 1) for all (i). Then
[
y^\top x = \sum*{i=1}^n y_i x_i \le \sum_{i=1}^n |y_i||x_i| \le \sum_{i=1}^n |y_i| = |y|*1.
]
So (\sup*{|x|_\infty\le 1} y^\top x \le |y|_1).

**Proof (achievability).**
Choose
[
x^\star_i := \operatorname{sign}(y_i)\in{-1,0,1}.
]
Then (|x^\star|_\infty\le 1) and
[
y^\top x^\star = \sum_i y_i,\operatorname{sign}(y_i)=\sum_i |y_i|=|y|_1.
]
So the supremum is at least (|y|_1), hence equals (|y|_1). ∎

**Geometric meaning:** the (\ell_\infty) unit ball is a cube; the maximizer hits a corner determined by the signs of (y).

---

## 6.3 Dual of (\ell_1) is (\ell_\infty)

### Claim

[
\boxed{\ |y|*{1,*} = |y|*\infty\ } \quad\text{where}\quad |y|*{1,*}:=\sup*{|x|_1\le 1} y^\top x.
]

**Proof (upper bound).**
Let (M=|y|_\infty=\max_i |y_i|). Then for any (x),
[
y^\top x \le \sum_i |y_i||x_i| \le M\sum_i |x_i| = M|x|*1.
]
If (|x|*1\le 1), then (y^\top x\le M=|y|*\infty). Hence
[
\sup*{|x|*1\le 1} y^\top x \le |y|*\infty.
]

**Proof (achievability).**
Let (i^\star\in\arg\max_i |y_i|). Define
[
x^\star := \operatorname{sign}(y_{i^\star}),e_{i^\star}.
]
Then (|x^\star|*1=1) and
[
y^\top x^\star = y*{i^\star}\operatorname{sign}(y_{i^\star})=|y_{i^\star}|=|y|_\infty.
]
So equality holds. ∎

**Geometric meaning:** the (\ell_1) ball is a cross-polytope (diamond in 2D). Supporting hyperplanes touch it on an axis vertex—one coordinate takes all the “budget”.

---

## 6.4 Summary table (the dual pairs you must remember)

[
\boxed{\ (\ell_2)^*=\ell_2,\qquad (\ell_1)^*=\ell_\infty,\qquad (\ell_\infty)^*=\ell_1\ }.
]

---

# 7) The support-hyperplane picture (why dual norm = “touching height”)

Let (B={x:|x|\le 1}). For any nonzero (y), define
[
h_y(x)=y^\top x.
]
The set ({x: y^\top x = c}) is a hyperplane perpendicular to (y). Increasing (c) slides the hyperplane outward along direction (y).

Then (|y|**=\max*{x\in B} y^\top x) is exactly the **largest** (c) such that the hyperplane still intersects the ball. At the max:

* the hyperplane is **supporting** (B),
* it **touches** (B) at some maximizer (x^\star),
* and (y) is the outward normal.

This is the geometric embryo of “dual certificate”: later, dual variables define supporting hyperplanes separating feasible from infeasible.

---

# 8) “Do” skills (computations) + how to find the maximizer

### Task A: compute dual norm and maximizer for (\ell_1)

Given (y=(2,-5,1)):

* (|y|*{1,*}=|y|*\infty=5).
* maximizer (x^\star=\operatorname{sign}(y_2)e_2 = (-1)e_2=(0,-1,0)).
  Check: (|x^\star|_1=1), (y^\top x^\star=5).

### Task B: compute dual norm and maximizer for (\ell_\infty)

Same (y):

* (|y|_{\infty,*}=|y|_1=8).
* maximizer (x^\star=\operatorname{sign}(y)=(1,-1,1)).
  Check: (|x^\star|_\infty=1), (y^\top x^\star=2+5+1=8).

### Task C: compute dual norm and maximizer for (\ell_2)

* (|y|_{2,*}=|y|_2=\sqrt{2^2+(-5)^2+1^2}=\sqrt{30}).
* maximizer (x^\star=y/|y|_2).

---

# 9) End-of-Module 1 sanity checklist (if these don’t feel inevitable, don’t advance)

You should be able to:

1. Prove (|\cdot|_*) is a norm (all three axioms, cleanly).
2. Prove the general inequality ( |y^\top x|\le |y|_*|x|) by scaling (x/|x|).
3. Compute dual norms for (\ell_1,\ell_2,\ell_\infty) and produce an explicit maximizer (x^\star) achieving the supremum.
4. Explain the geometric meaning: dual norm = support function of the primal unit ball = height of a supporting hyperplane with normal (y).
5. Explain *why* (\ell_1) ↔ (\ell_\infty) happens (budget spread vs budget concentrated; corners vs vertices).

---

## What’s next

**Module 2 — Bases, coordinates, and change of basis** is next, and it’s not just linear algebra housekeeping. It’s the move that makes eigen/SVD/PCA later feel like “choose the right coordinates so the operator becomes diagonal/simple.”

We’ll do it with the same level of rigor:

* span/independence/basis/dimension,
* why all bases have same size,
* coordinate maps and change-of-basis matrices,
* orthonormal bases and why they preserve dot products/norms.

## Response:
Thought for 42s

Got it — you want **this exact draft** taken to “no gaps, prove everything, fix every subtle flaw, make the geometry inevitable.”

I’ll do two things at once:

1.  **Audit + fix** the one real mathematical hole in your text (the boundedness proof as written is not logically airtight).
2.  Present a **rewritten Module 1** in the same structure, but fully rigorous, with the missing lemmas inserted exactly where they’re needed.

I’ll use  $\|\cdot\|$  for the primal norm and  $\|\cdot\|_\*$  for the dual norm (your  $|\cdot|_\*$ ). Same object.

* * *

Before rewriting: the one important flaw to fix
===============================================

Your “Claim 2:  $B$  is bounded” argument tries to use

$$
\|x\|\le M\|x\|_1
$$

and then reason that  $\|x\|\le 1$  prevents  $\|x\|_1\to\infty$ . But that inequality goes the **wrong direction** for that conclusion.

*   From  $\|x\|\le M\|x\|_1$  and  $\|x\|\le 1$ , you only get  $1\ge \|x\|$  and  $\|x\|\le M\|x\|_1$ , which does **not** upper-bound  $\|x\|_1$ .
*   What you need for boundedness is the reverse type inequality:
    $$
    \|x\|\ge c\|x\|_2 \quad \text{(or }\|x\|\ge c\|x\|_1\text{)}
    $$
    so that  $\|x\|\le 1 \Rightarrow \|x\|_2 \le 1/c$ .

This reverse inequality is true in  $\mathbb R^n$  because **all norms are equivalent** (finite-dimensional miracle), and the cleanest proof uses compactness of the Euclidean sphere.

So we’ll rebuild Claim 2 correctly.

* * *

Module 1 — Norms, dual norms, and the geometry of unit balls (rewritten, no gaps)
=================================================================================

0) What this module is secretly doing
-------------------------------------

Module 0 gave you:

*   the primal unit ball  $B=\{x:\|x\|\le 1\}$  is convex;
*   linear functionals are  $x\mapsto y^\top x$ .

Module 1 fuses them into _the_ recurring pattern behind duality:

$$
\boxed{\text{maximize a linear functional over a convex set}}
$$

and in particular defines the **dual norm** as the support height of the unit ball:

 $$
\boxed{\ \|y\|_\* := \sup_{\|x\|\le 1} y^\top x\ }.
$$

Interpretation:  $\|y\|_\*$  is “how big the functional  $x\mapsto y^\top x$  can get” when you restrict  $x$  to the primal unit ball.

* * *

1) Warm-up: the unit ball is compact (so the sup is a max)
----------------------------------------------------------

We work in  $\mathbb R^n$  (finite-dimensional). This is crucial.

### Definition (unit ball)

$$
B := \{x\in\mathbb R^n : \|x\|\le 1\}.
$$

To prove compactness in  $\mathbb R^n$ , we’ll show:

*    $B$  is **closed**
*    $B$  is **bounded**  
    then use **Heine–Borel**: closed + bounded  $\Rightarrow$  compact.

* * *

### Claim 1:  $B$  is closed

This is the clean route: show  $x\mapsto \|x\|$  is continuous, then use preimages of closed sets.

#### Lemma (reverse triangle inequality)

For all  $x,z\in\mathbb R^n$ ,

 $$
\boxed{\ |\|x\|-\|z\|| \le \|x-z\|\ }.
$$

**Proof (membership-level explicit).**

Triangle inequality says

$$
\|x\| = \|(x-z)+z\|\le \|x-z\|+\|z\| \Rightarrow \|x\|-\|z\|\le \|x-z\|.
$$

Swap  $x,z$ :

$$
\|z\|\le \|z-x\|+\|x\|=\|x-z\|+\|x\| \Rightarrow \|z\|-\|x\|\le \|x-z\|.
$$

Combine:

$$
-\|x-z\|\le \|x\|-\|z\|\le \|x-z\| \Rightarrow |\|x\|-\|z\||\le \|x-z\|.
$$

So  $\|\cdot\|$  is Lipschitz (hence continuous). ∎

Now

$$
B = \{x:\|x\|\le 1\} = \|\,\cdot\,\|^{-1}((-\infty,1]).
$$

The set  $(-\infty,1]\subset\mathbb R$  is closed, and a continuous preimage of a closed set is closed, hence  $B$  is closed. ∎

* * *

### Claim 2:  $B$  is bounded (fixed properly)

This is the core finite-dimensional fact:

#### Theorem (norm equivalence with  $\ell_2$ )

There exist constants  $m,M>0$  such that for all  $x\in\mathbb R^n$ ,

$$
\boxed{m\|x\|_2 \le \|x\| \le M\|x\|_2.}
$$

**Proof (the clean compactness proof).**

Let

$$
S := \{u\in\mathbb R^n : \|u\|_2=1\}
$$

be the Euclidean unit sphere. In  $\mathbb R^n$ ,  $S$  is compact (closed and bounded).

The function  $u\mapsto \|u\|$  is continuous (Claim 1 lemma), so it attains a minimum and maximum on  $S$ :

$$
m := \min_{u\in S}\|u\|,\qquad M := \max_{u\in S}\|u\|.
$$

We must check  $m>0$ : if  $m=0$ , then some  $u\in S$  has  $\|u\|=0$ , but norms satisfy definiteness:  $\|u\|=0\iff u=0$ , contradiction because  $\|u\|_2=1$  implies  $u\neq 0$ . So  $m>0$ .

Now take any  $x\neq 0$ . Write  $x=\|x\|_2 u$  where  $u=x/\|x\|_2\in S$ . By homogeneity of the norm:

$$
\|x\|=\|\|x\|_2 u\|=\|x\|_2\|u\|.
$$

Since  $u\in S$ , we have  $m\le \|u\|\le M$ . Multiply by  $\|x\|_2$ :

$$
m\|x\|_2 \le \|x\| \le M\|x\|_2.
$$

For  $x=0$  it’s trivial. ∎

**Now boundedness is immediate.**  
If  $x\in B$ , then  $\|x\|\le 1$ . From  $m\|x\|_2\le \|x\|$  we get

$$
m\|x\|_2 \le 1 \Rightarrow \|x\|_2 \le \frac{1}{m}.
$$

So

$$
B \subseteq \{x:\|x\|_2\le 1/m\},
$$

a Euclidean ball of finite radius. Hence  $B$  is bounded. ∎

* * *

### Corollary:  $B$  is compact

In  $\mathbb R^n$ , Heine–Borel: closed + bounded ⇒ compact. Claims 1 and 2 give compactness. ∎

* * *

### Why we cared

For fixed  $y$ , the map  $x\mapsto y^\top x$  is continuous. A continuous function attains its maximum on a compact set. Therefore:

$$
\boxed{\sup_{\|x\|\le 1} y^\top x \text{ is finite and equals } \max_{\|x\|\le 1} y^\top x.}
$$

So the dual norm is a **real attained optimum**: a genuine “touching point” on the ball.

* * *

2) Support functions: the geometric object hiding inside the dual norm
----------------------------------------------------------------------

### Definition (support function)

For  $C\subseteq\mathbb R^n$ ,

$$
\sigma_C(y):=\sup_{x\in C} y^\top x.
$$

**Meaning:** slide the hyperplane  $\{x:y^\top x=c\}$  outward in direction  $y$ ;  $\sigma_C(y)$  is the largest  $c$  for which the hyperplane still intersects  $C$ .

For a norm ball  $B=\{x:\|x\|\le 1\}$ ,

 $$
\boxed{\ \|y\|_\*=\sigma_B(y)\ }.
$$

So “dual norm” = “support function of primal unit ball.”

_(Bonus structural fact, useful later)_:  $\sigma_C$  is always **sublinear**:

*    $\sigma_C(\alpha y)=\alpha\sigma_C(y)$  for  $\alpha\ge 0$ ,
*    $\sigma_C(y+z)\le\sigma_C(y)+\sigma_C(z)$ .  
    These are one-line “sup + linearity” arguments.

* * *

3) Dual norm: definition and immediate consequences
---------------------------------------------------

### Definition (dual norm)

 $$
\boxed{\ \|y\|_\* := \sup_{\|x\|\le 1} y^\top x\ }.
$$

### Immediate consequence 0: symmetry gives absolute values for free

Because  $B$  is symmetric ( $x\in B\Rightarrow -x\in B$ ),

 $$
\boxed{\ \|y\|_\*=\sup_{\|x\|\le 1}|y^\top x|\ }.
$$

Reason: if some  $x$  gives negative  $y^\top x$ , then  $-x$  gives  $-y^\top x>0$ .

### Claim 1: you can restrict to the boundary  $\|x\|=1$  when  $y\neq 0$ 

 $$
\boxed{\ y\neq 0 \ \Rightarrow\ \sup_{\|x\|\le 1} y^\top x = \sup_{\|x\|=1} y^\top x. }
$$

**Proof (fully clean).**

*   “ $\ge$ ” is trivial because  $\{x:\|x\|=1\}\subseteq\{x:\|x\|\le 1\}$ .
*   For “ $\le$ ”: since  $B$  is compact, the maximum is attained at some  $x^\star\in B$ .  
    First show the optimal value is positive: pick an index  $i$  with  $y_i\neq 0$ . Let  $v=\mathrm{sign}(y_i)e_i$ . Then  $y^\top v=|y_i|>0$ . Scale to  $u=v/\|v\|$  so  $\|u\|=1$ . Then  $u\in B$  and  $y^\top u>0$ . Hence the maximum value  $\max_{\|x\|\le 1}y^\top x$  is  $>0$ , so  $y^\top x^\star>0$ .
    Now suppose  $\|x^\star\|<1$ . Define  $\tilde x:=x^\star/\|x^\star\|$ . Then  $\|\tilde x\|=1$  and
    $$
    y^\top \tilde x = \frac{1}{\|x^\star\|}y^\top x^\star > y^\top x^\star
    $$
    because  $y^\top x^\star>0$  and  $1/\|x^\star\|>1$ . Contradiction. Therefore  $\|x^\star\|=1$ . ∎

Geometric meaning: linear objectives grow along rays; maxima over a ball occur at the boundary.

* * *

4) The dual norm is really a norm (full proof)
----------------------------------------------

We check the norm axioms for  $\|\cdot\|_\*$ .

### Axiom 1: nonnegativity + definiteness

**Nonnegativity.**  $0$  is feasible, so

$$
\|y\|_\*=\sup_{\|x\|\le 1}y^\top x \ge y^\top 0=0.
$$

**Definiteness.** If  $y\neq 0$ , choose  $i$  with  $y_i\neq 0$ . Let  $u=\mathrm{sign}(y_i)e_i/\|e_i\|$ . Then  $\|u\|=1$  and

$$
y^\top u = \frac{|y_i|}{\|e_i\|}>0.
$$

So  $\|y\|_\*\ge y^\top u>0$ . Hence  $\|y\|_\*=0\Rightarrow y=0$ . ∎

### Axiom 2: homogeneity

For any scalar  $\alpha$ ,

$$
\|\alpha y\|_\*=\sup_{\|x\|\le 1}(\alpha y)^\top x=\sup_{\|x\|\le 1}\alpha(y^\top x).
$$
*   If  $\alpha\ge 0$ : pull out  $\alpha$ :  $\|\alpha y\|_\*=\alpha\|y\|_\*$ .
*   If  $\alpha<0$ : write  $\alpha=-|\alpha|$ :
    $$
    \|\alpha y\|_\* = |\alpha|\sup_{\|x\|\le 1}(-y^\top x).
    $$
    But  $\sup_{\|x\|\le 1}(-y^\top x)=\sup_{\|x\|\le 1}(y^\top x)$  by symmetry  $x\mapsto -x$ .  
    So  $\|\alpha y\|_\*=|\alpha|\|y\|_\*$ . ∎

### Axiom 3: triangle inequality

For any feasible  $x$  ( $\|x\|\le 1$ ):

$$
(y+z)^\top x = y^\top x + z^\top x \le \sup_{\|u\|\le 1}y^\top u + \sup_{\|v\|\le 1}z^\top v = \|y\|_\*+\|z\|_\*.
$$

Take supremum over feasible  $x$ :

$$
\|y+z\|_\*=\sup_{\|x\|\le 1}(y+z)^\top x \le \|y\|_\*+\|z\|_\*.
$$

∎

Therefore  $\|\cdot\|_\*$  is a norm. ✅

* * *

5) Fundamental inequality (general Hölder): dot products are bounded by primal×dual
-----------------------------------------------------------------------------------

### Theorem (Hölder for a norm and its dual)

For all  $x,y\in\mathbb R^n$ ,

$$
\boxed{y^\top x \le \|y\|_\*\,\|x\|}\qquad\text{and}\qquad \boxed{|y^\top x| \le \|y\|_\*\,\|x\|}.
$$

**Proof.**  
If  $x=0$ , trivial. If  $x\neq 0$ , let  $u=x/\|x\|$ , so  $\|u\|=1$ . Then  $u$  is feasible in the definition of  $\|y\|_\*$ , hence

$$
\|y\|_\*=\sup_{\|v\|\le 1}y^\top v \ge y^\top u = y^\top\frac{x}{\|x\|}.
$$

Multiply by  $\|x\|>0$ :

$$
\|y\|_\*\,\|x\| \ge y^\top x.
$$

For absolute value, apply the same bound to  $\pm y$  and take the max. ∎

**Operator interpretation (very important later):**

$$
\boxed{\|y\|_\*=\sup_{x\neq 0}\frac{|y^\top x|}{\|x\|}}
$$

So the dual norm is exactly the operator norm of the linear functional  $x\mapsto y^\top x$ .

* * *

6) Compute dual norms in the key cases (with maximizers)
--------------------------------------------------------

### 6.1 Dual of  $\ell_2$  is  $\ell_2$ 

$$
\|y\|_{2,\*}=\sup_{\|x\|_2\le 1}y^\top x.
$$

By Cauchy–Schwarz:

$$
y^\top x \le \|y\|_2\|x\|_2 \le \|y\|_2 \Rightarrow \|y\|_{2,\*}\le \|y\|_2.
$$

Achieve equality with  $x^\star=y/\|y\|_2$  (if  $y\neq 0$ ):

$$
y^\top x^\star = \|y\|_2.
$$

So  $\|y\|_{2,\*}=\|y\|_2$ . ∎

### 6.2 Dual of  $\ell_\infty$  is  $\ell_1$ 

$$
\|y\|_{\infty,\*}=\sup_{\|x\|_\infty\le 1}y^\top x.
$$

If  $\|x\|_\infty\le 1$ , then  $|x_i|\le 1$ , so

$$
y^\top x \le \sum_i |y_i||x_i| \le \sum_i |y_i|=\|y\|_1.
$$

Achieve with  $x^\star_i=\mathrm{sign}(y_i)$ . Then  $\|x^\star\|_\infty=1$  and  $y^\top x^\star=\|y\|_1$ . ∎

### 6.3 Dual of  $\ell_1$  is  $\ell_\infty$ 

$$
\|y\|_{1,\*}=\sup_{\|x\|_1\le 1}y^\top x.
$$

Let  $M=\|y\|_\infty=\max_i |y_i|$ . Then

$$
y^\top x\le \sum_i |y_i||x_i|\le M\sum_i|x_i|=M\|x\|_1\le M.
$$

Achieve by choosing  $i^\star\in\arg\max_i|y_i|$  and  $x^\star=\mathrm{sign}(y_{i^\star})e_{i^\star}$ . Then  $\|x^\star\|_1=1$  and  $y^\top x^\star=M$ . ∎

**Summary:**

$$
(\ell_2)^\*=\ell_2,\qquad (\ell_1)^\*=\ell_\infty,\qquad (\ell_\infty)^\*=\ell_1.
$$

* * *

7) Support-hyperplane picture (make the geometry explicit)
----------------------------------------------------------

Let  $B=\{x:\|x\|\le 1\}$ . Fix  $y\neq 0$ . Define the halfspace

$$
H_y := \{x: y^\top x \le \|y\|_\*\}.
$$

### Fact 1:  $B\subseteq H_y$ 

For any  $x\in B$ , we have  $y^\top x \le \sup_{\|u\|\le 1}y^\top u = \|y\|_\*$ . So  $x\in H_y$ . ∎

### Fact 2: the boundary hyperplane supports  $B$ 

Because the maximum is attained, there exists  $x^\star\in B$  with  $y^\top x^\star=\|y\|_\*$ . Thus the hyperplane  $\{x:y^\top x=\|y\|_\*\}$  touches  $B$  and  $B$  lies entirely on one side. That is exactly a **supporting hyperplane**.

This picture is the embryo of “dual certificates”: a dual object is often “a hyperplane that supports/separates.”

* * *

8) (Very useful add-on) Dual ball = polar ball
----------------------------------------------

Define the **polar** of a set  $C$  containing  $0$ :

$$
C^\circ := \{y: y^\top x \le 1\ \forall x\in C\}.
$$

For  $B=\{x:\|x\|\le 1\}$ ,

$$
\boxed{B^\circ = \{y:\|y\|_\*\le 1\}.}
$$

**Proof (one-line membership equivalence).**

$$
y\in B^\circ \iff \sup_{x\in B} y^\top x \le 1 \iff \|y\|_\*\le 1.
$$

∎

This “polar = dual ball” identity is one of the cleanest bridges into cones and Lagrange duality.

* * *

9) End-of-Module 1 sanity checklist
-----------------------------------

You’re actually ready to move on only if you can do these on demand:

1.  Prove norm continuity via  $|\|x\|-\|z\||\le \|x-z\|$ .
2.  Prove **boundedness correctly** (norm equivalence ⇒  $B\subseteq$  Euclidean ball).
3.  Prove  $\|\cdot\|_\*$  satisfies the 3 norm axioms.
4.  Prove Hölder:  $|y^\top x|\le \|y\|_\*\,\|x\|$ .
5.  Compute dual norms for  $\ell_1,\ell_2,\ell_\infty$  and exhibit an explicit maximizer  $x^\star$ .
6.  Prove the polar identity  $B^\circ=\{y:\|y\|_\*\le 1\}$ .

* * *

If you want the _next_ inevitable step (Module 1.5 / Module 2 bridge), it’s: **supporting hyperplane theorem → existence of a  $y$  that attains  $\|x\|=\sup_{\|y\|_\*\le 1}y^\top x$ ** (the “double dual gives back primal” fact). That theorem is exactly the legal foundation under KKT multipliers’ feet.

## Prompt:
Now this:

# Module 2 — Bases, coordinates, and change of basis (the missing backbone)

## 0) Why this module matters (what it secretly powers later)

Almost everything “fancy” later is just this idea:

> Pick coordinates where the problem becomes simple.

* Eigen-decomposition: choose a basis of eigenvectors → matrix becomes diagonal.
* SVD: choose orthonormal bases in domain/range → matrix becomes “diagonal” (singular values).
* PCA: choose coordinates aligned with variance → covariance becomes diagonal.

So Module 2 is not bookkeeping. It’s the *formal language* of “change coordinates to simplify.”

---

# 1) Span, linear combinations, and subspaces (fully precise)

## 1.1 Span

Given vectors (v^{(1)},\dots,v^{(k)}\in\mathbb R^n), their **span** is
[
\mathrm{span}{v^{(1)},\dots,v^{(k)}}
:=\left{\sum_{i=1}^k \theta_i v^{(i)}:\theta_i\in\mathbb R\right}.
]
**Meaning:** all vectors you can build from these using scaling + addition.

### Claim: (\mathrm{span}{v^{(1)},\dots,v^{(k)}}) is a subspace of (\mathbb R^n)

**Proof.** Call the set (S). We check the subspace axioms:

1. (0\in S): choose all (\theta_i=0), then (\sum \theta_i v^{(i)}=0).

2. Closed under addition: if (x=\sum \alpha_i v^{(i)}) and (y=\sum \beta_i v^{(i)}), then
   [
   x+y=\sum (\alpha_i+\beta_i)v^{(i)}\in S.
   ]

3. Closed under scalar multiplication: if (x=\sum \alpha_i v^{(i)}) and (c\in\mathbb R), then
   [
   cx=\sum (c\alpha_i)v^{(i)}\in S.
   ]
   So (S) is a subspace. ∎

---

# 2) Linear independence, dependence (what it really means)

## 2.1 Definition (linear independence)

Vectors (v^{(1)},\dots,v^{(k)}\in\mathbb R^n) are **linearly independent** if
[
\sum_{i=1}^k \theta_i v^{(i)}=0 \quad\Rightarrow\quad \theta_1=\cdots=\theta_k=0.
]
They are **dependent** if there exists a nonzero coefficient vector (\theta\neq 0) with
[
\sum_{i=1}^k \theta_i v^{(i)}=0.
]

**Meaning (verbal):**

* independent = none of them is redundant; you can’t make one from the others.
* dependent = redundancy exists; at least one is a combination of the rest.

### Key equivalence (proved): dependence ⇔ one vector lies in span of others

**Claim.** (v^{(1)},\dots,v^{(k)}) are linearly dependent iff there exists an index (j) such that
[
v^{(j)}\in \mathrm{span}{v^{(1)},\dots,v^{(j-1)},v^{(j+1)},\dots,v^{(k)}}.
]

**Proof.**

((\Rightarrow)) Dependence means there exist coefficients (\theta_i), not all zero, such that (\sum \theta_i v^{(i)}=0). Pick (j) with (\theta_j\neq 0). Then
[
\theta_j v^{(j)} = -\sum_{i\neq j}\theta_i v^{(i)}
\quad\Rightarrow\quad
v^{(j)} = -\sum_{i\neq j}\frac{\theta_i}{\theta_j}v^{(i)},
]
so (v^{(j)}) is in the span of the others.

((\Leftarrow)) If some (v^{(j)}) is a combination of others,
[
v^{(j)}=\sum_{i\neq j} a_i v^{(i)},
]
then
[
v^{(j)}-\sum_{i\neq j}a_i v^{(i)}=0
]
is a nontrivial linear relation (coefficient of (v^{(j)}) is 1), so the set is dependent. ∎

---

# 3) Basis and dimension (the central structure)

## 3.1 Basis (definition)

Let (V\subseteq\mathbb R^n) be a subspace. A list ((b_1,\dots,b_m)) of vectors in (V) is a **basis of (V)** if:

1. (Spanning) (V=\mathrm{span}{b_1,\dots,b_m})
2. (Independence) (b_1,\dots,b_m) are linearly independent.

**Meaning:** a basis is a minimal spanning set / a maximal independent set. It’s the “right set of building blocks” for the space.

## 3.2 Dimension (definition)

The **dimension** of (V), written (\dim(V)), is the number of vectors in any basis of (V).

But wait: is that well-defined? What if different bases have different lengths?

That’s the first big theorem:

---

# 4) Dimension is well-defined (every basis has the same size)

This is the theorem you absolutely must own.

## 4.1 Lemma (Steinitz Exchange / Replacement Lemma — core engine)

Let (V) be a vector space (subspace of (\mathbb R^n)). Suppose:

* (S={s_1,\dots,s_m}) spans (V),
* (L={\ell_1,\dots,\ell_k}) is linearly independent in (V).

Then:
[
k\le m,
]
and moreover you can replace (k) vectors in (S) with the vectors in (L) and still have a spanning set.

### Proof (careful, step-by-step)

Because (S) spans (V), we can write (\ell_1) as a combination of (S):
[
\ell_1=\sum_{i=1}^m a_i s_i.
]
Not all (a_i) are zero (otherwise (\ell_1=0), impossible because (L) is independent, hence (\ell_1\neq 0)). So pick an index (j_1) with (a_{j_1}\neq 0). Solve for (s_{j_1}):
[
s_{j_1}=\frac{1}{a_{j_1}}\ell_1-\sum_{i\neq j_1}\frac{a_i}{a_{j_1}}s_i.
]
This shows (s_{j_1}) lies in the span of ({\ell_1}\cup(S\setminus{s_{j_1}})). Therefore the set
[
S_1:={\ell_1}\cup(S\setminus{s_{j_1}})
]
still spans (V) (because every old (s_{j_1}) is recoverable from the new set, and all other (s_i) are already included).

Now repeat: since (S_1) spans (V), express (\ell_2) as a combination of (S_1). If the coefficient on (\ell_1) were the only nonzero term, then (\ell_2) would be a multiple of (\ell_1), contradicting independence of (L). So some vector from the remaining (S)-part must have nonzero coefficient; replace that one with (\ell_2) to get a new spanning set (S_2).

Continue this process. Each step replaces **one** of the original spanning vectors (s_i) with one new independent vector (\ell_j), and keeps spanning.

After (k) steps, we have replaced (k) distinct vectors from (S). That’s only possible if (k\le m). ∎

---

## 4.2 Theorem: any two bases have the same cardinality

Let (B={b_1,\dots,b_m}) and (C={c_1,\dots,c_k}) be bases of (V).
Then (m=k).

### Proof

* Since (B) is a basis, it spans (V). Since (C) is independent, apply Steinitz to conclude (k\le m).
* Since (C) spans (V) and (B) is independent, apply Steinitz again to conclude (m\le k).
  Therefore (m=k). ∎

So (\dim(V)) is well-defined.

---

# 5) Coordinates: turning vectors into numbers relative to a basis

This is the “basis = coordinate system” idea made formal.

## 5.1 Coordinate representation (definition)

Let (B=(b_1,\dots,b_m)) be a basis of (V).
For any (v\in V), because (B) spans (V), there exist scalars (\alpha_1,\dots,\alpha_m) such that
[
v=\sum_{i=1}^m \alpha_i b_i.
]
Because (B) is independent, these coefficients are **unique**.

### Theorem (existence + uniqueness of coordinates)

For each (v\in V), there exists a unique (\alpha\in\mathbb R^m) such that (v=\sum \alpha_i b_i).

**Proof.**

* Existence: spanning property of basis.
* Uniqueness: suppose (v=\sum \alpha_i b_i=\sum \beta_i b_i). Subtract:
  [
  0=v-v=\sum(\alpha_i-\beta_i)b_i.
  ]
  By independence, each (\alpha_i-\beta_i=0), hence (\alpha=\beta). ∎

We call ([v]_B := (\alpha_1,\dots,\alpha_m)^\top) the **coordinate vector of (v) in basis (B)**.

---

## 5.2 The basis matrix and the coordinate map (very important)

Let (B=[b_1\ \cdots\ b_m]) be the (n\times m) matrix with basis vectors as columns.

Then:
[
v = B\alpha \quad\Longleftrightarrow\quad \alpha = [v]_B.
]

* The map (\alpha\mapsto B\alpha) builds the actual vector from coordinates.
* The map (v\mapsto [v]_B) is the inverse map on the subspace (V).

If (V=\mathbb R^n), then (m=n) and (B) is square and invertible, so:
[
[v]_B = B^{-1}v.
]

That formula is not “definition”; it’s a *derived fact* once you know (B) is invertible.

---

# 6) Change of basis (coordinate conversion without confusion)

Let (B=(b_1,\dots,b_n)) and (C=(c_1,\dots,c_n)) be two bases of (\mathbb R^n).
Let (B) and (C) also denote their basis matrices (B=[b_1\ \cdots\ b_n]), (C=[c_1\ \cdots\ c_n]).

For any vector (v),
[
v = B[v]_B = C[v]_C.
]

### Goal

Given ([v]_B), compute ([v]_C).

From (v=B[v]_B),
[
[v]_C = C^{-1}v = C^{-1}B[v]_B.
]

### Definition (change-of-basis matrix)

[
\boxed{\ P_{C\leftarrow B} := C^{-1}B\ }
]
so
[
\boxed{\ [v]*C = P*{C\leftarrow B}[v]_B. \ }
]

**Interpretation:** (P_{C\leftarrow B}) converts *coordinates* from basis (B) to basis (C).

### Inverse relationship (must know)

[
P_{B\leftarrow C} = B^{-1}C = (C^{-1}B)^{-1} = (P_{C\leftarrow B})^{-1}.
]

---

# 7) Orthonormal bases and orthogonal matrices (why they preserve lengths/angles)

Now we tie Module 0 (inner products) to bases.

## 7.1 Orthonormal set/basis

Vectors (q_1,\dots,q_n) are **orthonormal** if
[
q_i^\top q_j =
\begin{cases}
1,& i=j\
0,& i\ne j.
\end{cases}
]

Let (Q=[q_1\ \cdots\ q_n]). Then the orthonormality condition is exactly:
[
\boxed{\ Q^\top Q = I\ }.
]

If (Q) is square ((n\times n)), then (Q^\top Q=I) implies (Q) is invertible and
[
\boxed{\ Q^{-1}=Q^\top,\qquad QQ^\top=I. \ }
]
Such a matrix (Q) is called **orthogonal**.

### Proof that (Q^{-1}=Q^\top)

By definition of inverse, (Q^{-1}) is the matrix such that (Q^{-1}Q=I).
But (Q^\top Q=I). Left-inverses of a square matrix are unique, so (Q^\top=Q^{-1}). (Or multiply both sides on the right by (Q^{-1}): (Q^\top QQ^{-1}=IQ^{-1}\Rightarrow Q^\top=Q^{-1}).) ∎

---

## 7.2 Orthonormal bases preserve dot products (and hence norms/angles)

**Claim.** For orthogonal (Q),
[
(Qx)^\top(Qy)=x^\top y \quad \forall x,y.
]

**Proof.**
[
(Qx)^\top(Qy)=x^\top Q^\top Q y = x^\top I y = x^\top y.
]
∎

### Corollary: length preservation

[
|Qx|_2^2=(Qx)^\top(Qx)=x^\top x=|x|_2^2
\Rightarrow |Qx|_2=|x|_2.
]
So orthogonal transformations are rotations/reflections: they preserve Euclidean geometry.

### Corollary: angle preservation

Define angle by (\cos\theta=\frac{x^\top y}{|x|_2|y|_2}) (well-defined for nonzero vectors). Since dot products and norms are preserved, (\theta) is preserved.

---

# 8) Practical “Do” skills (you should be able to compute this cleanly)

## 8.1 Coordinates in a basis

Given a basis matrix (B) and a vector (v), compute ([v]_B) by solving:
[
B\alpha=v.
]

* If (B) is square invertible: (\alpha=B^{-1}v).
* Numerically: solve linear system (do not explicitly invert).

## 8.2 Change of basis

Given ([v]_B), compute ([v]_C):
[
[v]_C = C^{-1}B[v]_B.
]

## 8.3 Orthonormal case (fast)

If (Q) is orthogonal (columns orthonormal), then
[
[v]_Q = Q^\top v
]
because (Q^{-1}=Q^\top).

This is why orthonormal bases are king: coordinate extraction is just a dot product with basis vectors.

---

# 9) End-of-Module 2 sanity checklist (don’t proceed unless true)

You should be able to:

1. Prove: “basis ⇒ unique coordinates” (existence + uniqueness).
2. Prove: “any two bases have same size” (using Steinitz exchange lemma).
3. Derive change-of-basis formula (P_{C\leftarrow B}=C^{-1}B).
4. Prove: orthogonal (Q) preserves dot products and (\ell_2) norms.
5. Explain in words: “eigen/SVD = choose bases where the linear map is simplest.”

---

If you’re ready, **Module 3** is next: **linear maps, image/kernel, rank–nullity**, and the solvability classification of (Ax=b). That’s where linear algebra becomes a “geometry of solution sets.”

## Response:
Thought for 34s

Alright—Module 2 is where linear algebra stops being “vectors and matrices” and becomes **a language for changing perspective without changing reality**.

I’m going to rewrite your Module 2 as a **no-gaps** newcomer walkthrough, but I’ll also **fix two subtle conceptual traps** that almost everyone trips over:

1.  When you talk about a basis of a **subspace**  $V\subseteq\mathbb R^n$ , the “basis matrix” is ** $n\times m$ ** (tall), so you generally **cannot write**  $[v]_B=B^{-1}v$ . There is no inverse. You _can_ still get coordinates uniquely, but the right statement is “solve  $B\alpha=v$  (consistent, unique because columns are independent).”
2.  Your change-of-basis formula  $P_{C\leftarrow B}=C^{-1}B$  is correct **only when both are bases of  $\mathbb R^n$ ** (square invertible matrices). For a subspace basis (tall matrices), the correct formula is different (and actually cleaner conceptually).

Let’s build it from atoms.

* * *

Module 2 — Bases, coordinates, change of basis (the missing backbone)
=====================================================================

0) What this module is secretly powering
----------------------------------------

The recurring meta-move:

> Same vector / same linear map, **different coordinates**.

Everything later is “choose coordinates where the matrix looks simple”:

*   **Eigen-decomposition**: choose eigenvector basis ⇒ matrix becomes diagonal (if diagonalizable).
*   **SVD**: choose orthonormal bases in input/output spaces ⇒ matrix becomes diagonal-ish (singular values).
*   **PCA**: choose eigenvector basis of covariance ⇒ covariance becomes diagonal ⇒ variance separates by coordinate.

If Module 2 is shaky, SVD/PCA/duality all feel like wizardry. If it’s solid, they feel like bookkeeping done right.

* * *

1) Span, linear combinations, subspaces (fully precise)
=======================================================

1.1 Linear combinations
-----------------------

Given vectors  $v^{(1)},\dots,v^{(k)}\in\mathbb R^n$ , a **linear combination** is

$$
\sum_{i=1}^k \theta_i v^{(i)} \quad \text{with } \theta_i\in\mathbb R.
$$

This is the only allowed “mixing rule” in linear algebra: scale, then add.

1.2 Span
--------

$$
\operatorname{span}\{v^{(1)},\dots,v^{(k)}\} :=\left\{\sum_{i=1}^k \theta_i v^{(i)}:\theta_i\in\mathbb R\right\}.
$$

**Meaning:** all vectors you can build using those building blocks under linear combination.

### Claim:  $\operatorname{span}\{v^{(1)},\dots,v^{(k)}\}$  is a subspace of  $\mathbb R^n$ 

Let  $S=\operatorname{span}\{v^{(1)},\dots,v^{(k)}\}$ . We check the subspace axioms _as set membership statements_:

1.  **Zero is in  $S$ .**  
    Choose all  $\theta_i=0$ . Then  $\sum_i \theta_i v^{(i)}=0$ . Hence  $0\in S$ .
2.  **Closed under addition.**  
    Take any  $x,y\in S$ . By definition of span, there exist scalars  $\alpha_i,\beta_i$  such that
    
$$
x=\sum_i \alpha_i v^{(i)},\qquad y=\sum_i \beta_i v^{(i)}.
$$

Then

$$
x+y=\sum_i (\alpha_i+\beta_i)v^{(i)},
$$

which is again a linear combination, hence  $x+y\in S$ .

3.  **Closed under scalar multiplication.**  
    Take  $x\in S$ , so  $x=\sum_i \alpha_i v^{(i)}$ . For any scalar  $c$ ,
    
$$
cx=\sum_i (c\alpha_i)v^{(i)}\in S.
$$

All three hold, so  $S$  is a subspace. ∎

* * *

2) Linear independence and dependence (what it _really_ means)
==============================================================

2.1 Definition (independence)
-----------------------------

Vectors  $v^{(1)},\dots,v^{(k)}$  are **linearly independent** if

$$
\sum_{i=1}^k \theta_i v^{(i)}=0 \ \Rightarrow\ \theta_1=\cdots=\theta_k=0.
$$

They are **dependent** if there exists a **nonzero** coefficient vector  $\theta\neq 0$  such that

$$
\sum_{i=1}^k \theta_i v^{(i)}=0.
$$

### Intuition made precise

*   “Independent” means the representation of  $0$  as a linear combination is **unique** (only trivial coefficients).
*   “Dependent” means there is a nontrivial linear relation; some redundancy exists.

2.2 Key equivalence: dependence ⇔ one vector is in the span of the others
-------------------------------------------------------------------------

### Claim

 $\{v^{(1)},\dots,v^{(k)}\}$  is dependent iff  $\exists j$  such that

$$
v^{(j)}\in \operatorname{span}\{v^{(i)}: i\neq j\}.
$$

**Proof.**

( $\Rightarrow$ ) If dependent, there exist  $\theta_i$  not all zero with  $\sum_i \theta_i v^{(i)}=0$ . Pick  $j$  with  $\theta_j\neq 0$ . Then

$$
\theta_j v^{(j)} = -\sum_{i\neq j}\theta_i v^{(i)} \quad\Rightarrow\quad v^{(j)} = -\sum_{i\neq j}\frac{\theta_i}{\theta_j} v^{(i)}.
$$

So  $v^{(j)}$  is in the span of the others.

( $\Leftarrow$ ) If  $v^{(j)}=\sum_{i\neq j} a_i v^{(i)}$ , then

$$
v^{(j)}-\sum_{i\neq j} a_i v^{(i)}=0
$$

is a nontrivial linear relation (coefficient of  $v^{(j)}$  is  $1$ ), so the set is dependent. ∎

* * *

3) Basis and dimension (the central structure)
==============================================

Let  $V\subseteq\mathbb R^n$  be a subspace.

3.1 Basis
---------

A list  $(b_1,\dots,b_m)$  in  $V$  is a **basis of  $V$ ** if:

1.  (**Spanning**) every  $v\in V$  can be written as  $v=\sum_{i=1}^m \alpha_i b_i$ . Equivalently  $V=\operatorname{span}\{b_1,\dots,b_m\}$ .
2.  (**Independence**) if  $\sum_{i=1}^m \theta_i b_i=0$ , then all  $\theta_i=0$ .

### Two “secret” equivalent characterizations (worth owning)

*   **Minimal spanning set:** a spanning set where removing any vector destroys spanning.
*   **Maximal independent set:** an independent set where adding any new vector makes it dependent.

These equivalences are not vibes; they can be proved from the dependence ⇔ redundancy lemma above.

3.2 Dimension
-------------

$$
\dim(V) := \text{number of vectors in any basis of }V.
$$

This is only meaningful if “any basis has same size.” That’s the next theorem.

* * *

4) Dimension is well-defined: Steinitz exchange lemma (the engine)
==================================================================

This is the theorem that prevents “dimension” from being a scam.

4.1 Steinitz Exchange Lemma (replacement lemma)
-----------------------------------------------

**Setup.** Let  $V$  be a vector space.

*    $S=\{s_1,\dots,s_m\}$  spans  $V$ .
*    $L=\{\ell_1,\dots,\ell_k\}$  is linearly independent in  $V$ .

**Claim.**  $k\le m$ , and moreover you can replace  $k$  of the  $s_i$ ’s by the  $\ell_j$ ’s and still span  $V$ .

### Proof (slow, explicit, induction-style)

We’ll build spanning sets  $S_0,S_1,\dots,S_k$  such that:

*    $S_0=S$ ,
*    $S_r$  spans  $V$ ,
*    $S_r$  contains  $\ell_1,\dots,\ell_r$ ,
*   and  $S_r$  has exactly  $m$  vectors (we replace one old vector each step).

**Step 1 (insert  $\ell_1$ ).**  
Since  $S_0$  spans  $V$ , we can express  $\ell_1$  as:

$$
\ell_1 = \sum_{i=1}^m a_i s_i.
$$

Not all  $a_i$  are zero because  $\ell_1\neq 0$  (independence implies each  $\ell_j\neq 0$ ). Choose an index  $j_1$  with  $a_{j_1}\neq 0$ . Solve for  $s_{j_1}$ :

$$
s_{j_1}=\frac{1}{a_{j_1}}\ell_1-\sum_{i\neq j_1}\frac{a_i}{a_{j_1}}s_i.
$$

This shows  $s_{j_1}$  is in the span of  $\{\ell_1\}\cup (S_0\setminus\{s_{j_1}\})$ . Therefore the set

$$
S_1 := \{\ell_1\}\cup (S_0\setminus\{s_{j_1}\})
$$

still spans  $V$ : every vector that used to be made from  $S_0$  can still be made, because the only removed generator  $s_{j_1}$  can be reconstructed from the new set.

**Inductive step (insert  $\ell_r$ ).**  
Assume  $S_{r-1}$  spans  $V$  and contains  $\ell_1,\dots,\ell_{r-1}$  plus  $m-(r-1)$  of the original  $s_i$ ’s.

Because  $S_{r-1}$  spans  $V$ , we can write

$$
\ell_r = \sum_{j=1}^{r-1} \gamma_j \ell_j \;+\; \sum_{s\in S_{r-1}\cap S_0} \delta_s\, s.
$$

Crucial point: **some  $\delta_s$  must be nonzero** for an “old” spanning vector  $s$ .  
Why? If all  $\delta_s=0$ , then  $\ell_r$  is a linear combination of  $\ell_1,\dots,\ell_{r-1}$ , which contradicts independence of  $L$ .

So pick one  $s_{j_r}\in S_{r-1}\cap S_0$  with  $\delta_{s_{j_r}}\neq 0$ , solve for that  $s_{j_r}$ , and replace it with  $\ell_r$  exactly like Step 1. You get a new set  $S_r$  of size  $m$  that still spans  $V$  and now contains  $\ell_1,\dots,\ell_r$ .

**After  $k$  steps.**  
We have replaced  $k$  distinct original  $s_i$ ’s. That is only possible if  $k\le m$ . ∎

4.2 Theorem: any two bases have the same size
---------------------------------------------

Let  $B=\{b_1,\dots,b_m\}$  and  $C=\{c_1,\dots,c_k\}$  be bases of  $V$ .

*    $B$  spans  $V$ ,  $C$  is independent ⇒ Steinitz gives  $k\le m$ .
*    $C$  spans  $V$ ,  $B$  is independent ⇒ Steinitz gives  $m\le k$ .

So  $m=k$ . Thus  $\dim(V)$  is well-defined. ∎

* * *

5) Coordinates: turning vectors into numbers relative to a basis
================================================================

This is the “vector = abstract object; coordinates = representation” distinction.

5.1 Coordinate theorem (existence + uniqueness)
-----------------------------------------------

Let  $B=(b_1,\dots,b_m)$  be a basis of  $V$ .

### Theorem

For every  $v\in V$ , there exists a **unique**  $\alpha\in\mathbb R^m$  such that

$$
v=\sum_{i=1}^m \alpha_i b_i.
$$

We define  $[v]_B:=\alpha$ .

**Proof.**

*   Existence:  $B$  spans  $V$ .
*   Uniqueness: suppose  $v=\sum_i \alpha_i b_i=\sum_i \beta_i b_i$ . Subtract:
    $$
    0=\sum_i(\alpha_i-\beta_i)b_i.
    $$
    Independence of  $B$  implies all  $\alpha_i-\beta_i=0$ , hence  $\alpha=\beta$ . ∎

### What this _really_ means

A basis gives a **bijection** between:

*   abstract vectors  $v\in V$ ,
*   coordinate vectors  $\alpha\in\mathbb R^m$ .

So  $V$  (dimension  $m$ ) is “the same as”  $\mathbb R^m$  as far as linear structure is concerned.

* * *

5.2 The basis matrix and the coordinate map (careful about shapes)
------------------------------------------------------------------

Let

$$
B := [\,b_1\ \cdots\ b_m\,]\in\mathbb R^{n\times m}.
$$

### Forward map: coordinates → vector

Define  $T_B:\mathbb R^m\to V\subseteq\mathbb R^n$  by

$$
T_B(\alpha)=B\alpha=\sum_{i=1}^m \alpha_i b_i.
$$

This is linear and surjective onto  $V$ .

### Inverse map on  $V$ : vector → coordinates

For  $v\in V$ , define  $[v]_B$  to be the unique  $\alpha$  with  $B\alpha=v$ .

**Important:** if  $m<n$ ,  $B$  is not square, so “ $B^{-1}$ ” does not exist.  
The correct statement is:

$$
\boxed{\text{If } v\in V=\operatorname{col}(B),\ \text{then the system }B\alpha=v\text{ has a unique solution.}}
$$

Why unique? Because the columns  $b_i$  are independent, which is equivalent to:

$$
B\alpha=0 \Rightarrow \alpha=0
$$

(i.e.,  $B$  has **full column rank**  $m$ ).

### Special case:  $V=\mathbb R^n$ 

Then  $m=n$ ,  $B\in\mathbb R^{n\times n}$  is invertible, and only then:

$$
[v]_B=B^{-1}v.
$$

That’s a derived fact, not the definition.

* * *

5.3 A computationally useful formula when  $m<n$  (and  $v\in V$ )
------------------------------------------------------------------

If  $B$  has full column rank, then  $B^\top B\in\mathbb R^{m\times m}$  is invertible and

$$
\boxed{[v]_B = (B^\top B)^{-1}B^\top v\quad \text{(provided } v\in \operatorname{col}(B)\text{).}}
$$

**Why it works (proof):**  
If  $v=B\alpha$ , then

$$
B^\top v = B^\top B\alpha.
$$

Since  $B^\top B$  is invertible,  $\alpha=(B^\top B)^{-1}B^\top v$ . ∎

**Numerical note:** don’t compute  $(B^\top B)^{-1}$  explicitly; solve  $(B^\top B)\alpha=B^\top v$ .

* * *

6) Change of basis (two cases: full space vs subspace)
======================================================

This is where people get confused, so we’ll separate cases.

6.1 Case A: Bases of  $\mathbb R^n$  (square matrices)
------------------------------------------------------

Let  $B=(b_1,\dots,b_n)$ ,  $C=(c_1,\dots,c_n)$  be bases of  $\mathbb R^n$ .  
Basis matrices  $B,C\in\mathbb R^{n\times n}$  are invertible.

For any  $v$ ,

$$
v=B[v]_B=C[v]_C.
$$

Solve for  $[v]_C$ :

$$
[v]_C=C^{-1}v=C^{-1}B[v]_B.
$$

### Definition (change-of-coordinates matrix)

$$
\boxed{P_{C\leftarrow B}:=C^{-1}B} \quad\Rightarrow\quad \boxed{[v]_C=P_{C\leftarrow B}[v]_B}.
$$

Inverse relationship:

$$
P_{B\leftarrow C}=B^{-1}C=(C^{-1}B)^{-1}=(P_{C\leftarrow B})^{-1}.
$$

* * *

6.2 Case B: Bases of a subspace  $V\subseteq\mathbb R^n$  (tall matrices)
-------------------------------------------------------------------------

Now  $V$  has dimension  $m$  (possibly  $m<n$ ). Let

*    $B=(b_1,\dots,b_m)$  be a basis of  $V$ ,
*    $C=(c_1,\dots,c_m)$  be another basis of  $V$ .

Basis matrices are  $B,C\in\mathbb R^{n\times m}$ . Not invertible.

But a change-of-basis matrix still exists—and it’s actually more conceptual:

### Proposition (coordinate conversion inside  $V$ )

There exists a unique invertible matrix  $P_{C\leftarrow B}\in\mathbb R^{m\times m}$  such that

$$
\boxed{B = C\,P_{C\leftarrow B}.}
$$

And for every  $v\in V$ ,

$$
\boxed{[v]_C = P_{C\leftarrow B}\,[v]_B.}
$$

**Proof (clear and structural).**

*   Each basis vector  $b_j\in V$  can be written uniquely in the  $C$ \-basis:
    $$
    b_j = \sum_{i=1}^m p_{ij} c_i.
    $$
    Put these coefficients into a matrix  $P=(p_{ij})$ . Column  $j$  of  $P$  is exactly  $[b_j]_C$ . Writing all columns at once gives:
    $$
    B = C P.
    $$
    Uniqueness of coordinates makes  $P$  unique.
*   Now take any  $v\in V$ . Write  $v=B\alpha=C\beta$  with  $\alpha=[v]_B$ ,  $\beta=[v]_C$ . Using  $B=CP$ ,
    $$
    v=B\alpha = (CP)\alpha = C(P\alpha).
    $$
    By uniqueness of  $C$ \-coordinates,  $\beta=P\alpha$ . Hence  $[v]_C=P[v]_B$ .
*    $P$  is invertible because it converts coordinates between two bases; if it were singular, distinct  $\alpha$  could map to same  $\beta$ , violating uniqueness. (Formally: if  $P\alpha=0$  with  $\alpha\neq 0$ , then  $B\alpha=C(P\alpha)=0$ , contradicting independence of  $B$ ’s columns.) ∎

**Key takeaway:**

*   In  $\mathbb R^n$ :  $P=C^{-1}B$ .
*   In a subspace:  $P$  is defined by “coordinates of  $B$ \-vectors in the  $C$ \-basis,” i.e.  $B=CP$ .

* * *

7) Orthonormal bases, orthogonal matrices, and why they preserve geometry
=========================================================================

Now we weld Module 0 (inner products) to Module 2 (bases).

7.1 Orthonormal sets and matrices
---------------------------------

Vectors  $q_1,\dots,q_m\in\mathbb R^n$  are **orthonormal** if

$$
q_i^\top q_j=\delta_{ij}.
$$

Let  $Q=[q_1\ \cdots\ q_m]\in\mathbb R^{n\times m}$ . Then orthonormality is exactly:

$$
\boxed{Q^\top Q = I_m.}
$$

### Two cases again

*   If  $m=n$ :  $Q$  is square and called **orthogonal**.
*   If  $m<n$ :  $Q$  is tall with orthonormal columns (an isometric embedding of  $\mathbb R^m$  into  $\mathbb R^n$ ).

7.2 Square case:  $Q^{-1}=Q^\top$ 
----------------------------------

If  $Q\in\mathbb R^{n\times n}$  and  $Q^\top Q=I$ , then  $Q^\top$  is a left-inverse. For square matrices, left-inverse implies inverse. Hence

$$
\boxed{Q^{-1}=Q^\top} \quad\text{and also}\quad QQ^\top=I.
$$

7.3 Dot products and norms are preserved (the geometry payoff)
--------------------------------------------------------------

If  $Q$  is orthogonal (square),

$$
(Qx)^\top(Qy)=x^\top(Q^\top Q)y=x^\top y.
$$

Set  $y=x$  to get norm preservation:

$$
\|Qx\|_2^2=(Qx)^\top(Qx)=x^\top x=\|x\|_2^2 \Rightarrow \|Qx\|_2=\|x\|_2.
$$

So orthogonal transforms are “rotations/reflections” in the precise sense: they preserve Euclidean inner products.

7.4 Tall case:  $Q^\top Q=I_m$  still has powerful consequences
---------------------------------------------------------------

If  $Q\in\mathbb R^{n\times m}$  with orthonormal columns:

1.  **Coordinate extraction inside the subspace is easy.**  
    For any  $v\in \operatorname{col}(Q)$ , write  $v=Q\alpha$ . Multiply by  $Q^\top$ :
    
$$
Q^\top v = Q^\top Q\alpha = I_m\alpha=\alpha.
$$

So

$$
\boxed{[v]_Q = Q^\top v\quad \text{for } v\in \operatorname{col}(Q).}
$$
2.  ** $QQ^\top$  is the orthogonal projector onto  $\operatorname{col}(Q)$ .**
    *   Symmetric:  $(QQ^\top)^\top=QQ^\top$ .
*   Idempotent:  $(QQ^\top)^2=Q(Q^\top Q)Q^\top=QQ^\top$ .
*   It fixes the subspace: if  $v=Q\alpha$ , then  $QQ^\top v=Q(Q^\top Q)\alpha=Q\alpha=v$ .
*   It kills orthogonal complement: if  $v\perp \operatorname{col}(Q)$ , then  $Q^\top v=0$ , so  $QQ^\top v=0$ .

This is the linear algebra heart of least squares and PCA.

* * *

8) “Do skills” (computational tasks, with correct cases)
========================================================

8.1 Coordinates in a basis (general subspace)
---------------------------------------------

Given  $B\in\mathbb R^{n\times m}$  with independent columns and  $v\in \operatorname{col}(B)$ , compute  $[v]_B$  by solving:

$$
B\alpha=v.
$$
*   Existence is guaranteed because  $v\in \operatorname{col}(B)$ .
*   Uniqueness is guaranteed because columns are independent.

**Do not compute an inverse** (there isn’t one if  $m<n$ ). Use a linear solver.

If you want a closed form (still solve numerically):

$$
(B^\top B)\alpha = B^\top v.
$$

8.2 Change of basis in a subspace  $V$ 
---------------------------------------

Given bases  $B,C\in\mathbb R^{n\times m}$  of the same subspace  $V$ , compute  $P_{C\leftarrow B}\in\mathbb R^{m\times m}$  by solving:

$$
B = C P_{C\leftarrow B}.
$$

Interpretation: each column of  $P_{C\leftarrow B}$  is  $[b_j]_C$ .

Then for any  $v\in V$ ,

$$
[v]_C = P_{C\leftarrow B}[v]_B.
$$

8.3 Orthonormal basis case (fastest)
------------------------------------

If  $Q$  has orthonormal columns spanning  $V$ , then for any  $v\in V$ :

$$
\boxed{[v]_Q = Q^\top v.}
$$

This is why orthonormal bases are king: coordinate extraction becomes dot products.

* * *

9) (Bridge to eigen/SVD/PCA) Matrices change under basis change
===============================================================

This is the precise algebra behind “choose coordinates where the operator is simple.”

Let  $A:\mathbb R^n\to\mathbb R^n$  be linear, represented in standard coordinates by matrix  $A$ .

Let  $B,C$  be bases of  $\mathbb R^n$  with basis matrices  $B,C\in\mathbb R^{n\times n}$ .

### The matrix of the same linear map in different coordinates

We want a matrix  $[A]_{C\leftarrow B}$  such that:

$$
[A v]_C = [A]_{C\leftarrow B}\,[v]_B.
$$

Derive it:

$$
v = B[v]_B,\quad Av = A(B[v]_B).
$$

Convert to  $C$ \-coordinates:

$$
[Av]_C = C^{-1}(Av)=C^{-1}A B [v]_B.
$$

So

$$
\boxed{[A]_{C\leftarrow B} = C^{-1} A B.}
$$

Special case  $B=C$ :

$$
[A]_B = B^{-1} A B
$$

This is **similarity**. Diagonalization is exactly: find  $B$  such that  $B^{-1}AB$  is diagonal.

SVD is similar but with different orthonormal bases on domain/range.

* * *

10) End-of-Module 2 sanity checklist (tightened)
================================================

You should be able to do these without bluffing:

1.  **Span is a subspace**: prove closure and  $0\in$  span.
2.  **Dependence equivalence**: dependent ⇔ one vector is in span of others.
3.  **Steinitz**: independent set size ≤ spanning set size; conclude bases have same size.
4.  **Coordinates**: existence from spanning; uniqueness from independence.
5.  **Basis matrix shapes**: know when  $B^{-1}$  makes sense (only full basis of  $\mathbb R^n$ ).
6.  **Change of basis**:
    *   full space:  $P_{C\leftarrow B}=C^{-1}B$ ,
    *   subspace: define  $P$  via  $B=CP$ .
7.  **Orthonormal columns**:  $Q^\top Q=I$ , coordinates  $Q^\top v$  for  $v$  in the subspace, and  $QQ^\top$  is the projector.

* * *

If you want the _next_ module to feel inevitable, Module 3 should start from:  
**linear maps, column space/kernel, rank-nullity, and solving  $Ax=b$ **—because that’s the “geometry of solution sets” foundation for least squares, SVD, PCA, and later KKT constraints.

## Prompt:
Now this:

# Module 3 — Linear maps, image/kernel, rank–nullity, and the anatomy of (Ax=b)

## 0) What this module is secretly doing

Module 2 gave you “coordinates depend on a basis.” Module 3 is where that becomes weaponized:

* A **matrix** is just the coordinate representation of a **linear map**.
* Solving (Ax=b) is not “algebra.” It is:

  * **Does (b) lie in the image (column space)?**
  * If yes, **what does the kernel (null space) look like?**

Rank–nullity is the conservation law that makes the whole story predictable.

---

# 1) Linear maps (definition) and why matrices are their coordinate forms

## 1.1 Definition (linear map)

Let (V,W) be vector spaces (for us, subspaces of (\mathbb R^n), (\mathbb R^m)). A function
[
T:V\to W
]
is **linear** if for all (x,z\in V) and all scalars (\alpha,\beta\in\mathbb R),
[
T(\alpha x+\beta z)=\alpha T(x)+\beta T(z).
]

### Equivalent “two-axiom” form

It is equivalent to require both:

1. additivity: (T(x+z)=T(x)+T(z))
2. homogeneity: (T(\alpha x)=\alpha T(x))

**Proof of equivalence.**

* If the one-line property holds, plug ((\alpha,\beta)=(1,1)) to get additivity and ((\alpha,\beta)=(\alpha,0)) to get homogeneity.
* Conversely, if additivity and homogeneity hold, then
  [
  T(\alpha x+\beta z)=T(\alpha x)+T(\beta z)=\alpha T(x)+\beta T(z).
  ]
  ∎

### Immediate consequences (proved)

* (T(0)=0).
  Proof: (T(0)=T(0\cdot x)=0\cdot T(x)=0). ∎
* (T(-x)=-T(x)).
  Proof: (0=T(0)=T(x+(-x))=T(x)+T(-x)). ∎

---

## 1.2 Matrices implement linear maps

Given (A\in\mathbb R^{m\times n}), define (T_A:\mathbb R^n\to\mathbb R^m) by
[
T_A(x)=Ax.
]
Then (T_A) is linear.

**Proof.** For (x,z\in\mathbb R^n), (\alpha,\beta\in\mathbb R),
[
A(\alpha x+\beta z)=\alpha Ax+\beta Az
]
by distributivity of matrix multiplication over vector addition and scalar multiplication (which itself follows componentwise from real arithmetic). Hence linearity. ∎

**Core viewpoint:**

* “Linear map” is the geometric object.
* “Matrix” is its coordinate representation (once bases are chosen).

---

# 2) Kernel and image (null space and column space)

Let (T:V\to W) be linear.

## 2.1 Definitions

* **Kernel / null space**
  [
  \ker(T)={x\in V: T(x)=0}.
  ]
* **Image / range**
  [
  \mathrm{im}(T)=T(V)={T(x):x\in V}\subseteq W.
  ]

For (A\in\mathbb R^{m\times n}) (thinking (T_A(x)=Ax)):

* (\ker(A)={x:Ax=0}\subseteq\mathbb R^n)
* (\mathrm{im}(A)={Ax:x\in\mathbb R^n}\subseteq\mathbb R^m) = **column space** (\mathcal C(A))

---

## 2.2 Kernel and image are subspaces (proved, no skipping)

### Theorem 1: (\ker(T)) is a subspace of (V)

**Proof.** Check subspace axioms:

1. (0\in\ker(T)) since (T(0)=0).

2. Closed under addition: if (x,z\in\ker(T)), then (T(x)=0), (T(z)=0). Linearity gives
   [
   T(x+z)=T(x)+T(z)=0+0=0,
   ]
   so (x+z\in\ker(T)).

3. Closed under scalar multiplication: if (x\in\ker(T)), then (T(x)=0). For any (\alpha),
   [
   T(\alpha x)=\alpha T(x)=\alpha\cdot 0=0,
   ]
   so (\alpha x\in\ker(T)).

Thus (\ker(T)) is a subspace. ∎

### Theorem 2: (\mathrm{im}(T)) is a subspace of (W)

**Proof.** We show it contains (0) and is closed under linear combinations.

1. (0\in\mathrm{im}(T)) because (0=T(0)).

2. Take (y_1,y_2\in\mathrm{im}(T)). Then (\exists x_1,x_2\in V) such that (y_1=T(x_1)), (y_2=T(x_2)). For any (\alpha,\beta),
   [
   \alpha y_1+\beta y_2 = \alpha T(x_1)+\beta T(x_2)=T(\alpha x_1+\beta x_2)\in\mathrm{im}(T).
   ]

Hence (\mathrm{im}(T)) is a subspace. ∎

**Intuition:**

* Kernel = directions that collapse to zero under the map.
* Image = all outputs you can ever produce.

---

# 3) Rank and nullity (definitions)

Let (A\in\mathbb R^{m\times n}).

## 3.1 Definitions

* **Nullity**
  [
  \mathrm{nullity}(A) := \dim(\ker(A)).
  ]
* **Rank**
  [
  \mathrm{rank}(A) := \dim(\mathrm{im}(A)) = \dim(\mathcal C(A)).
  ]

**Geometric meaning:**

* rank = output dimension (how many independent directions survive in the output).
* nullity = input dimension lost to collapse.

---

# 4) Rank–Nullity Theorem (full proof)

## Theorem (Rank–Nullity)

For (A\in\mathbb R^{m\times n}),
[
\boxed{\ \dim(\ker(A))+\dim(\mathrm{im}(A)) = n.\ }
]
Equivalently,
[
\boxed{\ \mathrm{nullity}(A)+\mathrm{rank}(A)=n.\ }
]

### Proof (basis extension + independence argument)

Let (K=\ker(A)\subseteq\mathbb R^n). Let ({k_1,\dots,k_p}) be a basis of (K). Then
[
p=\dim(K)=\mathrm{nullity}(A).
]

**Step 1: Extend a basis of the kernel to a basis of (\mathbb R^n).**
By the basis extension theorem (a consequence of Steinitz exchange from Module 2), we can add vectors (u_1,\dots,u_q) so that
[
{k_1,\dots,k_p,u_1,\dots,u_q}
]
is a basis of (\mathbb R^n). Since (\dim(\mathbb R^n)=n), we have
[
p+q=n.
]

**Step 2: Show ({Au_1,\dots,Au_q}) spans (\mathrm{im}(A)).**
Take any (y\in\mathrm{im}(A)). Then (y=Ax) for some (x\in\mathbb R^n). Expand (x) in the basis above:
[
x=\sum_{i=1}^p \alpha_i k_i + \sum_{j=1}^q \beta_j u_j.
]
Apply (A):
[
Ax=\sum_{i=1}^p \alpha_i A k_i + \sum_{j=1}^q \beta_j A u_j.
]
But each (k_i\in\ker(A)), so (Ak_i=0). Therefore
[
y=Ax=\sum_{j=1}^q \beta_j A u_j,
]
so (y) is in the span of ({Au_1,\dots,Au_q}). Hence they span (\mathrm{im}(A)).

**Step 3: Show ({Au_1,\dots,Au_q}) is linearly independent.**
Assume
[
\sum_{j=1}^q \gamma_j A u_j = 0.
]
Then
[
A\left(\sum_{j=1}^q \gamma_j u_j\right)=0,
]
so (w:=\sum_{j=1}^q \gamma_j u_j\in \ker(A)=K).

But (w) is in (\mathrm{span}{u_1,\dots,u_q}), and also in (\mathrm{span}{k_1,\dots,k_p}) (since it’s in (K)). In the basis
({k_1,\dots,k_p,u_1,\dots,u_q}), the coordinate representation is unique. The only way a vector can be represented using only the (u)-part and also only the (k)-part is if it is the zero vector. Thus (w=0).

Now (w=\sum_{j=1}^q \gamma_j u_j=0), and since the full basis is linearly independent, the subset ({u_1,\dots,u_q}) is independent, so all (\gamma_j=0). Hence ({Au_j}) is independent.

**Conclusion:** ({Au_1,\dots,Au_q}) is a basis of (\mathrm{im}(A)), so
[
\mathrm{rank}(A)=\dim(\mathrm{im}(A))=q.
]
Recall (p+q=n), so
[
\mathrm{nullity}(A)+\mathrm{rank}(A)=p+q=n.
]
∎

**Commentary (what to *feel*):**
Rank–nullity is a conservation law: an (n)-dimensional input space gets partitioned into:

* directions killed by (A) (nullity),
* directions that survive and create independent output directions (rank).

---

# 5) Solving (Ax=b): existence, uniqueness, and the full solution set

Let (A\in\mathbb R^{m\times n}), (b\in\mathbb R^m).

## 5.1 Existence ⇔ (b) is in the image (column space)

### Theorem

[
Ax=b \text{ has a solution } \iff b\in \mathrm{im}(A)=\mathcal C(A).
]

**Proof.**

* ((\Rightarrow)) If (Ax=b) for some (x), then (b) is literally of the form (Ax), so (b\in\mathrm{im}(A)).
* ((\Leftarrow)) If (b\in\mathrm{im}(A)), by definition (\exists x) such that (Ax=b). ∎

This is as clean as it gets: solvability is membership in a subspace.

---

## 5.2 If one solution exists, all solutions are that solution + null space

### Theorem (structure of the solution set)

Assume (Ax=b) is consistent and let (x_p) be any particular solution ((Ax_p=b)). Then:
[
\boxed{\ {x:Ax=b} = x_p + \ker(A) = {x_p+z: z\in\ker(A)}. \ }
]

**Proof.**

* (⊆) Let (x) be any solution: (Ax=b). Then
  [
  A(x-x_p)=Ax-Ax_p=b-b=0,
  ]
  so (x-x_p\in\ker(A)). Hence (x=x_p+z) with (z\in\ker(A)).
* (⊇) Conversely, if (z\in\ker(A)), then
  [
  A(x_p+z)=Ax_p+Az=b+0=b,
  ]
  so (x_p+z) is a solution.

Thus the set is exactly (x_p+\ker(A)). ∎

**Interpretation:** the solution set is an **affine subspace**: a translate of the null space.

---

## 5.3 Uniqueness ⇔ null space is trivial (assuming consistency)

### Theorem

If (Ax=b) is consistent, then the solution is unique iff (\ker(A)={0}) iff (\mathrm{nullity}(A)=0).

**Proof.**

* If (\ker(A)={0}), then (x_p+\ker(A)={x_p}): only one solution.
* If (\ker(A)\neq{0}), pick (z\neq 0\in\ker(A)). Then (x_p) and (x_p+z) are distinct solutions. Not unique. ∎

---

## 5.4 Dimension of the solution set (when consistent)

If consistent, the solution set is (x_p+\ker(A)). Translations do not change dimension, so:
[
\dim({x:Ax=b}) = \dim(\ker(A))=\mathrm{nullity}(A)=n-\mathrm{rank}(A).
]
(using rank–nullity)

**Meaning:** every independent constraint direction you add (increasing rank) reduces degrees of freedom.

---

# 6) Injective vs surjective vs bijective (what rank really tells you)

For (A:\mathbb R^n\to\mathbb R^m):

## 6.1 Injective (one-to-one)

(A) is injective iff (\ker(A)={0}) iff (\mathrm{rank}(A)=n) (**full column rank**).

**Reason:** (Ax=Az \iff A(x-z)=0 \iff x-z\in\ker(A)).

## 6.2 Surjective (onto)

(A) is surjective iff (\mathrm{im}(A)=\mathbb R^m) iff (\mathrm{rank}(A)=m) (**full row rank**).

## 6.3 Bijective (invertible)

Only possible when (m=n). Then (A) is invertible iff (\mathrm{rank}(A)=n) iff (\ker(A)={0}).

---

# 7) “Do” skills: how to compute rank, kernel, image, and classify (Ax=b)

## 7.1 Row reduction and rank

Perform Gaussian elimination to obtain a row-echelon form (or RREF).

* The number of **pivots** = (\mathrm{rank}(A)).
* Pivot columns in the original matrix form a basis for (\mathcal C(A)).

## 7.2 Kernel (null space)

Solve (Ax=0) using RREF:

* Identify pivot variables vs free variables.
* Express pivot variables in terms of free variables.
* Write general solution as linear combination of free-parameter vectors; those vectors form a basis of (\ker(A)).
* Number of free variables = (n-\mathrm{rank}(A)=\mathrm{nullity}(A)).

## 7.3 Solving (Ax=b)

Row-reduce the augmented matrix ([A\mid b]).

* If you ever get a row ([0\ 0\ \cdots\ 0\mid c]) with (c\neq 0), inconsistent (no solution).
* Otherwise:

  * find one particular solution (x_p),
  * then add general kernel solution: (x=x_p+z).

---

# 8) End-of-Module 3 sanity checklist

You should be able to prove (not just state):

1. (\ker(T)) and (\mathrm{im}(T)) are subspaces for any linear map (T).
2. Rank–nullity via “extend kernel basis to full basis, map the extension, show it becomes a basis of the image.”
3. (Ax=b) solvable ⇔ (b\in\mathcal C(A)).
4. If consistent, solution set is (x_p+\ker(A)) and has dimension (n-\mathrm{rank}(A)).
5. Injective ⇔ full column rank; surjective ⇔ full row rank; invertible ⇔ both (square case).

---

**Next module (Module 4):** the **four fundamental subspaces** and the orthogonality identities
(\mathcal C(A)=\mathcal N(A^\top)^\perp), (\mathcal C(A^\top)=\mathcal N(A)^\perp).
That’s where geometry really snaps into place and least squares starts to feel inevitable.

## Response:
Thought for 14s

Alright. Module 3 is where linear algebra becomes **a geometry of “what information survives a transformation”**. I’ll rewrite your draft at the same “no gaps” level, but even more granular, with every hidden lemma exposed, and with the _full anatomy_ of  $Ax=b$  (existence/uniqueness/shape/dimension + computational tests).

I’ll keep your structure, but I’ll tighten a few statements and add the missing glue: **rank vs pivots**, **consistency via augmented rank**, and the “four cases” mental model.

* * *

Module 3 — Linear maps, image/kernel, rank–nullity, and the anatomy of  $Ax=b$ 
===============================================================================

0) What this module is secretly doing
-------------------------------------

Module 2 taught: **vectors are abstract; coordinates depend on a basis**.

Module 3 weaponizes that:

1.  A **linear map**  $T:V\to W$  is the geometric object.
2.  A **matrix**  $A$  is just the coordinate representation of  $T$  after choosing bases.
3.  Solving  $Ax=b$  is not “symbol pushing”; it’s answering:
    *   **Existence:** is  $b$  inside the **image/column space**?
*   **Non-uniqueness:** what does the **kernel/null space** look like?
*   **Degrees of freedom:** rank–nullity is the conservation law.

* * *

1) Linear maps: definition, equivalent axioms, and immediate consequences
=========================================================================

1.1 Definition (linear map)
---------------------------

Let  $V,W$  be vector spaces over  $\mathbb R$  (for us: subspaces of  $\mathbb R^n,\mathbb R^m$ ).  
A function  $T:V\to W$  is **linear** if for all  $x,z\in V$  and all scalars  $\alpha,\beta\in\mathbb R$ ,

$$
\boxed{T(\alpha x+\beta z)=\alpha T(x)+\beta T(z).}
$$

### What this _really_ encodes

This one line says: ** $T$  respects the two vector space operations** (addition and scaling).  
Everything else you’ve ever heard about “linearity” is a consequence.

* * *

1.2 Equivalent “two-axiom” form (and why it’s equivalent)
---------------------------------------------------------

### Claim

The one-line condition is equivalent to both:

1.  **Additivity:**  $T(x+z)=T(x)+T(z)$  for all  $x,z\in V$ .
2.  **Homogeneity:**  $T(\alpha x)=\alpha T(x)$  for all  $x\in V$ ,  $\alpha\in\mathbb R$ .

### Proof (both directions, explicit)

**(one-line ⇒ two axioms)**

*   Set  $\alpha=\beta=1$ :
    $$
    T(x+z)=T(1\cdot x+1\cdot z)=1\cdot T(x)+1\cdot T(z)=T(x)+T(z).
    $$
*   Set  $\beta=0$ :
    $$
    T(\alpha x)=T(\alpha x+0\cdot z)=\alpha T(x)+0\cdot T(z)=\alpha T(x).
    $$

**(two axioms ⇒ one-line)**  
Assume additivity + homogeneity. Then

$$
T(\alpha x+\beta z)=T(\alpha x)+T(\beta z)=\alpha T(x)+\beta T(z).
$$

∎

* * *

1.3 Immediate consequences (proved, not vibes)
----------------------------------------------

### Lemma 1:  $T(0)=0$ 

Pick any  $x\in V$ . Since  $0=0\cdot x$ ,

$$
T(0)=T(0\cdot x)=0\cdot T(x)=0.
$$

∎

### Lemma 2:  $T(-x)=-T(x)$ 

Use  $0=x+(-x)$ :

$$
0=T(0)=T(x+(-x))=T(x)+T(-x)\Rightarrow T(-x)=-T(x).
$$

∎

### Lemma 3:  $T\Big(\sum_{i=1}^k \theta_i v_i\Big)=\sum_{i=1}^k \theta_i T(v_i)$ 

**Proof idea:** repeatedly apply the linearity rule (or induction).  
This is why linear maps “distribute over linear combinations.”

* * *

2) Matrices implement linear maps (and why “matrix” depends on bases)
=====================================================================

2.1 From a matrix to a linear map
---------------------------------

Given  $A\in\mathbb R^{m\times n}$ , define  $T_A:\mathbb R^n\to\mathbb R^m$  by

$$
T_A(x)=Ax.
$$

### Claim:  $T_A$  is linear

**Proof (componentwise, no magic).**  
Fix  $x,z\in\mathbb R^n$ ,  $\alpha,\beta\in\mathbb R$ . Look at the  $i$ \-th component:

$$
(A(\alpha x+\beta z))_i=\sum_{j=1}^n a_{ij}(\alpha x_j+\beta z_j) = \alpha\sum_{j=1}^n a_{ij}x_j+\beta\sum_{j=1}^n a_{ij}z_j =(\alpha Ax+\beta Az)_i.
$$

Since every component matches,  $A(\alpha x+\beta z)=\alpha Ax+\beta Az$ . ∎

So “a matrix” really is “a linear map written in standard coordinates.”

* * *

2.2 From a linear map to a matrix (basis-dependent)
---------------------------------------------------

Let  $T:\mathbb R^n\to\mathbb R^m$  be linear. Choose bases:

*    $B=(b_1,\dots,b_n)$  for  $\mathbb R^n$ ,
*    $C=(c_1,\dots,c_m)$  for  $\mathbb R^m$ .

The **matrix of  $T$  in these bases** is the unique matrix  $[T]_{C\leftarrow B}$  satisfying:

$$
[T(x)]_C = [T]_{C\leftarrow B}\,[x]_B\quad\forall x.
$$

And (from Module 2) if  $B,C$  are the basis matrices, then

$$
\boxed{[T]_{C\leftarrow B}=C^{-1}\,[T]_{\text{std}}\;B}
$$

where  $[T]_{\text{std}}$  is the standard-coordinate matrix  $A$  such that  $T(x)=Ax$ .

**Moral:** the linear map is the invariant object; matrices are coordinate snapshots.

* * *

3) Kernel and image (null space and column space)
=================================================

Let  $T:V\to W$  be linear.

3.1 Definitions (exact set-theoretic meaning)
---------------------------------------------

*   **Kernel / null space**
    $$
    \ker(T)=\{x\in V:\;T(x)=0\}.
    $$
*   **Image / range**
    $$
    \operatorname{im}(T)=T(V)=\{T(x):x\in V\}\subseteq W.
    $$

For a matrix  $A\in\mathbb R^{m\times n}$  (with  $T_A(x)=Ax$ ):

*    $\ker(A)=\{x\in\mathbb R^n:Ax=0\}\subseteq\mathbb R^n$  (**null space**)
*    $\operatorname{im}(A)=\{Ax:x\in\mathbb R^n\}\subseteq\mathbb R^m$ 

and crucially,

$$
\boxed{\operatorname{im}(A)=\mathcal C(A)}
$$

the **column space**: all linear combinations of the columns of  $A$ .  
(Reason:  $Ax=\sum_{j=1}^n x_jA_{:j}$ .)

* * *

3.2 Kernel and image are subspaces (full proof, no skips)
---------------------------------------------------------

### Theorem 1:  $\ker(T)$  is a subspace of  $V$ 

1.   $0\in\ker(T)$  because  $T(0)=0$ .
2.  If  $x,z\in\ker(T)$ , then  $T(x)=T(z)=0$ , so
    $$
    T(x+z)=T(x)+T(z)=0.
    $$
    Hence  $x+z\in\ker(T)$ .
3.  If  $x\in\ker(T)$  and  $\alpha\in\mathbb R$ ,
    $$
    T(\alpha x)=\alpha T(x)=0,
    $$
    so  $\alpha x\in\ker(T)$ .

Thus it’s a subspace. ∎

### Theorem 2:  $\operatorname{im}(T)$  is a subspace of  $W$ 

1.   $0\in\operatorname{im}(T)$  since  $0=T(0)$ .
2.  Let  $y_1,y_2\in\operatorname{im}(T)$ . Then  $\exists x_1,x_2\in V$  with  $y_1=T(x_1)$ ,  $y_2=T(x_2)$ . For any  $\alpha,\beta$ ,
    $$
    \alpha y_1+\beta y_2=\alpha T(x_1)+\beta T(x_2)=T(\alpha x_1+\beta x_2)\in\operatorname{im}(T).
    $$

So it’s a subspace. ∎

**Geometric interpretation you should _feel_**:

*    $\ker(T)$ : directions in input that get flattened to zero.
*    $\operatorname{im}(T)$ : all outputs the map is capable of producing.

* * *

4) Rank and nullity (definitions + constraints)
===============================================

Let  $A\in\mathbb R^{m\times n}$ .

*   **Nullity**
    $$
    \operatorname{nullity}(A)=\dim(\ker(A)).
    $$
*   **Rank**
    $$
    \operatorname{rank}(A)=\dim(\operatorname{im}(A))=\dim(\mathcal C(A)).
    $$

Basic bounds (important sanity):

$$
0\le \operatorname{rank}(A)\le \min\{m,n\},\qquad 0\le \operatorname{nullity}(A)\le n.
$$

* * *

5) Rank–Nullity theorem (full proof, made painfully explicit)
=============================================================

Theorem (Rank–Nullity)
----------------------

For  $A\in\mathbb R^{m\times n}$ ,

$$
\boxed{\dim(\ker(A))+\dim(\operatorname{im}(A))=n}
$$

i.e.

$$
\boxed{\operatorname{nullity}(A)+\operatorname{rank}(A)=n.}
$$

### Proof (kernel basis extension → image basis)

Let  $K=\ker(A)\subseteq\mathbb R^n$ . Let  $\{k_1,\dots,k_p\}$  be a basis of  $K$ . Then

$$
p=\dim(K)=\operatorname{nullity}(A).
$$

#### Step 1: Extend kernel basis to a basis of  $\mathbb R^n$ 

By the basis extension theorem (from Steinitz in Module 2), we can add vectors  $u_1,\dots,u_q$  so that

$$
\mathcal B:=\{k_1,\dots,k_p,u_1,\dots,u_q\}
$$

is a basis of  $\mathbb R^n$ .

Since every basis of  $\mathbb R^n$  has size  $n$ ,

$$
p+q=n. \tag{1}
$$

#### Step 2: Show  $\{Au_1,\dots,Au_q\}$  spans  $\operatorname{im}(A)$ 

Take any  $y\in\operatorname{im}(A)$ . By definition,  $y=Ax$  for some  $x\in\mathbb R^n$ .

Expand  $x$  in the basis  $\mathcal B$ :

$$
x=\sum_{i=1}^p \alpha_i k_i+\sum_{j=1}^q \beta_j u_j.
$$

Apply  $A$ :

$$
Ax=\sum_{i=1}^p \alpha_i Ak_i+\sum_{j=1}^q \beta_j Au_j.
$$

But  $k_i\in\ker(A)\Rightarrow Ak_i=0$ . So

$$
y=Ax=\sum_{j=1}^q \beta_j Au_j.
$$

Thus every  $y\in\operatorname{im}(A)$  is in the span of  $\{Au_1,\dots,Au_q\}$ . Hence they span  $\operatorname{im}(A)$ . ∎

#### Step 3: Show  $\{Au_1,\dots,Au_q\}$  is linearly independent

Assume a linear relation:

$$
\sum_{j=1}^q \gamma_j Au_j=0.
$$

Factor  $A$ :

$$
A\left(\sum_{j=1}^q \gamma_j u_j\right)=0.
$$

So

$$
w:=\sum_{j=1}^q \gamma_j u_j \in \ker(A)=K.
$$

Meaning:  $w$  can be written as a linear combination of the  $k_i$ ’s:

$$
w=\sum_{i=1}^p \delta_i k_i.
$$

So we have

$$
\sum_{j=1}^q \gamma_j u_j - \sum_{i=1}^p \delta_i k_i = 0.
$$

This is a linear relation among the vectors in the basis  $\mathcal B$ . Since  $\mathcal B$  is linearly independent, **every coefficient must be zero**:

$$
\gamma_1=\cdots=\gamma_q=0 \quad\text{and}\quad \delta_1=\cdots=\delta_p=0.
$$

Therefore the  $Au_j$ ’s are independent. ∎

#### Step 4: conclude dimensions

Steps 2 and 3 show  $\{Au_1,\dots,Au_q\}$  is a basis of  $\operatorname{im}(A)$ . Hence

$$
\operatorname{rank}(A)=\dim(\operatorname{im}(A))=q. \tag{2}
$$

Combine (1) and (2):

$$
\operatorname{nullity}(A)+\operatorname{rank}(A)=p+q=n.
$$

∎

**What you should “feel” from rank–nullity:**  
Input space  $\mathbb R^n$  splits into:

*   a  $p$ \-dimensional part killed by  $A$  (kernel),
*   a complementary  $q$ \-dimensional part whose images form a basis of the output directions (image).

It’s conservation of degrees of freedom.

* * *

6) Solving  $Ax=b$ : existence, uniqueness, and the full solution set
=====================================================================

Let  $A\in\mathbb R^{m\times n}$ ,  $b\in\mathbb R^m$ .

6.1 Existence ⇔ membership in the image (column space)
------------------------------------------------------

### Theorem

$$
Ax=b \text{ is solvable } \iff b\in\operatorname{im}(A)=\mathcal C(A).
$$

**Proof.**

*   If  $Ax=b$  for some  $x$ , then by definition  $b$  is an output of  $A$ , so  $b\in\operatorname{im}(A)$ .
*   If  $b\in\operatorname{im}(A)$ , then  $b=Ax$  for some  $x$ , so it’s solvable.

That’s literally the definition of image. ∎

6.2 If solvable, all solutions are “particular + kernel”
--------------------------------------------------------

### Theorem (solution set structure)

Assume  $Ax=b$  is consistent and let  $x_p$  satisfy  $Ax_p=b$ . Then

$$
\boxed{\{x:Ax=b\}=x_p+\ker(A)=\{x_p+z:z\in\ker(A)\}.}
$$

**Proof (two containments).**

(**⊆**) If  $x$  is any solution, then

$$
A(x-x_p)=Ax-Ax_p=b-b=0 \Rightarrow x-x_p\in\ker(A) \Rightarrow x=x_p+z.
$$

(**⊇**) If  $z\in\ker(A)$ , then

$$
A(x_p+z)=Ax_p+Az=b+0=b,
$$

so  $x_p+z$  is a solution.

So the sets are equal. ∎

### What kind of set is this?

It is an **affine subspace**: a translation of a linear subspace.  
This matters later because feasible sets in optimization are often affine sets.

6.3 Uniqueness ⇔ kernel is trivial (given consistency)
------------------------------------------------------

### Theorem

If  $Ax=b$  is consistent, the solution is unique iff  $\ker(A)=\{0\}$ .

**Proof.**

*   If  $\ker(A)=\{0\}$ , then  $x_p+\ker(A)=\{x_p\}$ : exactly one solution.
*   If  $\ker(A)\neq\{0\}$ , pick  $z\neq 0\in\ker(A)$ . Then  $x_p$  and  $x_p+z$  are distinct solutions. Not unique. ∎

6.4 Dimension of the solution set (degrees of freedom)
------------------------------------------------------

If consistent,

$$
\dim(\{x:Ax=b\})=\dim(\ker(A))=\operatorname{nullity}(A)=n-\operatorname{rank}(A).
$$

Why translation doesn’t change dimension: the map  $z\mapsto x_p+z$  is a bijection between  $\ker(A)$  and the solution set, preserving linear degrees of freedom.

* * *

7) The “four cases” anatomy of  $Ax=b$  (what happens in practice)
==================================================================

Think in terms of two questions:

1.  **Is it consistent?** (does  $b$  lie in  $\mathcal C(A)$ ?)
2.  **If consistent, is it unique?** (is  $\ker(A)=\{0\}$ ?)

That yields:

### Case A: No solution (inconsistent)

$$
b\notin \mathcal C(A).
$$

Geometrically: the affine set  $b$  misses the reachable outputs.

### Case B: Unique solution

Consistent and  $\ker(A)=\{0\}$  ⇔  $\operatorname{rank}(A)=n$  (full column rank).  
Note: this is only possible if  $n\le m$ .

### Case C: Infinitely many solutions

Consistent and  $\ker(A)\neq\{0\}$  ⇔  $\operatorname{rank}(A)<n$ .  
Then solution set has dimension  $n-\operatorname{rank}(A)\ge 1$ .

### Case D: “Over/under-determined” is not the real classifier

*   Overdetermined  $m>n$  can still be consistent or inconsistent.
*   Underdetermined  $m<n$  can never have full column rank  $n$ ? Actually it can’t: rank  $\le m < n$ , so if consistent it will have infinitely many solutions.

So “over/under determined” is about shape; **rank + membership** determine reality.

* * *

8) Injective vs surjective vs bijective (rank language done carefully)
======================================================================

Consider the linear map  $A:\mathbb R^n\to\mathbb R^m$ .

8.1 Injective (one-to-one)
--------------------------

 $A$  injective ⇔  $\ker(A)=\{0\}$  ⇔  $\operatorname{rank}(A)=n$  (full column rank).

**Important constraint:** injective is possible only if  $n\le m$ .

Proof sketch:

$$
Ax=Az \iff A(x-z)=0 \iff x-z\in\ker(A).
$$

So if kernel is trivial, equality of outputs forces equality of inputs. ∎

8.2 Surjective (onto)
---------------------

 $A$  surjective ⇔  $\operatorname{im}(A)=\mathbb R^m$  ⇔  $\operatorname{rank}(A)=m$  (full row rank).

Constraint: surjective possible only if  $m\le n$ .

8.3 Bijective (invertible)
--------------------------

Bijective is possible only when  $m=n$ . Then:

$$
A \text{ invertible} \iff \ker(A)=\{0\} \iff \operatorname{rank}(A)=n.
$$

* * *

9) Computation: rank, kernel, image, and solvability via elimination
====================================================================

This is the practical “do” part, but we’ll state the theorems that justify the procedures.

9.1 Row reduction and rank (pivot theorem)
------------------------------------------

Compute an echelon form (REF) or reduced row echelon form (RREF).

*   The number of pivot columns =  $\operatorname{rank}(A)$ .
*   The pivot columns of the **original** matrix  $A$  form a basis of  $\mathcal C(A)$ .

Why “original”? Row operations change column space; pivot positions tell you which original columns were independent.

9.2 Kernel computation (null space)
-----------------------------------

Solve  $Ax=0$  from RREF:

*   variables corresponding to pivot columns = **pivot variables**
*   remaining variables = **free variables**
*   express pivot variables in terms of free variables
*   set free variables to parameters  $t_1,\dots,t_{n-r}$ 
*   write solution  $x=\sum_{j=1}^{n-r} t_j v_j$ ; the vectors  $v_j$  form a basis of  $\ker(A)$ 

And automatically:

$$
\#\text{free variables}=n-\operatorname{rank}(A)=\operatorname{nullity}(A).
$$

9.3 Consistency test for  $Ax=b$  (augmented matrix)
----------------------------------------------------

Row-reduce  $[A\mid b]$ .

*   If a row becomes  $[0\ \cdots\ 0\mid c]$  with  $c\neq 0$ : inconsistent (no solution).
*   Otherwise: consistent.

### Rank test (Rouché–Capelli / “rank of augmented”)

$$
Ax=b \text{ is consistent } \iff \operatorname{rank}(A)=\operatorname{rank}([A\mid b]).
$$

This is the rank version of the “no contradiction row” criterion.

9.4 If consistent: build all solutions explicitly
-------------------------------------------------

*   Find one particular solution  $x_p$  (set free variables to 0 is the usual cheap choice).
*   Add null space:
    $$
    x=x_p+z,\quad z\in\ker(A).
    $$

* * *

10) End-of-Module 3 sanity checklist (prove these, don’t just recite)
=====================================================================

You’re actually ready to proceed only if you can prove:

1.   $\ker(T)$  and  $\operatorname{im}(T)$  are subspaces for any linear  $T$ .
2.  Rank–nullity via: extend kernel basis → map extension → show it becomes basis of image.
3.   $Ax=b$  solvable ⇔  $b\in\mathcal C(A)$ .
4.  If solvable: solution set  $=x_p+\ker(A)$  and  $\dim = n-\operatorname{rank}(A)$ .
5.  Injective ⇔ full column rank; surjective ⇔ full row rank; invertible ⇔ square + rank  $n$ .
6.  Computation: pivots ↔ rank, free variables ↔ nullity, contradiction row ↔ inconsistency.

* * *

Where this is going next (Module 4 preview)
===========================================

Module 4 is where everything snaps into a single geometric diagram:

*   the four fundamental subspaces  
     $\mathcal C(A)$ ,  $\mathcal N(A)$ ,  $\mathcal C(A^\top)$ ,  $\mathcal N(A^\top)$ 
*   and the orthogonality identities
    $$
    \mathcal C(A)=\mathcal N(A^\top)^\perp,\qquad \mathcal C(A^\top)=\mathcal N(A)^\perp.
    $$

That’s the bridge to least squares, projections, and (eventually) KKT stationarity  $A^\top(Ax-b)=0$  not feeling like a spell.

If you want, I can also add a short “worked micro-example” (one consistent underdetermined, one inconsistent overdetermined) to make the affine-solution-set picture physically obvious.

## Prompt:
Now this:

# Module 4 — The four fundamental subspaces and the orthogonality laws

*(column/row/null/left-null, and why they fit together like Lego)*

## 0) What this module is secretly doing

You already know:

* (\mathcal C(A)=\mathrm{im}(A)\subseteq\mathbb R^m) is what (Ax) can produce.
* (\mathcal N(A)=\ker(A)\subseteq\mathbb R^n) is what (A) kills.

Module 4 adds two “mirror” spaces:

* (\mathcal C(A^\top)\subseteq\mathbb R^n) (row space)
* (\mathcal N(A^\top)\subseteq\mathbb R^m) (left null space)

And then proves the two most important identities in basic linear algebra:

[
\boxed{\ \mathcal C(A)=\mathcal N(A^\top)^\perp,\qquad \mathcal C(A^\top)=\mathcal N(A)^\perp\ }
]

These are not slogans. They are the exact algebraic form of:

> “the outputs of (A) are exactly the vectors orthogonal to every constraint that annihilates them.”

This is the algebraic root of:

* least squares (normal equations),
* projections,
* dual certificates,
* KKT geometry later.

---

# 1) Definitions, with shapes (no confusion allowed)

Let (A\in\mathbb R^{m\times n}).

## 1.1 Column space (in (\mathbb R^m))

[
\boxed{\ \mathcal C(A):={Ax:x\in\mathbb R^n}\subseteq\mathbb R^m\ }
]
Equivalently, (\mathcal C(A)=\mathrm{span}{A_{:1},\dots,A_{:n}}) (span of columns).

## 1.2 Row space (in (\mathbb R^n))

Rows of (A) live in (\mathbb R^n). Their span is the **row space**:
[
\boxed{\ \mathcal R(A):=\mathrm{span}{A_{1:},\dots,A_{m:}}\subseteq\mathbb R^n\ }
]
A cleaner algebraic identity is:
[
\boxed{\ \mathcal R(A)=\mathcal C(A^\top)\ }
]
because columns of (A^\top) are rows of (A).

So row space is column space of (A^\top).

## 1.3 Null space (in (\mathbb R^n))

[
\boxed{\ \mathcal N(A):={x\in\mathbb R^n:Ax=0}\subseteq\mathbb R^n\ }
]

## 1.4 Left null space (in (\mathbb R^m))

[
\boxed{\ \mathcal N(A^\top):={y\in\mathbb R^m:A^\top y=0}\subseteq\mathbb R^m\ }
]
This is “null space of (A^\top)” but it lives in the *output space* (\mathbb R^m).

---

# 2) Orthogonal complement: definition and basic facts

## 2.1 Definition

For a subspace (S\subseteq\mathbb R^d),
[
\boxed{\ S^\perp := {u\in\mathbb R^d : u^\top s = 0\ \forall s\in S}. }
]
**Meaning:** all vectors perpendicular to every vector in (S).

### Fact: (S^\perp) is a subspace

Proof is routine: (0) is orthogonal to all, and orthogonality is preserved under addition/scaling.

### Fact: (S\cap S^\perp={0})

If (u\in S\cap S^\perp), then (u^\top u=0), so (|u|_2^2=0), hence (u=0).

### Fact (finite-dimensional): ((S^\perp)^\perp=S)

This is true in (\mathbb R^d) for subspaces. (You can prove it using dimension counting or orthonormal bases. We’ll effectively use this later.)

---

# 3) The key algebra identity: (\mathcal C(A)=\mathcal N(A^\top)^\perp)

This is the “big one.” We prove it with two containments.

## Theorem 1

[
\boxed{\ \mathcal C(A)=\mathcal N(A^\top)^\perp\subseteq\mathbb R^m. }
]

### Proof (direction 1): (\mathcal C(A)\subseteq \mathcal N(A^\top)^\perp)

Take any (b\in\mathcal C(A)). Then (b=Ax) for some (x\in\mathbb R^n).

Take any (y\in\mathcal N(A^\top)). Then (A^\top y=0).

We must show (y^\top b=0). Compute:
[
y^\top b = y^\top (Ax) = (y^\top A)x.
]
Now use ((y^\top A)x = (A^\top y)^\top x) (this is just associativity + transpose rules):
[
y^\top Ax = (A^\top y)^\top x = 0^\top x = 0.
]
So (y) is orthogonal to every (b\in\mathcal C(A)), i.e. (b\in \mathcal N(A^\top)^\perp). Hence
[
\mathcal C(A)\subseteq \mathcal N(A^\top)^\perp.
]
∎

### Proof (direction 2): (\mathcal N(A^\top)^\perp\subseteq \mathcal C(A))

This is the subtler direction. We’ll use a dimension argument (completely rigorous in finite dimensions).

**Step 1: compute dimensions.**
We know from Module 3 (rank–nullity) applied to (A^\top:\mathbb R^m\to\mathbb R^n):
[
\dim(\mathcal N(A^\top)) + \mathrm{rank}(A^\top) = m.
]
But (\mathrm{rank}(A^\top)=\mathrm{rank}(A)) (we will prove this in a moment; or accept temporarily—either way, it’s standard and we’ll justify it below). Also (\dim(\mathcal C(A))=\mathrm{rank}(A)).

So:
[
\dim(\mathcal N(A^\top)) = m-\mathrm{rank}(A).
]

Now a crucial finite-dimensional fact:

> For any subspace (S\subseteq\mathbb R^m),
> [
> \dim(S)+\dim(S^\perp)=m.
> ]

We’ll prove that fact immediately after this theorem. Using it with (S=\mathcal N(A^\top)),
[
\dim(\mathcal N(A^\top)^\perp)=m-\dim(\mathcal N(A^\top))=m-(m-\mathrm{rank}(A))=\mathrm{rank}(A).
]

So both spaces (\mathcal C(A)) and (\mathcal N(A^\top)^\perp) are subspaces of (\mathbb R^m) with:

* (\mathcal C(A)\subseteq \mathcal N(A^\top)^\perp) (from direction 1),
* (\dim(\mathcal C(A))=\mathrm{rank}(A)=\dim(\mathcal N(A^\top)^\perp)).

**Step 2: use the basic subspace dimension principle.**
If (U\subseteq V) are subspaces and (\dim(U)=\dim(V)), then (U=V).

Proof: if (U\subsetneq V), you can extend a basis of (U) to a strictly larger basis of (V), which would force (\dim(V)>\dim(U)). Contradiction.

Hence:
[
\mathcal C(A)=\mathcal N(A^\top)^\perp.
]
∎

---

## Interlude A: prove (\dim(S)+\dim(S^\perp)=m)

### Lemma

For a subspace (S\subseteq\mathbb R^m),
[
\boxed{\ \dim(S)+\dim(S^\perp)=m. }
]

### Proof (orthonormal basis method)

Take a basis of (S), apply Gram–Schmidt to obtain an **orthonormal basis** ((q_1,\dots,q_k)) of (S). (Gram–Schmidt preserves the span and produces orthonormal vectors.)

Extend ((q_1,\dots,q_k)) to an orthonormal basis of all (\mathbb R^m):
[
(q_1,\dots,q_k,q_{k+1},\dots,q_m).
]
Now claim:
[
S^\perp = \mathrm{span}{q_{k+1},\dots,q_m}.
]

* Any vector in (\mathrm{span}{q_{k+1},\dots,q_m}) is orthogonal to each (q_1,\dots,q_k), hence orthogonal to all of (S), so it lies in (S^\perp).
* Conversely, if (u\in S^\perp), expand (u) in the full orthonormal basis:
  [
  u=\sum_{i=1}^m \alpha_i q_i.
  ]
  Since (u\perp q_j) for (j\le k),
  [
  0 = q_j^\top u = q_j^\top \sum_{i=1}^m \alpha_i q_i = \sum_{i=1}^m \alpha_i (q_j^\top q_i) = \alpha_j
  ]
  because (q_j^\top q_i=\delta_{ji}).
  Thus (\alpha_1=\cdots=\alpha_k=0), so
  [
  u=\sum_{i=k+1}^m \alpha_i q_i \in \mathrm{span}{q_{k+1},\dots,q_m}.
  ]
  So equality holds. Therefore
  [
  \dim(S)=k,\quad \dim(S^\perp)=m-k \quad\Rightarrow\quad \dim(S)+\dim(S^\perp)=m.
  ]
  ∎

---

## Interlude B: prove (\mathrm{rank}(A)=\mathrm{rank}(A^\top))

### Lemma

[
\boxed{\ \mathrm{rank}(A)=\mathrm{rank}(A^\top). }
]

### Proof (via null space orthogonality identities we’re building)

From Theorem 1 we already proved:
[
\mathcal C(A)=\mathcal N(A^\top)^\perp.
]
Taking dimensions and using (\dim(S^\perp)=m-\dim(S)),
[
\dim(\mathcal C(A)) = \dim(\mathcal N(A^\top)^\perp)= m-\dim(\mathcal N(A^\top)).
]
But rank–nullity for (A^\top) gives:
[
\dim(\mathcal N(A^\top)) = m-\mathrm{rank}(A^\top).
]
So:
[
\mathrm{rank}(A)=\dim(\mathcal C(A))=m-(m-\mathrm{rank}(A^\top))=\mathrm{rank}(A^\top).
]
∎

(Yes, it looks slightly circular if we used rank equality earlier; if you want a non-circular proof, we can prove rank equality directly from row reduction and pivot counts. But the above is clean once Theorem 1 is established.)

---

# 4) The second orthogonality law: (\mathcal C(A^\top)=\mathcal N(A)^\perp)

This is the same theorem with (A) replaced by (A^\top).

## Theorem 2

[
\boxed{\ \mathcal C(A^\top)=\mathcal N(A)^\perp\subseteq\mathbb R^n. }
]

### Proof

Apply Theorem 1 to the matrix (A^\top):
[
\mathcal C(A^\top)=\mathcal N((A^\top)^\top)^\perp=\mathcal N(A)^\perp.
]
∎

**Translation into words:**

* Row space of (A) (which is (\mathcal C(A^\top))) is orthogonal complement of null space of (A).

---

# 5) The full “four-subspace picture” (shapes + orthogonality)

You now have four subspaces:

In (\mathbb R^n) (input space):

* (\mathcal C(A^\top)) (row space)
* (\mathcal N(A)) (null space)

And they are orthogonal complements:
[
\boxed{\ \mathbb R^n = \mathcal C(A^\top)\ \oplus\ \mathcal N(A)\ }
]
(direct orthogonal sum).

In (\mathbb R^m) (output space):

* (\mathcal C(A)) (column space)
* (\mathcal N(A^\top)) (left null space)

And:
[
\boxed{\ \mathbb R^m = \mathcal C(A)\ \oplus\ \mathcal N(A^\top)\ }
]

“(\oplus)” here means:

* every vector decomposes uniquely into a sum of one vector from each subspace,
* and the two parts are orthogonal.

This decomposition is the backbone of least squares and projections.

---

# 6) Why this instantly explains solvability and certificates

## 6.1 Solvability of (Ax=b)

We already proved:
[
Ax=b\ \text{solvable} \iff b\in\mathcal C(A).
]
Now use (\mathcal C(A)=\mathcal N(A^\top)^\perp):
[
b\in\mathcal C(A)
\iff b\perp \mathcal N(A^\top).
]
Equivalently:
[
\boxed{\ Ax=b \text{ is solvable } \iff y^\top b = 0\ \forall y\in\mathcal N(A^\top). }
]

That is a *certificate form*:

* if there exists (y\in\mathcal N(A^\top)) with (y^\top b\ne 0), then (b\notin\mathcal C(A)), so the system is inconsistent.

This is one of the ancestors of **Farkas’ lemma** later.

---

# 7) How to compute bases for the four subspaces (practical, exact)

Given (A):

1. Row-reduce (A) to RREF.
2. Pivot columns of (A) → basis for (\mathcal C(A)).
3. Nonzero rows of RREF → basis for row space (\mathcal C(A^\top)).
4. Solve (Ax=0) → basis for (\mathcal N(A)).
5. Solve (A^\top y=0) → basis for (\mathcal N(A^\top)).

Rank is the number of pivots; nullities follow from rank–nullity.

---

# 8) End-of-Module 4 sanity checklist (no mercy)

You can proceed only if you can do these without handwaving:

1. Prove (\mathcal C(A)\subseteq \mathcal N(A^\top)^\perp) by (y^\top(Ax)=(A^\top y)^\top x).
2. Prove (\dim(S)+\dim(S^\perp)=m) via orthonormal bases (Gram–Schmidt + extension).
3. Use dimension + containment to conclude equality of subspaces.
4. State clearly which subspaces live in (\mathbb R^n) vs (\mathbb R^m).
5. Use (\mathcal C(A)=\mathcal N(A^\top)^\perp) to express solvability of (Ax=b) as orthogonality conditions (certificate idea).

---

## Next module

**Module 5 — Orthogonality, projections, Gram matrices, least squares.**
This is where everything you just proved pays off: least squares becomes “project (b) onto (\mathcal C(A))” and normal equations become “residual orthogonal to (\mathcal C(A))” which becomes (A^\top(Ax-b)=0).

If you say “next,” we’ll do Module 5 with full projection theorem proof + normal equations + PSD Gram matrices (X^\top X\succeq 0) proved from first principles.

## Response:
Thought for 31s

Let’s rebuild **Module 4** from bedrock, but with _zero_ “trust me” steps: every identity, every dimension argument, every “why row space = column space of  $A^\top$ ” and every “rank( $A$ ) = rank( $A^\top$ )” gets proved cleanly.

I’ll also keep shouting the **shapes** ( $\mathbb R^n$  vs  $\mathbb R^m$ ) so your brain never mixes them again.

* * *

Module 4 — The four fundamental subspaces and the orthogonality laws
====================================================================

0) What this module is actually about
-------------------------------------

You already have two spaces from Module 3:

*    $\mathcal C(A)=\operatorname{im}(A)\subseteq \mathbb R^m$ : what outputs  $Ax$  can produce.
*    $\mathcal N(A)=\ker(A)\subseteq \mathbb R^n$ : what inputs  $A$  kills.

Module 4 adds the “mirror pair”:

*    $\mathcal C(A^\top)\subseteq \mathbb R^n$ : the row space (living in the **input** space).
*    $\mathcal N(A^\top)\subseteq \mathbb R^m$ : the left null space (living in the **output** space).

And it proves the two orthogonality laws (the “Lego snap”):

 $$
\boxed{\ \mathcal C(A)=\mathcal N(A^\top)^\perp\subseteq\mathbb R^m,\qquad \mathcal C(A^\top)=\mathcal N(A)^\perp\subseteq\mathbb R^n\ }.
$$

These are not slogans. They are _precise equivalences of sets_.

* * *

1) Definitions with shapes (no confusion allowed)
=================================================

Fix  $A\in\mathbb R^{m\times n}$ . Think of  $A:\mathbb R^n\to\mathbb R^m$ .

1.1 Column space  $\mathcal C(A)\subseteq\mathbb R^m$ 
------------------------------------------------------

 $$
\boxed{\ \mathcal C(A):=\{Ax:x\in\mathbb R^n\}\subseteq\mathbb R^m\ }.
$$

**Equivalent “columns” form.**  
Let  $A_{:j}\in\mathbb R^m$  be the  $j$ \-th column. Since

$$
Ax=\sum_{j=1}^n x_j A_{:j},
$$

we have

 $$
\boxed{\ \mathcal C(A)=\operatorname{span}\{A_{:1},\dots,A_{:n}\}\ }.
$$

So: **column space = all linear combinations of columns**.

* * *

1.2 Row space  $\mathcal R(A)\subseteq\mathbb R^n$ 
---------------------------------------------------

Each row  $A_{i:}$  is a vector in  $\mathbb R^n$ . Define

 $$
\boxed{\ \mathcal R(A):=\operatorname{span}\{A_{1:},\dots,A_{m:}\}\subseteq\mathbb R^n\ }.
$$

Now observe: columns of  $A^\top$  are rows of  $A$ . So

 $$
\boxed{\ \mathcal R(A)=\mathcal C(A^\top)\ }.
$$

This is not deep: it’s literally “transpose swaps rows and columns.”

* * *

1.3 Null space  $\mathcal N(A)\subseteq\mathbb R^n$ 
----------------------------------------------------

 $$
\boxed{\ \mathcal N(A):=\{x\in\mathbb R^n:Ax=0\}\subseteq\mathbb R^n\ }.
$$

* * *

1.4 Left null space  $\mathcal N(A^\top)\subseteq\mathbb R^m$ 
--------------------------------------------------------------

 $$
\boxed{\ \mathcal N(A^\top):=\{y\in\mathbb R^m:A^\top y=0\}\subseteq\mathbb R^m\ }.
$$

It’s “null space of  $A^\top$ ” but it lives in the **output** space  $\mathbb R^m$ .  
This is why it’s called _left_ null space:  $y^\top A=0^\top$  is the row-vector way to write  $A^\top y=0$ .

* * *

2) Orthogonal complements (definition + properties you must own)
================================================================

Everything in this module uses the **standard inner product**:

$$
\langle u,v\rangle = u^\top v.
$$

2.1 Definition
--------------

Let  $S\subseteq\mathbb R^d$  be a subspace. Define

 $$
\boxed{\ S^\perp := \{u\in\mathbb R^d:\ u^\top s=0\ \text{for all } s\in S\}\ }.
$$

Interpretation: vectors orthogonal to _every_ vector in  $S$ .

* * *

2.2  $S^\perp$  is a subspace (fully explicit)
----------------------------------------------

Take  $u,v\in S^\perp$ , scalar  $\alpha$ .

*    $0\in S^\perp$  because  $0^\top s=0$  for all  $s$ .
*    $(u+v)^\top s=u^\top s+v^\top s=0+0=0$ , so  $u+v\in S^\perp$ .
*    $(\alpha u)^\top s=\alpha(u^\top s)=\alpha\cdot 0=0$ , so  $\alpha u\in S^\perp$ .

So  $S^\perp$  is a subspace. ∎

* * *

2.3  $S\cap S^\perp=\{0\}$ 
---------------------------

If  $u\in S\cap S^\perp$ , then  $u\in S^\perp$  implies  $u^\top u=0$ . But  $u^\top u=\|u\|_2^2$ , and  $\|u\|_2^2=0\Rightarrow u=0$ . ∎

* * *

2.4 The key dimension fact:  $\dim(S)+\dim(S^\perp)=d$ 
-------------------------------------------------------

This is **the** engine behind the “reverse containment” parts later.

### Lemma

If  $S\subseteq\mathbb R^d$  is a subspace, then

 $$
\boxed{\ \dim(S)+\dim(S^\perp)=d\ }.
$$

### Proof (orthonormal-basis method, but with all logic shown)

**Step 0: Why orthonormal bases exist.**  
Take any basis  $v_1,\dots,v_k$  of  $S$ . Gram–Schmidt produces vectors  $q_1,\dots,q_k$  such that:

1.  each  $q_i$  is a linear combination of  $v_1,\dots,v_i$ ,
2.   $q_i\perp q_j$  for  $i\neq j$ ,
3.   $\operatorname{span}\{q_1,\dots,q_k\}=\operatorname{span}\{v_1,\dots,v_k\}=S$ .

(You don’t need mystical faith: each step subtracts projections so the new vector is orthogonal to the previous ones; if it becomes zero, that means dependence, which cannot happen because  $v_i$ ’s are a basis.)

Then normalize:  $q_i\leftarrow q_i/\|q_i\|_2$  to get  $\|q_i\|_2=1$ . So we get an **orthonormal basis** of  $S$ .

Let  $\dim(S)=k$  and let  $(q_1,\dots,q_k)$  be an orthonormal basis of  $S$ .

**Step 1: Extend to an orthonormal basis of  $\mathbb R^d$ .**  
You can extend any orthonormal list to a full orthonormal basis  $(q_1,\dots,q_k,q_{k+1},\dots,q_d)$  of  $\mathbb R^d$ . (This is a standard finite-dimensional fact: keep adding unit vectors orthogonal to the span until you hit dimension  $d$ .)

**Step 2: Identify  $S^\perp$ .**  
Claim:

$$
S^\perp = \operatorname{span}\{q_{k+1},\dots,q_d\}.
$$
*   (**⊆ direction**) Any vector in  $\operatorname{span}\{q_{k+1},\dots,q_d\}$  is orthogonal to each  $q_1,\dots,q_k$ , hence orthogonal to all of  $S=\operatorname{span}\{q_1,\dots,q_k\}$ . So it lies in  $S^\perp$ .
*   (**⊇ direction**) Let  $u\in S^\perp$ . Expand  $u$  in the full orthonormal basis:
    $$
    u=\sum_{i=1}^d \alpha_i q_i.
    $$
    For any  $j\le k$ ,
    $$
    0=q_j^\top u=q_j^\top\left(\sum_{i=1}^d \alpha_i q_i\right)=\sum_{i=1}^d \alpha_i (q_j^\top q_i)=\alpha_j,
    $$
    because  $q_j^\top q_i=\delta_{ji}$ . So  $\alpha_1=\cdots=\alpha_k=0$ , hence
    $$
    u=\sum_{i=k+1}^d \alpha_i q_i \in \operatorname{span}\{q_{k+1},\dots,q_d\}.
    $$

So equality holds.

**Step 3: Count dimensions.**  
 $\{q_{k+1},\dots,q_d\}$  has  $d-k$  vectors and is linearly independent, so

$$
\dim(S^\perp)=d-k.
$$

Therefore

$$
\dim(S)+\dim(S^\perp)=k+(d-k)=d.
$$

∎

* * *

2.5 A small but crucial principle: containment + equal dimension ⇒ equality
---------------------------------------------------------------------------

### Lemma

If  $U\subseteq V$  are subspaces of  $\mathbb R^d$  and  $\dim(U)=\dim(V)$ , then  $U=V$ .

### Proof

Take a basis of  $U$ . Because  $U\subseteq V$ , that basis is a linearly independent set in  $V$ . If  $U\neq V$ , you could extend that set by at least one vector in  $V\setminus U$  to get a larger independent set, forcing  $\dim(V)>\dim(U)$ , contradiction. ∎

We will use this exact move twice.

* * *

3) First orthogonality law:  $\mathcal C(A)=\mathcal N(A^\top)^\perp$  in  $\mathbb R^m$ 
=========================================================================================

Theorem 1
---------

 $$
\boxed{\ \mathcal C(A)=\mathcal N(A^\top)^\perp\subseteq \mathbb R^m\ }.
$$

We prove two containments.

* * *

3.1 Containment 1:  $\mathcal C(A)\subseteq \mathcal N(A^\top)^\perp$ 
----------------------------------------------------------------------

Take  $b\in\mathcal C(A)$ . Then  $b=Ax$  for some  $x\in\mathbb R^n$ .

Take any  $y\in\mathcal N(A^\top)$ . Then  $A^\top y=0$ .

We must show  $y^\top b=0$ . Compute:

$$
y^\top b = y^\top(Ax).
$$

Now use the identity

$$
y^\top A x = (A^\top y)^\top x
$$

(which is just the rule  $(y^\top A)^\top = A^\top y$  and associativity).

Since  $A^\top y=0$ ,

$$
y^\top A x = (A^\top y)^\top x = 0^\top x=0.
$$

So  $y$  is orthogonal to  $b$ . Because  $y$  was any vector in  $\mathcal N(A^\top)$ , we conclude  $b\in\mathcal N(A^\top)^\perp$ .

Thus  $\mathcal C(A)\subseteq \mathcal N(A^\top)^\perp$ . ∎

**Interpretation:** anything that can be produced as an output  $Ax$  is orthogonal to every “left constraint”  $y$  that annihilates outputs via  $A^\top y=0$ .

* * *

3.2 Containment 2:  $\mathcal N(A^\top)^\perp\subseteq \mathcal C(A)$ 
----------------------------------------------------------------------

This is the subtle direction. The cleanest _no-gaps_ route is:

1.  show both are subspaces of  $\mathbb R^m$ ,
2.  show one is contained in the other (done),
3.  show they have the same dimension.

Then containment + equal dimension forces equality.

So we now compute dimensions.

### Step A:  $\dim(\mathcal N(A^\top)^\perp)=m-\dim(\mathcal N(A^\top))$ 

This is exactly Lemma 2.4 with  $S=\mathcal N(A^\top)\subseteq\mathbb R^m$ :

$$
\dim(\mathcal N(A^\top))+\dim(\mathcal N(A^\top)^\perp)=m \Rightarrow \dim(\mathcal N(A^\top)^\perp)=m-\dim(\mathcal N(A^\top)).
$$

### Step B: Use rank–nullity on  $A^\top$ 

 $A^\top:\mathbb R^m\to\mathbb R^n$ . Rank–nullity (Module 3) gives:

$$
\dim(\mathcal N(A^\top))+\operatorname{rank}(A^\top)=m \Rightarrow m-\dim(\mathcal N(A^\top))=\operatorname{rank}(A^\top).
$$

Combine with Step A:

 $$
\boxed{\ \dim(\mathcal N(A^\top)^\perp)=\operatorname{rank}(A^\top)\ }.
$$

### Step C: Prove  $\operatorname{rank}(A^\top)=\operatorname{rank}(A)$  (no circularity)

This is _row rank = column rank_ in disguise. Here’s a clean, elimination-based proof.

#### Lemma (row rank = column rank)

For any  $A$ , the dimension of its row space equals the dimension of its column space.

**Proof idea:** reduce  $A$  to RREF  $R$  via invertible row operations  $R=EA$ .  
Row operations do **not** change row space dimension (they only replace rows by linear combinations of rows). In RREF:

*   the nonzero rows of  $R$  are linearly independent (RREF has leading 1s in distinct columns),
*   they span the row space of  $R$ .

So  $\dim(\mathcal R(R))=\#\{\text{nonzero rows of }R\}$ .

Now: in RREF, the number of nonzero rows equals the number of pivot columns (each nonzero row has one leading pivot 1 in a new column). Call this number  $r$ .

*   Thus  $\dim(\mathcal R(R))=r$ .
*   Also, the pivot columns of  $R$  are linearly independent and span  $\mathcal C(R)$ , giving  $\dim(\mathcal C(R))=r$ .

Therefore  $\dim(\mathcal R(R))=\dim(\mathcal C(R))=r$ .

Finally, row operations preserve rank (they don’t change the number  $r$  of pivots), and  $\mathcal C(A)$  and  $\mathcal C(R)$  have the same dimension (rank is invariant under multiplication by invertible matrices). Conclude:

$$
\dim(\mathcal R(A))=\dim(\mathcal C(A)).
$$

∎

Now apply that to  $A^\top$ :

*    $\operatorname{rank}(A)=\dim(\mathcal C(A))$ .
*    $\operatorname{rank}(A^\top)=\dim(\mathcal C(A^\top))=\dim(\mathcal R(A))$ .

But we just proved  $\dim(\mathcal R(A))=\dim(\mathcal C(A))$ . Hence:

 $$
\boxed{\ \operatorname{rank}(A^\top)=\operatorname{rank}(A)\ }.
$$

So Step B becomes:

$$
\dim(\mathcal N(A^\top)^\perp)=\operatorname{rank}(A^\top)=\operatorname{rank}(A).
$$

### Step D: Compare with  $\dim(\mathcal C(A))$ 

By definition,

$$
\dim(\mathcal C(A))=\operatorname{rank}(A).
$$

So we have:

*    $\mathcal C(A)\subseteq \mathcal N(A^\top)^\perp$ ,
*    $\dim(\mathcal C(A))=\operatorname{rank}(A)=\dim(\mathcal N(A^\top)^\perp)$ .

By the containment+dimension lemma (2.5), they are equal.

Thus  $\mathcal C(A)=\mathcal N(A^\top)^\perp$ . ∎

* * *

4) Second orthogonality law:  $\mathcal C(A^\top)=\mathcal N(A)^\perp$  in  $\mathbb R^n$ 
==========================================================================================

Theorem 2
---------

 $$
\boxed{\ \mathcal C(A^\top)=\mathcal N(A)^\perp\subseteq \mathbb R^n\ }.
$$

**Proof (one-line but legitimate).**  
Apply Theorem 1 to  $A^\top$  (swap  $A\mapsto A^\top$ ,  $m\leftrightarrow n$ ):

$$
\mathcal C(A^\top)=\mathcal N((A^\top)^\top)^\perp=\mathcal N(A)^\perp.
$$

∎

This says: **row space is orthogonal complement of null space**.

* * *

5) The “four subspaces” lock together as two orthogonal decompositions
======================================================================

Now we can state (and prove) the full picture.

5.1 Output space decomposition  $\mathbb R^m$ 
----------------------------------------------

We have:

$$
\mathcal C(A)=\mathcal N(A^\top)^\perp.
$$

In finite dimensions, for any subspace  $S$ ,

$$
\mathbb R^m = S \oplus S^\perp
$$

(orthogonal direct sum), meaning:

1.  every vector  $b\in\mathbb R^m$  can be written  $b=b_S+b_\perp$  with  $b_S\in S$ ,  $b_\perp\in S^\perp$ ,
2.  that decomposition is **unique**,
3.   $b_S\perp b_\perp$ .

Taking  $S=\mathcal C(A)$  (so  $S^\perp=\mathcal N(A^\top)$ ), we get:

 $$
\boxed{\ \mathbb R^m = \mathcal C(A)\ \oplus\ \mathcal N(A^\top)\ }.
$$

5.2 Input space decomposition  $\mathbb R^n$ 
---------------------------------------------

Similarly, using  $\mathcal C(A^\top)=\mathcal N(A)^\perp$ :

 $$
\boxed{\ \mathbb R^n = \mathcal C(A^\top)\ \oplus\ \mathcal N(A)\ }.
$$

**This is the “fits like Lego” moment.**  
Each ambient space splits into “what matters” + “what’s invisible” for the map.

* * *

6) Solvability of  $Ax=b$  as an orthogonality certificate
==========================================================

From Module 3:

$$
Ax=b\ \text{solvable} \iff b\in\mathcal C(A).
$$

Using Theorem 1:

$$
b\in\mathcal C(A) \iff b\in\mathcal N(A^\top)^\perp \iff y^\top b = 0\ \ \forall y\in\mathcal N(A^\top).
$$

So we get the exact “certificate” statement:

 $$
\boxed{\ Ax=b\ \text{is consistent} \iff y^\top b=0\ \forall y\in\mathcal N(A^\top). }
$$

And its contrapositive (how inconsistency is witnessed):

 $$
\boxed{\ Ax=b\ \text{is inconsistent} \iff \exists y\in\mathcal N(A^\top)\ \text{s.t.}\ y^\top b\neq 0. }
$$

This is the baby version of dual infeasibility certificates (and later, Farkas/KKT logic).

* * *

7) How to compute bases for the four subspaces (algorithmic, precise)
=====================================================================

Given  $A$ :

1.  **Row-reduce**  $A$  to RREF  $R$ .
2.  **Rank**  $r$ : number of pivots.
3.  **Column space**  $\mathcal C(A)\subseteq\mathbb R^m$ :  
    pivot columns of the _original_  $A$  form a basis of  $\mathcal C(A)$ .  
    (Important: pivot columns in RREF tell you which original columns are independent.)
4.  **Row space**  $\mathcal C(A^\top)=\mathcal R(A)\subseteq\mathbb R^n$ :  
    the nonzero rows of RREF form a basis of  $\mathcal R(A)$ .
5.  **Null space**  $\mathcal N(A)\subseteq\mathbb R^n$ :  
    solve  $Ax=0$  from RREF; parameterize by free variables; basis vectors are the parameter-direction solutions.
6.  **Left null space**  $\mathcal N(A^\top)\subseteq\mathbb R^m$ :  
    solve  $A^\top y=0$  similarly (row-reduce  $A^\top$  or solve via elimination).

Sanity checks you should always run:

$$
\dim\mathcal C(A)=\operatorname{rank}(A)=r,\qquad \dim\mathcal N(A)=n-r,\qquad \dim\mathcal N(A^\top)=m-r.
$$

* * *

8) A tiny concrete example (to make the orthogonality laws feel physical)
=========================================================================

Let

$$
A=\begin{pmatrix} 1&1&0\\ 0&1&1 \end{pmatrix} \in\mathbb R^{2\times 3}.
$$
*   Columns:
    $$
    A_{:1}=\binom{1}{0},\quad A_{:2}=\binom{1}{1},\quad A_{:3}=\binom{0}{1}.
    $$
    These span all of  $\mathbb R^2$  (indeed  $A_{:1}$  and  $A_{:3}$  already form the standard basis), so
    $$
    \mathcal C(A)=\mathbb R^2,\quad \operatorname{rank}(A)=2.
    $$
*   Left null space  $\mathcal N(A^\top)\subseteq\mathbb R^2$ : since  $\operatorname{rank}(A)=2=m$ ,
    $$
    \dim\mathcal N(A^\top)=m-\operatorname{rank}(A)=2-2=0,
    $$
    so  $\mathcal N(A^\top)=\{0\}$ . Then Theorem 1 says
    $$
    \mathcal C(A)=\mathcal N(A^\top)^\perp = \{0\}^\perp=\mathbb R^2,
    $$
    consistent.
*   Null space  $\mathcal N(A)\subseteq\mathbb R^3$ :  $\dim\mathcal N(A)=n-r=3-2=1$ .  
    Solve  $Ax=0$ :
    $$
    \begin{cases} x_1+x_2=0\\ x_2+x_3=0 \end{cases} \Rightarrow x_1=-t,\ x_2=t,\ x_3=-t \Rightarrow x=t(-1,1,-1).
    $$
    So  $\mathcal N(A)=\operatorname{span}\{(-1,1,-1)\}$ .
*   Row space  $\mathcal C(A^\top)\subseteq\mathbb R^3$  should be the orthogonal complement of that line:
    $$
    \mathcal C(A^\top)=\mathcal N(A)^\perp =\{u\in\mathbb R^3:\ u^\top(-1,1,-1)=0\} =\{u:\ -u_1+u_2-u_3=0\}.
    $$
    That’s a 2D plane in  $\mathbb R^3$ , as expected since  $\operatorname{rank}(A)=2$ .

This is the orthogonality law “in the flesh.”

* * *

9) End-of-Module 4 checklist (no mercy)
=======================================

You’re actually ready only if you can do all of this on demand:

1.  Prove  $y^\top(Ax)=(A^\top y)^\top x$  and use it to show  
     $\mathcal C(A)\subseteq\mathcal N(A^\top)^\perp$ .
2.  Prove  $\dim(S)+\dim(S^\perp)=d$  (via orthonormal basis construction + extension).
3.  Prove  $\operatorname{rank}(A)=\operatorname{rank}(A^\top)$  without circularity (row rank = column rank via RREF pivots).
4.  Use containment + equal dimension ⇒ equality to finish  
     $\mathcal C(A)=\mathcal N(A^\top)^\perp$ .
5.  Translate solvability of  $Ax=b$  into the certificate form  
     $y^\top b=0\ \forall y\in\mathcal N(A^\top)$ .

* * *

What Module 5 will do with this
-------------------------------

Module 5 is where you stop “solving equations” and start **projecting geometry**:

*   every  $b\in\mathbb R^m$  decomposes uniquely:
    $$
    b = b_{\mathcal C} + b_{\mathcal N},\quad b_{\mathcal C}\in\mathcal C(A),\ b_{\mathcal N}\in\mathcal N(A^\top),
    $$
*   least squares picks  $Ax$  to match  $b_{\mathcal C}$ ,
*   the residual  $r=b-Ax$  lands in  $\mathcal N(A^\top)$ ,
*   which becomes  $A^\top r=0$ , i.e. **normal equations**  $A^\top(Ax-b)=0$ .

That’s the moment the universe stops being coy.

If you want the next step immediately: I can write Module 5 with the full **projection theorem proof**, the **normal equations**, and the PSD proof  $A^\top A\succeq 0$  (with equality conditions).

## Prompt:
Now this:

# Module 5 — Orthogonality, projections, Gram matrices, and least squares

*(where linear algebra turns into geometry and “normal equations” stop being magic)*

## 0) What this module is secretly doing

You now know the two orthogonality laws:
[
\mathcal C(A)=\mathcal N(A^\top)^\perp,\qquad \mathcal C(A^\top)=\mathcal N(A)^\perp.
]

Module 5 cashes that out into the most important geometric algorithm in basic optimization:

> **Given a point (b), find the closest point to (b) inside a subspace (S).**

That closest-point operation is **orthogonal projection**. Least squares is just:
[
\text{“project (b) onto the column space of (A)”}.
]

Along the way we prove:

* the projection theorem (existence + uniqueness + orthogonality condition),
* normal equations (A^\top A x = A^\top b),
* (X^\top X\succeq 0) (“Gram matrices are PSD”) from first principles,
* why (A^\top A) is invertible iff columns are independent.

This is the exact bedrock under ridge regression, KKT stationarity, and convex quadratic objectives later.

---

# 1) Orthogonal complement and decomposition (what we’ll repeatedly use)

Let (S\subseteq \mathbb R^m) be a subspace. Define
[
S^\perp := {r\in\mathbb R^m : r^\top s = 0\ \forall s\in S}.
]

### Key fact (orthogonal direct sum)

In (\mathbb R^m),
[
\boxed{\ \mathbb R^m = S \oplus S^\perp\ }
]
meaning: every (b\in\mathbb R^m) can be written uniquely as
[
b = s + r,\quad s\in S,\ r\in S^\perp.
]

**Why it’s true (sketch you should fully own):**

* Pick an orthonormal basis of (S), extend to an orthonormal basis of (\mathbb R^m).
* Expand (b) in that basis; the “(S)-coordinates” part is (s), the rest is (r).
* Uniqueness comes from (S\cap S^\perp={0}).

We’ll effectively re-prove the needed parts inside the projection theorem.

---

# 2) Projection onto a subspace: definition, theorem, and full proof

## 2.1 Problem statement (closest point)

Given a subspace (S\subseteq\mathbb R^m) and a vector (b\in\mathbb R^m), we want:
[
\min_{s\in S} |b-s|_2.
]
(Equivalent to minimizing the square (|b-s|_2^2), same minimizer.)

## 2.2 Theorem (Projection Theorem)

For any subspace (S\subseteq\mathbb R^m) and any (b\in\mathbb R^m), there exists a **unique** vector (p\in S) such that
[
\boxed{\ b-p \in S^\perp. }
]
This (p) is the unique minimizer of (|b-s|_2) over (s\in S). We call it the **orthogonal projection** of (b) onto (S), written
[
p = P_S(b).
]

We will prove: existence, uniqueness, and optimality.

---

## 2.3 Proof (existence)

Because (S) is a subspace of finite-dimensional (\mathbb R^m), it has an orthonormal basis. Let
[
q_1,\dots,q_k
]
be an orthonormal basis of (S). (You can obtain it by Gram–Schmidt from any basis of (S).)

Define
[
p := \sum_{i=1}^k (q_i^\top b), q_i.
]
This is a linear combination of vectors in (S), so (p\in S).

Now define the residual
[
r := b-p.
]
We claim (r\in S^\perp).

Take any basis vector (q_j). Compute:
[
q_j^\top r = q_j^\top(b-p)=q_j^\top b - q_j^\top\sum_{i=1}^k (q_i^\top b)q_i
= q_j^\top b - \sum_{i=1}^k (q_i^\top b)(q_j^\top q_i).
]
But orthonormality gives (q_j^\top q_i=\delta_{ji}), so the sum collapses:
[
q_j^\top r = q_j^\top b - (q_j^\top b)\cdot 1 = 0.
]
So (r) is orthogonal to every (q_j). Since ({q_j}) spans (S), orthogonality to every basis vector implies orthogonality to all of (S):
for any (s=\sum c_j q_j\in S),
[
r^\top s = r^\top\sum c_j q_j = \sum c_j (r^\top q_j)=0.
]
Hence (r\in S^\perp). Existence proven. ∎

**Interpretation:** the formula for (p) literally extracts the “components of (b)” along the orthonormal directions spanning (S).

---

## 2.4 Proof (uniqueness)

Suppose (p_1,p_2\in S) both satisfy (b-p_1\in S^\perp) and (b-p_2\in S^\perp).
Subtract:
[
(b-p_1)-(b-p_2)=p_2-p_1.
]
Left-hand side is difference of two vectors in (S^\perp), hence in (S^\perp). Right-hand side is in (S) since (p_1,p_2\in S).
So (p_2-p_1\in S\cap S^\perp={0}).
Thus (p_2-p_1=0\Rightarrow p_1=p_2). ∎

---

## 2.5 Proof (optimality: why orthogonality means closest)

Let (p\in S) with residual (r=b-p\in S^\perp). Take any other (s\in S). Then
[
b-s = (b-p) + (p-s) = r + (p-s).
]
Here (r\in S^\perp) and ((p-s)\in S). These are orthogonal. Therefore (Pythagoras):
[
|b-s|_2^2 = |r|_2^2 + |p-s|_2^2 \ge |r|_2^2 = |b-p|_2^2,
]
with equality iff (|p-s|_2^2=0\iff s=p).
So (p) is the unique minimizer. ∎

**This is the core idea you must feel:**
Once the error is orthogonal to the space you’re approximating with, you cannot reduce it by moving inside the space—because any move is perpendicular to the residual and only adds squared length.

---

# 3) Least squares as projection onto column space

## 3.1 The least squares problem

Given (A\in\mathbb R^{m\times n}) and (b\in\mathbb R^m), solve:
[
\min_{x\in\mathbb R^n} |Ax-b|_2^2.
]

Define the subspace
[
S := \mathcal C(A) = {Ax:x\in\mathbb R^n}\subseteq\mathbb R^m.
]
So we are choosing a vector (s=Ax) in (S) to be as close as possible to (b). That is exactly a projection problem:
[
\min_{s\in \mathcal C(A)} |s-b|_2^2.
]

Let
[
p := P_{\mathcal C(A)}(b)
]
be the projection of (b) onto the column space. Then the best approximation is (p), and any minimizer (x^\star) must satisfy
[
Ax^\star = p.
]

So least squares is: find (x^\star) such that (Ax^\star) equals the projection of (b) onto (\mathcal C(A)).

---

# 4) Normal equations (fully derived, no handwaving)

Let the residual be
[
r := b-Ax^\star.
]
From the projection theorem, at the optimum we must have residual orthogonal to the subspace (\mathcal C(A)):
[
r \in \mathcal C(A)^\perp.
]

But Module 4 proved:
[
\mathcal C(A)^\perp = \mathcal N(A^\top).
]
So the condition is:
[
r \in \mathcal N(A^\top) \quad\Longleftrightarrow\quad A^\top r = 0.
]
Substitute (r=b-Ax^\star):
[
A^\top (b-Ax^\star)=0.
]
Rearrange:
[
\boxed{\ A^\top A x^\star = A^\top b. \ }
]
These are the **normal equations**.

### Commentary (what they mean)

* The columns of (A) span (\mathcal C(A)).
* Saying (b-Ax^\star) is orthogonal to (\mathcal C(A)) means it’s orthogonal to *every column* of (A).
* Orthogonal to every column (a_j) means (a_j^\top(b-Ax^\star)=0) for each (j).
* Stacking those (n) scalar equations is exactly (A^\top(b-Ax^\star)=0).

So “normal equations” are just “residual orthogonal to columns.”

---

# 5) Gram matrices and PSD: why (X^\top X\succeq 0)

## 5.1 Gram matrix definition

Given (X\in\mathbb R^{m\times n}), its **Gram matrix** is
[
G := X^\top X \in\mathbb R^{n\times n}.
]
Entrywise:
[
G_{ij} = e_i^\top X^\top X e_j = (Xe_i)^\top(Xe_j) = x_i^\top x_j,
]
where (x_i) is the (i)-th column of (X).
So (G) contains all pairwise dot products between columns.

## 5.2 Claim: (X^\top X) is symmetric PSD

We prove both.

### Symmetry

[
(X^\top X)^\top = X^\top (X^\top)^\top = X^\top X.
]
So it is symmetric.

### PSD (positive semidefinite)

We must show:
[
z^\top (X^\top X) z \ge 0 \quad\forall z\in\mathbb R^n.
]
Compute:
[
z^\top X^\top X z = (Xz)^\top (Xz) = |Xz|_2^2 \ge 0.
]
Because squared Euclidean norm is a sum of squares. ∎

So:
[
\boxed{\ X^\top X \succeq 0. \ }
]

### When is it positive definite?

[
X^\top X \succ 0 \iff z^\top X^\top X z>0\ \forall z\neq 0
\iff |Xz|_2^2>0\ \forall z\neq 0
\iff Xz\neq 0\ \forall z\neq 0
\iff \ker(X)={0}.
]
So:
[
\boxed{\ X^\top X \succ 0 \iff X \text{ has full column rank (columns independent)}. }
]

This is *huge* later: strict convexity of quadratic objectives is exactly PD-ness.

---

# 6) Existence and uniqueness of least squares solutions (complete story)

## 6.1 Existence: always

The least squares problem always has at least one minimizer because:

* the function (f(x)=|Ax-b|_2^2) is continuous,
* it is convex and grows at least quadratically along directions not in the null space (more rigor: coercivity on (\ker(A)^\perp)),
* in finite dimensions, you can show the minimum is attained.

But you can also argue more geometrically: projection onto a closed subspace exists and is unique in Euclidean space; (\mathcal C(A)) is closed (it’s finite-dimensional subspace). Therefore projection (p) exists; pick any (x) with (Ax=p) (exists because (p\in\mathcal C(A))). Hence a minimizer exists.

## 6.2 Uniqueness: depends on (\ker(A))

Even though the projected point (p=Ax^\star) is unique, the (x^\star) may not be.

From Module 3:
[
{x:Ax=p} = x_p + \ker(A).
]
So if (\ker(A)\neq{0}), there are infinitely many minimizers, all differing by null-space vectors.

### Criterion

[
\boxed{\text{Least squares minimizer }x^\star\text{ is unique} \iff \ker(A)={0} \iff A^\top A\succ 0.}
]

---

# 7) Explicit formula when (A) has full column rank

If (\ker(A)={0}), then (A^\top A) is invertible and normal equations give:
[
\boxed{\ x^\star = (A^\top A)^{-1}A^\top b. }
]
This is the classical closed form.

**Important numerical note (conceptual):** in computation you should not form ((A^\top A)^{-1}) explicitly; you solve the linear system (A^\top A x = A^\top b) via QR/SVD/Cholesky. (We’ll formalize QR/SVD later.)

---

# 8) “Do” skills / sanity checks

Given (A) and (b), you should be able to:

1. Describe least squares geometrically: find (p=P_{\mathcal C(A)}(b)).
2. Write the optimality condition: residual (r=b-Ax^\star) satisfies (r\perp\mathcal C(A)).
3. Translate orthogonality to algebra: (A^\top r=0).
4. Derive normal equations: (A^\top A x^\star = A^\top b).
5. Decide uniqueness: check whether columns are independent (rank (n)).
6. Prove (X^\top X\succeq 0) and characterize when it’s (\succ 0).

---

# 9) End-of-Module 5 checklist (don’t proceed unless these are automatic)

You can:

* Prove the projection theorem (existence via orthonormal basis, uniqueness via (S\cap S^\perp={0}), optimality via Pythagoras).
* Explain least squares as projection onto (\mathcal C(A)).
* Derive normal equations from “residual orthogonal to column space.”
* Prove (X^\top X\succeq 0) and interpret it as “sum of squares.”
* State exactly when LS minimizer is unique.

---

## Next module

**Module 6 — Matrix inner products, trace, and Frobenius geometry.**
This is where we upgrade dot products from vectors to matrices:
(\langle X,Y\rangle=\mathrm{tr}(X^\top Y)), (|X|_F^2=\mathrm{tr}(X^\top X)), cyclic trace tricks, and why SDPs write objectives as (\langle C,X\rangle).

Say “next” and we’ll do Module 6 at the same rigor level.

## Response:
Thought for 16s

Alright. Let’s take your Module 5 and rebuild it so that **every single implication is justified**, every hidden assumption is exposed (finite-dimensionality, closedness, Pythagoras, “orthogonal to a basis ⇒ orthogonal to the whole subspace,” etc.), and all the “magic-looking” formulas (projection coefficients, normal equations,  $X^\top X\succeq 0$ ) feel _inevitable_.

I’ll do it in the same style as before: **define → prove → interpret → connect to least squares → edge cases**.

* * *

Module 5 — Orthogonality, projections, Gram matrices, and least squares
=======================================================================

_(where linear algebra becomes Euclidean geometry and “normal equations” become a one-line consequence)_

0) What we’re trying to cash out
--------------------------------

You have the orthogonality laws (Module 4):

$$
\mathcal C(A)=\mathcal N(A^\top)^\perp \subseteq \mathbb R^m,\qquad \mathcal C(A^\top)=\mathcal N(A)^\perp \subseteq \mathbb R^n.
$$

Module 5 turns those into a concrete computational operation:

> Given a point  $b$  and a subspace  $S$ , find the point in  $S$  closest to  $b$ .

That closest point is the **orthogonal projection**, and least squares is the special case  $S=\mathcal C(A)$ .

* * *

1) Orthogonal complement and the “direct sum” decomposition
===========================================================

Let  $S\subseteq\mathbb R^m$  be a **subspace**. Use the standard dot product  $u^\top v$  and Euclidean norm  $\|u\|_2=\sqrt{u^\top u}$ .

1.1 Orthogonal complement
-------------------------

$$
S^\perp := \{r\in\mathbb R^m : r^\top s = 0\ \forall s\in S\}.
$$

### Fact A:  $S^\perp$  is a subspace

Proof is mechanical:

*    $0^\top s=0$  so  $0\in S^\perp$ .
*   If  $r_1,r_2\in S^\perp$ , then  $(r_1+r_2)^\top s = r_1^\top s + r_2^\top s = 0$ .
*   If  $r\in S^\perp$ , then  $(\alpha r)^\top s = \alpha(r^\top s)=0$ .

So  $S^\perp$  is a subspace. ∎

### Fact B:  $S\cap S^\perp=\{0\}$ 

If  $u\in S\cap S^\perp$ , then in particular  $u^\top u=0$ , so  $\|u\|_2^2=0\Rightarrow u=0$ . ∎

* * *

1.2 The orthogonal direct sum statement
---------------------------------------

The claim you wrote:

 $$
\boxed{\ \mathbb R^m = S \oplus S^\perp\ }
$$

means **three separate things**:

1.  (**Existence**) every  $b\in\mathbb R^m$  can be written as  $b=s+r$  with  $s\in S$ ,  $r\in S^\perp$ .
2.  (**Uniqueness**) that decomposition is unique.
3.  (**Orthogonality**) the two components satisfy  $s^\top r=0$  (automatic since  $r\in S^\perp$ ).

### Proof idea you must actually own (not just “sketch”)

This uses a Euclidean fact: **every finite-dimensional subspace has an orthonormal basis**, and any orthonormal list can be extended to a full orthonormal basis of  $\mathbb R^m$ . Here’s the logic:

*   Start with any basis of  $S$ .
*   Run Gram–Schmidt → obtain an orthonormal basis  $(q_1,\dots,q_k)$  of  $S$ .
*   Extend it to an orthonormal basis  $(q_1,\dots,q_k,q_{k+1},\dots,q_m)$  of  $\mathbb R^m$ .

Now every  $b\in\mathbb R^m$  has a unique expansion in this basis:

$$
b=\sum_{i=1}^m \alpha_i q_i, \qquad \alpha_i = q_i^\top b
$$

(the coefficient identity  $\alpha_i=q_i^\top b$  is a one-line consequence of orthonormality).

Define

$$
s := \sum_{i=1}^k \alpha_i q_i \in S,\qquad r := \sum_{i=k+1}^m \alpha_i q_i \in \operatorname{span}\{q_{k+1},\dots,q_m\}.
$$

Then  $b=s+r$ . Also, every vector in  $\operatorname{span}\{q_{k+1},\dots,q_m\}$  is orthogonal to  $S$ , so  $r\in S^\perp$ .

Uniqueness: if  $b=s_1+r_1=s_2+r_2$  with  $s_i\in S, r_i\in S^\perp$ , then

$$
s_1-s_2 = r_2-r_1 \in S\cap S^\perp = \{0\} \Rightarrow s_1=s_2,\ r_1=r_2.
$$

∎

This decomposition is _exactly_ what projection will formalize.

* * *

2) Projection onto a subspace: the closest-point theorem
========================================================

2.1 The optimization problem
----------------------------

Given  $b\in\mathbb R^m$  and a subspace  $S\subseteq\mathbb R^m$ , solve

$$
\min_{s\in S} \|b-s\|_2.
$$

### Why you can square it without changing the minimizer

Define  $g(t)=t^2$  on  $[0,\infty)$ . It’s strictly increasing. So for any nonnegative numbers  $a,b$ :

$$
a\le b \iff a^2 \le b^2.
$$

Since norms are  $\ge 0$ , minimizing  $\|b-s\|_2$  is equivalent to minimizing  $\|b-s\|_2^2$ . Same minimizers. (This avoids square roots later.)

* * *

2.2 The Projection Theorem (precise statement)
----------------------------------------------

**Theorem (Projection onto a subspace).**  
For any subspace  $S\subseteq\mathbb R^m$  and any  $b\in\mathbb R^m$ , there exists a **unique**  $p\in S$  such that

 $$
\boxed{\ b-p \in S^\perp. }
$$

Moreover, this  $p$  is the unique minimizer of  $\|b-s\|_2$  over  $s\in S$ . We write  $p=P_S(b)$ .

Notice what’s going on: the theorem doesn’t start with “closest point.” It starts with the **orthogonality condition**  $b-p\in S^\perp$ , and then proves that condition is equivalent to being closest.

* * *

2.3 Existence proof (construct  $p$  explicitly)
------------------------------------------------

Because  $S$  is finite-dimensional, it has an orthonormal basis  $(q_1,\dots,q_k)$ .

Define

 $$
\boxed{\ p := \sum_{i=1}^k (q_i^\top b)\, q_i. }
$$

This is in  $S$  because it’s a linear combination of  $q_i\in S$ .

Let the residual be

$$
r := b-p.
$$

### Claim:  $r\in S^\perp$ 

It is enough to check orthogonality to the basis vectors, then extend by linearity.

Fix  $j\in\{1,\dots,k\}$ . Compute:

$$
q_j^\top r = q_j^\top(b-p) = q_j^\top b - q_j^\top\sum_{i=1}^k (q_i^\top b) q_i = q_j^\top b - \sum_{i=1}^k (q_i^\top b)(q_j^\top q_i).
$$

Because  $(q_i)$  are orthonormal,  $q_j^\top q_i=\delta_{ji}$ . So the sum collapses to the single term  $i=j$ :

$$
q_j^\top r = q_j^\top b - (q_j^\top b)\cdot 1 = 0.
$$

Now take any  $s\in S$ . Because  $(q_i)$  span  $S$ ,  $s=\sum_{j=1}^k c_j q_j$ . Then

$$
r^\top s = r^\top \sum_{j=1}^k c_j q_j = \sum_{j=1}^k c_j (r^\top q_j) = 0.
$$

So  $r$  is orthogonal to all of  $S$ , hence  $r\in S^\perp$ . Existence proven. ∎

**Interpretation:**  $p$  is literally “the component of  $b$  along  $S$ .” The coefficients  $q_i^\top b$  are “how much  $b$  points in direction  $q_i$ .”

* * *

2.4 Uniqueness proof (why there can’t be two different such  $p$ )
------------------------------------------------------------------

Suppose  $p_1,p_2\in S$  both satisfy  $b-p_1\in S^\perp$  and  $b-p_2\in S^\perp$ .

Subtract:

$$
(b-p_1)-(b-p_2)=p_2-p_1.
$$

Left side lies in  $S^\perp$  (difference of two vectors in  $S^\perp$ ). Right side lies in  $S$ . Therefore:

$$
p_2-p_1 \in S\cap S^\perp=\{0\} \Rightarrow p_1=p_2.
$$

∎

* * *

2.5 Optimality proof (why orthogonal residual means “closest”)
--------------------------------------------------------------

This is where Pythagoras must be used correctly, not handwaved.

Let  $p\in S$  be the vector constructed above with  $r=b-p\in S^\perp$ . Take any other  $s\in S$ . Write:

$$
b-s = (b-p) + (p-s) = r + (p-s).
$$

Key observation:

*    $r\in S^\perp$ 
*    $p-s\in S$ 

So  $r \perp (p-s)$ .

### Pythagoras in  $\mathbb R^m$ 

If  $u\perp v$ , then

$$
\|u+v\|_2^2 = \|u\|_2^2 + \|v\|_2^2.
$$

Proof: expand:

$$
\|u+v\|_2^2 = (u+v)^\top(u+v)=u^\top u + 2u^\top v + v^\top v = \|u\|_2^2 + 0 + \|v\|_2^2.
$$

Apply with  $u=r$ ,  $v=p-s$ :

$$
\|b-s\|_2^2 = \|r\|_2^2 + \|p-s\|_2^2 \ge \|r\|_2^2 = \|b-p\|_2^2,
$$

and equality holds iff  $\|p-s\|_2^2=0\iff s=p$ .

So  $p$  is the **unique minimizer**. ∎

**The geometric “feel” (but still precise):**  
Any move  $s\mapsto s+\Delta$  stays inside  $S$ . The residual  $r$  is perpendicular to  $S$ . So you can’t “cancel” any part of  $r$  by moving inside  $S$ ; all you can do is add perpendicular squared length.

* * *

2.6 Bonus: the projection map is linear and has a matrix form
-------------------------------------------------------------

This becomes extremely useful in least squares.

### Linearity

For scalars  $\alpha,\beta$  and vectors  $b_1,b_2$ ,

$$
P_S(\alpha b_1+\beta b_2)=\alpha P_S(b_1)+\beta P_S(b_2).
$$

Proof using the orthonormal formula:

$$
P_S(b)=\sum_{i=1}^k (q_i^\top b)q_i
$$

and dot product linearity.

### Matrix form

Let  $Q=[q_1\ \cdots\ q_k]\in\mathbb R^{m\times k}$  with orthonormal columns, so  $Q^\top Q=I_k$ .  
Then

$$
P_S(b) = \sum_{i=1}^k (q_i^\top b) q_i = Q(Q^\top b) = (QQ^\top)b.
$$

So the projection matrix is

 $$
\boxed{\ P = QQ^\top. }
$$

And it satisfies:

*    $P^\top=P$  (symmetric),
*    $P^2=P$  (idempotent),
*    $\operatorname{im}(P)=S$ ,
*    $\ker(P)=S^\perp$ .

These properties are the algebraic fingerprint of “orthogonal projection.”

* * *

3) Least squares is projection onto the column space
====================================================

3.1 The least squares problem
-----------------------------

Given  $A\in\mathbb R^{m\times n}$ ,  $b\in\mathbb R^m$ , solve:

$$
\min_{x\in\mathbb R^n} \|Ax-b\|_2^2.
$$

Let

$$
S := \mathcal C(A) = \{Ax: x\in\mathbb R^n\}\subseteq\mathbb R^m.
$$

Then the problem is exactly:

$$
\min_{s\in S}\|s-b\|_2^2 \quad \text{with the restriction } s=Ax.
$$

Let  $p=P_{\mathcal C(A)}(b)$ . Then:

*    $p\in \mathcal C(A)$ ,
*    $\|b-p\|_2\le \|b-s\|_2$  for all  $s\in\mathcal C(A)$ ,
*   residual  $r=b-p\in \mathcal C(A)^\perp$ .

Since  $p\in\mathcal C(A)$ , **there exists at least one  $x^\star$ ** such that

$$
Ax^\star = p.
$$

Any such  $x^\star$  is a least squares minimizer (because it achieves the minimal distance).

So:

$$
\boxed{\text{Least squares = find }x^\star \text{ such that }Ax^\star = P_{\mathcal C(A)}(b).}
$$

* * *

4) Normal equations: derived with zero handwaving
=================================================

Let  $x^\star$  be a minimizer and define residual

$$
r := b - Ax^\star.
$$

4.1 Optimality condition from projection geometry
-------------------------------------------------

Because  $Ax^\star$  is the projection of  $b$  onto  $\mathcal C(A)$ ,

$$
r = b-Ax^\star \in \mathcal C(A)^\perp.
$$

Module 4 gave:

$$
\mathcal C(A)^\perp = \mathcal N(A^\top).
$$

So

$$
r \in \mathcal N(A^\top)\quad \Longleftrightarrow\quad A^\top r = 0.
$$

Substitute  $r=b-Ax^\star$ :

$$
A^\top(b-Ax^\star)=0 \quad\Longleftrightarrow\quad \boxed{\ A^\top A x^\star = A^\top b. \ }
$$

That’s it. **Normal equations are just “residual orthogonal to column space.”**

* * *

4.2 Same result, but as “orthogonal to each column”
---------------------------------------------------

Let  $a_j$  be the  $j$ \-th column of  $A$ . Saying  $r\perp \mathcal C(A)$  is equivalent to saying

$$
a_j^\top r = 0\quad \forall j=1,\dots,n.
$$

Stack those  $n$  scalar equations:

$$
A^\top r = 0.
$$

Same condition.

This is often the most intuitive “componentwise” picture.

* * *

4.3 Calculus route (alternate proof you should also own)
--------------------------------------------------------

Define  $f(x)=\|Ax-b\|_2^2$ . Expand:

$$
f(x) = (Ax-b)^\top(Ax-b)=x^\top A^\top A x - 2b^\top A x + b^\top b.
$$

Compute gradient:

$$
\nabla f(x) = 2A^\top(Ax-b).
$$

(You can derive this entrywise; it’s a good exercise.)

At any minimizer  $x^\star$  of a differentiable unconstrained function:

$$
\nabla f(x^\star)=0 \Rightarrow A^\top(Ax^\star-b)=0 \Rightarrow A^\top A x^\star = A^\top b.
$$

Same result. Here the geometry and calculus meet.

* * *

5) Gram matrices:  $X^\top X$  is symmetric PSD (from first principles)
=======================================================================

Let  $X\in\mathbb R^{m\times n}$ . Define the Gram matrix:

$$
G := X^\top X\in\mathbb R^{n\times n}.
$$

5.1 Symmetry
------------

$$
G^\top = (X^\top X)^\top = X^\top (X^\top)^\top = X^\top X = G.
$$

5.2 PSD property
----------------

To prove  $G\succeq 0$ , we must show:

$$
z^\top G z \ge 0\quad \forall z\in\mathbb R^n.
$$

Compute:

$$
z^\top X^\top X z = (Xz)^\top(Xz)=\|Xz\|_2^2 \ge 0.
$$

So  $X^\top X\succeq 0$ . ∎

This is as “first principles” as it gets: it’s a sum of squares.

* * *

5.3 When is  $X^\top X$  positive definite?
-------------------------------------------

$$
X^\top X \succ 0 \iff z^\top X^\top X z >0 \ \forall z\neq 0 \iff \|Xz\|_2^2>0\ \forall z\neq 0 \iff Xz\neq 0\ \forall z\neq 0 \iff \ker(X)=\{0\}.
$$

So:

 $$
\boxed{\ X^\top X\succ 0 \iff X \text{ has full column rank (columns linearly independent).} }
$$

This is the quadratic-objective version of “strict convexity.”

* * *

6) Existence and uniqueness of least squares solutions: the complete story
==========================================================================

Here’s the precise situation: the projected **point**  $p\in\mathcal C(A)$  is always unique, but the coefficient vector  $x^\star$  may not be.

6.1 Existence (always)
----------------------

*    $\mathcal C(A)$  is a subspace of  $\mathbb R^m$ , hence closed (finite-dimensional subspaces are closed).
*   Projection onto a closed subspace exists and is unique (Projection Theorem).
*   Therefore  $p=P_{\mathcal C(A)}(b)$  exists.
*   Since  $p\in\mathcal C(A)$ , there exists at least one  $x^\star$  such that  $Ax^\star=p$ .

So least squares minimizers exist for all  $A,b$ .

* * *

6.2 Uniqueness (depends on  $\ker(A)$ )
---------------------------------------

Suppose  $x^\star$  is a minimizer so  $Ax^\star=p$ .

All  $x$  with  $Ax=p$  form an affine set:

$$
\{x:Ax=p\} = x^\star + \ker(A).
$$

Proof (Module 3 logic):

*   If  $Ax=p$  and  $Ax^\star=p$ , then  $A(x-x^\star)=0\Rightarrow x-x^\star\in\ker(A)$ .
*   Conversely, if  $z\in\ker(A)$ , then  $A(x^\star+z)=Ax^\star+Az=p+0=p$ .

So:

*   If  $\ker(A)=\{0\}$ , then only one minimizer.
*   If  $\ker(A)\neq\{0\}$ , infinitely many minimizers.

Therefore:

$$
\boxed{\text{LS minimizer is unique} \iff \ker(A)=\{0\} \iff A^\top A \succ 0.}
$$

* * *

6.3 Special edge case: exact solvability
----------------------------------------

If  $b\in\mathcal C(A)$ , then there exists  $x$  with  $Ax=b$ . Then minimum residual is 0 and least squares collapses to solving  $Ax=b$ . The normal equations still hold (with  $r=0$ ).

If  $b\notin\mathcal C(A)$ , then residual is nonzero and equals the component of  $b$  in  $\mathcal N(A^\top)$  (because  $\mathbb R^m=\mathcal C(A)\oplus\mathcal N(A^\top)$ ).

* * *

7) The closed-form formula and why it needs a rank condition
============================================================

If  $A$  has full column rank ( $\ker(A)=\{0\}$ ), then  $A^\top A$  is invertible and the normal equations have the unique solution:

 $$
\boxed{\ x^\star = (A^\top A)^{-1}A^\top b. }
$$

If  $A^\top A$  is singular, you **cannot** write this inverse. But:

*   the normal equations  $A^\top A x = A^\top b$  still describe _all_ minimizers,
*   you need pseudoinverse / SVD / QR to compute a specific minimizer stably.

(That’s exactly where Module 7-ish material—QR/SVD—enters.)

* * *

8) Two extremely useful “extra” facts (that you’ll use later in optimization)
=============================================================================

8.1 The normal equations are always consistent (even when  $A^\top A$  is singular)
-----------------------------------------------------------------------------------

This is subtle and important: the system

$$
A^\top A x = A^\top b
$$

always has at least one solution because it _came from an attained minimum_, but you can also see it structurally:

 $\operatorname{im}(A^\top A)\subseteq \operatorname{im}(A^\top)$ .  
And the right-hand side  $A^\top b$  is in  $\operatorname{im}(A^\top)$ .  
So we’re solving inside the correct range. (A full rigorous proof uses the projection theorem equivalence: minimizers exist and satisfy these equations.)

8.2 Projection matrix onto  $\mathcal C(A)$  when columns are independent
-------------------------------------------------------------------------

If  $A$  has full column rank, the orthogonal projector onto  $\mathcal C(A)$  is

 $$
\boxed{\ P = A(A^\top A)^{-1}A^\top. }
$$

Then the projected point is  $p=Pb$ , and the fitted value is  $Ax^\star = Pb$ .

This formula is the algebraic core of linear regression geometry.

* * *

9) End-of-Module 5 checklist (the “if you can’t do these, don’t move on” list)
==============================================================================

You should be able to reproduce, without glossing:

1.  Projection Theorem: **construct**  $p$  from an orthonormal basis; prove  $b-p\in S^\perp$ ; prove uniqueness via  $S\cap S^\perp=\{0\}$ ; prove optimality via Pythagoras.
2.  Least squares as projection:  $Ax^\star = P_{\mathcal C(A)}(b)$ .
3.  Normal equations: derived from  $r\perp \mathcal C(A)$  and  $\mathcal C(A)^\perp=\mathcal N(A^\top)$ .
4.  Gram PSD:  $z^\top X^\top X z = \|Xz\|_2^2\ge 0$ , and PD iff  $\ker(X)=\{0\}$ .
5.  Uniqueness:  $x^\star$  unique iff  $\ker(A)=\{0\}$  iff  $A^\top A\succ 0$ .

* * *

What’s next (Module 6 preview, but in one crisp sentence)
---------------------------------------------------------

Module 6 generalizes “dot product geometry” from vectors to matrices via

$$
\langle X,Y\rangle := \operatorname{tr}(X^\top Y),
$$

so that quadratic forms, Frobenius norms, and SDP objectives  $\langle C,X\rangle$  become the same geometry you just mastered—just one level up.

If you continue, the clean flow is: **matrix inner products → trace tricks → Frobenius norm → gradients of matrix quadratics → PSD cones**.

## Prompt:
Now this:

# Module 6 — Matrix inner products, trace, and Frobenius geometry

*(how to treat matrices like vectors, so SDP and “trace objectives” feel natural)*

## 0) What this module is secretly doing

Later, semidefinite programming (SDP) and conic duality write objectives and constraints like:
[
\langle C,X\rangle \quad \text{and}\quad \langle A_i,X\rangle=b_i,\quad X\succeq 0.
]
If “(\langle C,X\rangle)” looks alien, you’re dead in the water.

Module 6 builds the matrix-version of:

* dot product,
* norms,
* orthogonality,
* linear functionals,

using **trace** as the bridge.

The punchline:
[
\boxed{\ \langle X,Y\rangle_F := \mathrm{tr}(X^\top Y)\ }
]
is the Frobenius inner product, and it makes (\mathbb R^{m\times n}) into a Euclidean space.

---

# 1) Trace: definition and immediate properties

## 1.1 Definition (trace)

For a square matrix (A\in\mathbb R^{n\times n}),
[
\boxed{\ \mathrm{tr}(A) := \sum_{i=1}^n A_{ii}\ }
]
(sum of diagonal entries).

### Basic sanity checks

* (\mathrm{tr}) is defined only for square matrices.
* Trace is a scalar.

## 1.2 Linearity of trace (proved entrywise)

For (A,B\in\mathbb R^{n\times n}) and (\alpha,\beta\in\mathbb R):
[
\mathrm{tr}(\alpha A+\beta B)=\alpha,\mathrm{tr}(A)+\beta,\mathrm{tr}(B).
]

**Proof.**
[
\mathrm{tr}(\alpha A+\beta B)=\sum_i (\alpha A_{ii}+\beta B_{ii})
=\alpha\sum_i A_{ii}+\beta\sum_i B_{ii}
=\alpha,\mathrm{tr}(A)+\beta,\mathrm{tr}(B).
]
∎

---

# 2) Frobenius inner product: definition and why it’s an inner product

## 2.1 Definition

For (X,Y\in\mathbb R^{m\times n}),
[
\boxed{\ \langle X,Y\rangle_F := \mathrm{tr}(X^\top Y)\ }.
]

### Why does this even type-check?

* (X^\top) is (n\times m),
* (Y) is (m\times n),
* so (X^\top Y) is (n\times n) (square), so trace is defined.

## 2.2 Expand it entrywise (important identity)

Claim:
[
\boxed{\ \mathrm{tr}(X^\top Y)=\sum_{i=1}^m\sum_{j=1}^n X_{ij}Y_{ij}\ }.
]

**Proof.**
[
(X^\top Y)*{kk}=\sum*{i=1}^m (X^\top)*{k i}Y*{i k}=\sum_{i=1}^m X_{i k}Y_{i k}.
]
Then
[
\mathrm{tr}(X^\top Y)=\sum_{k=1}^n (X^\top Y)*{kk}
=\sum*{k=1}^n\sum_{i=1}^m X_{i k}Y_{i k}.
]
Rename indices ((i,k)\to (i,j)):
[
=\sum_{i=1}^m\sum_{j=1}^n X_{ij}Y_{ij}.
]
∎

**Interpretation:** Frobenius inner product is just the dot product of all entries.

Equivalently, if (\mathrm{vec}(X)\in\mathbb R^{mn}) stacks entries into a vector, then
[
\langle X,Y\rangle_F = \mathrm{vec}(X)^\top\mathrm{vec}(Y).
]

## 2.3 Prove it’s an inner product (all axioms)

We must check:

### (i) Linearity in first argument

Take (X_1,X_2,Y) and scalars (\alpha,\beta).
[
\langle \alpha X_1+\beta X_2, Y\rangle_F
=\mathrm{tr}((\alpha X_1+\beta X_2)^\top Y)
=\mathrm{tr}(\alpha X_1^\top Y+\beta X_2^\top Y)
]
Use linearity of trace:
[
=\alpha,\mathrm{tr}(X_1^\top Y)+\beta,\mathrm{tr}(X_2^\top Y)
=\alpha\langle X_1,Y\rangle_F+\beta\langle X_2,Y\rangle_F.
]
So linearity holds.

### (ii) Symmetry

[
\langle X,Y\rangle_F=\mathrm{tr}(X^\top Y).
]
But (\mathrm{tr}(X^\top Y)=\mathrm{tr}((X^\top Y)^\top)=\mathrm{tr}(Y^\top X)=\langle Y,X\rangle_F).
So symmetric.

### (iii) Positive definiteness

[
\langle X,X\rangle_F = \mathrm{tr}(X^\top X)=\sum_{i,j} X_{ij}^2 \ge 0.
]
And (\sum_{i,j} X_{ij}^2=0) iff every entry (X_{ij}=0) iff (X=0).
So positive definite.

Therefore (\langle\cdot,\cdot\rangle_F) is an inner product on (\mathbb R^{m\times n}). ∎

---

# 3) Frobenius norm and its relation to trace

## 3.1 Definition (Frobenius norm)

[
\boxed{\ |X|_F := \sqrt{\langle X,X\rangle_F} = \sqrt{\mathrm{tr}(X^\top X)}\ }.
]

Using the entrywise expansion:
[
\boxed{\ |X|*F^2 = \sum*{i=1}^m\sum_{j=1}^n X_{ij}^2\ }.
]

**Interpretation:** it’s the Euclidean length of the matrix treated as a long vector of entries.

---

# 4) Cyclic trace property (the workhorse) — with a careful proof

This is the identity you will use constantly in optimization derivations.

## 4.1 Statement (2-factor version)

If (A\in\mathbb R^{n\times m}) and (B\in\mathbb R^{m\times n}) (so both (AB) and (BA) are square), then
[
\boxed{\ \mathrm{tr}(AB)=\mathrm{tr}(BA)\ }.
]

### Proof (entrywise, no magic)

Compute (\mathrm{tr}(AB)):
[
\mathrm{tr}(AB)=\sum_{i=1}^n (AB)*{ii}
=\sum*{i=1}^n \sum_{k=1}^m A_{ik}B_{k i}.
]
Now compute (\mathrm{tr}(BA)):
[
\mathrm{tr}(BA)=\sum_{k=1}^m (BA)*{kk}
=\sum*{k=1}^m \sum_{i=1}^n B_{k i}A_{i k}.
]
These are the same double sum with indices swapped. Hence equal. ∎

## 4.2 General cyclic property

For conformable matrices (A,B,C) such that the products make sense and the result is square:
[
\boxed{\ \mathrm{tr}(ABC)=\mathrm{tr}(BCA)=\mathrm{tr}(CAB)\ }.
]

**Proof idea:** apply the 2-factor rule repeatedly by grouping:
[
\mathrm{tr}(ABC)=\mathrm{tr}((AB)C)=\mathrm{tr}(C(AB))=\mathrm{tr}(CAB),
]
and similarly rotate again. ∎

**Important warning:** you can cyclically rotate, but you cannot arbitrarily reorder:
(\mathrm{tr}(ABC)\neq \mathrm{tr}(ACB)) in general.

---

# 5) Trace and eigenvalues (the spectral meaning)

This matters for later PSD / SDP facts.

## 5.1 Theorem: (\mathrm{tr}(A)) equals sum of eigenvalues (with multiplicity)

For (A\in\mathbb R^{n\times n}), over (\mathbb C) eigenvalues exist. The theorem is:
[
\boxed{\ \mathrm{tr}(A)=\sum_{i=1}^n \lambda_i(A)\ } \quad\text{(counting algebraic multiplicity)}.
]

**Why this is true (rigorous idea, minimal machinery):**

* The characteristic polynomial is (p(\lambda)=\det(\lambda I-A)).
* When expanded, the coefficient of (\lambda^{n-1}) is (-\mathrm{tr}(A)).
* Also, if eigenvalues are (\lambda_1,\dots,\lambda_n), then
  [
  p(\lambda)=\prod_{i=1}^n (\lambda-\lambda_i)
  =\lambda^n-\left(\sum_i \lambda_i\right)\lambda^{n-1}+\cdots
  ]
* Matching coefficients gives (\sum_i\lambda_i=\mathrm{tr}(A)).

We’ll revisit this again in Module 8 with the spectral theorem when (A) is symmetric, where everything stays real and geometric.

---

# 6) Matrix linear functionals = trace inner products (the SDP language)

A **linear functional** on matrices is a map (L:\mathbb R^{m\times n}\to\mathbb R) that is linear:
[
L(\alpha X+\beta Y)=\alpha L(X)+\beta L(Y).
]

## 6.1 Key fact (finite-dimensional inner product representation)

On an inner product space, every linear functional can be represented as an inner product with a fixed object. Here:

> For every linear functional (L) on (\mathbb R^{m\times n}), there exists a unique matrix (C) such that
> [
> \boxed{\ L(X)=\langle C,X\rangle_F=\mathrm{tr}(C^\top X)\ \ \forall X. }
> ]

You can prove this concretely using the basis matrices (E_{ij}) (1 in entry ((i,j)), 0 elsewhere):

* Any (X=\sum_{i,j} X_{ij}E_{ij}).
* Define (C_{ij}:=L(E_{ij})).
* Then by linearity:
  [
  L(X)=\sum_{i,j} X_{ij}L(E_{ij})=\sum_{i,j} X_{ij}C_{ij}
  =\langle C,X\rangle_F.
  ]

**Why you should care:** This is exactly why SDPs write linear objectives/constraints as (\langle C,X\rangle). It’s not a convention; it’s the canonical coordinate-free way to say “linear in (X).”

---

# 7) Concrete computations / sanity checks

Let
[
X=\begin{pmatrix}1&2\3&4\end{pmatrix},\quad
Y=\begin{pmatrix}5&6\7&8\end{pmatrix}.
]
Compute:

* (X^\top Y=\begin{pmatrix}1&3\2&4\end{pmatrix}\begin{pmatrix}5&6\7&8\end{pmatrix}
  =\begin{pmatrix}26&30\38&44\end{pmatrix})
* (\langle X,Y\rangle_F=\mathrm{tr}(X^\top Y)=26+44=70)
  Check with entrywise dot product:
  [
  \sum_{i,j}X_{ij}Y_{ij}=1\cdot5+2\cdot6+3\cdot7+4\cdot8=5+12+21+32=70.
  ]

Compute Frobenius norm:
[
|X|_F^2=\mathrm{tr}(X^\top X)=1^2+2^2+3^2+4^2=30,\quad |X|_F=\sqrt{30}.
]

---

# 8) End-of-Module 6 checklist (must be automatic)

You can:

1. Expand (\mathrm{tr}(X^\top Y)) into (\sum_{ij} X_{ij}Y_{ij}).
2. Prove Frobenius inner product is an inner product (all axioms).
3. Prove (|X|_F^2=\mathrm{tr}(X^\top X)) and interpret it as sum of squares.
4. Prove cyclic trace: (\mathrm{tr}(AB)=\mathrm{tr}(BA)) (entrywise).
5. Explain why “(\langle C,X\rangle)” is the natural way to write a linear functional in SDPs.

---

## Next module

**Module 7 — Determinant, volume scaling, and log-det geometry.**
We’ll do: (\det(A)=0 \Leftrightarrow) singular (\Leftrightarrow) nontrivial null space, (\det) as volume scaling, and (\log\det) on (S_{++}^n) with the spectral identity (\log\det(X)=\sum_i \log\lambda_i(X)).

## Response:
Thought for 27s

Module 6 — Matrix inner products, trace, and Frobenius geometry
===============================================================

_(treat matrices like vectors, so “ $\langle C,X\rangle$ ” in SDPs becomes obvious instead of occult)_

0) What this module is really building
--------------------------------------

In earlier modules, your basic geometric atoms were:

*   vectors in  $\mathbb R^n$ ,
*   dot product  $x^\top y$ ,
*   norms  $\|x\|$ ,
*   “linear functionals”  $x\mapsto y^\top x$ .

SDPs and matrix optimization do the _same_ game, but with **matrices** as the “points” and **trace** as the tool that turns matrix products into scalars.

The punchline is:

 $$
\boxed{\ \langle X,Y\rangle_F := \operatorname{tr}(X^\top Y)\ }
$$

This makes  $\mathbb R^{m\times n}$  into a genuine Euclidean inner-product space (just like  $\mathbb R^{mn}$ ). Once that’s internalized:

*    $\langle C,X\rangle$  is just “dot product with  $C$ ” (a linear functional),
*   orthogonality, projections, norms, Cauchy–Schwarz all work verbatim,
*   trace tricks become the algebraic engine behind gradients and KKT later.

* * *

1) Trace: definition and “no-magic” properties
==============================================

1.1 Definition
--------------

For a **square** matrix  $A\in\mathbb R^{n\times n}$ ,

 $$
\boxed{\ \operatorname{tr}(A) := \sum_{i=1}^n A_{ii}\ }.
$$*   Only defined for square matrices.
*   Always a scalar.

* * *

1.2 Linearity (proved entrywise)
--------------------------------

For  $A,B\in\mathbb R^{n\times n}$  and  $\alpha,\beta\in\mathbb R$ ,

$$
\operatorname{tr}(\alpha A+\beta B)=\alpha\,\operatorname{tr}(A)+\beta\,\operatorname{tr}(B).
$$

**Proof.**

$$
\operatorname{tr}(\alpha A+\beta B)=\sum_{i=1}^n(\alpha A_{ii}+\beta B_{ii}) =\alpha\sum_{i=1}^nA_{ii}+\beta\sum_{i=1}^nB_{ii}.
$$

∎

* * *

1.3 Trace is invariant under transpose
--------------------------------------

 $$
\boxed{\ \operatorname{tr}(A)=\operatorname{tr}(A^\top)\ }.
$$

**Proof.**  $\operatorname{tr}(A^\top)=\sum_i (A^\top)_{ii}=\sum_i A_{ii}=\operatorname{tr}(A)$ . ∎

This is small but shows up everywhere.

* * *

2) Frobenius inner product: definition + entrywise identity
===========================================================

2.1 Definition (type-check carefully)
-------------------------------------

For  $X,Y\in\mathbb R^{m\times n}$ ,

 $$
\boxed{\ \langle X,Y\rangle_F := \operatorname{tr}(X^\top Y)\ }.
$$

Type-check:

*    $X^\top\in\mathbb R^{n\times m}$ ,
*    $X^\top Y\in\mathbb R^{n\times n}$  (square),
*   so  $\operatorname{tr}(X^\top Y)$  is defined.

So this works for **rectangular** matrices too.

* * *

2.2 Expand  $\operatorname{tr}(X^\top Y)$  entrywise
----------------------------------------------------

 $$
\boxed{\ \operatorname{tr}(X^\top Y)=\sum_{i=1}^m\sum_{j=1}^n X_{ij}Y_{ij}\ }.
$$

**Proof (no shortcuts).**  
First compute the  $(k,k)$ \-entry of  $X^\top Y$ :

$$
(X^\top Y)_{kk}=\sum_{i=1}^m (X^\top)_{k i}\,Y_{i k} =\sum_{i=1}^m X_{i k}Y_{i k}.
$$

Now trace sums diagonal entries:

$$
\operatorname{tr}(X^\top Y)=\sum_{k=1}^n (X^\top Y)_{kk} =\sum_{k=1}^n\sum_{i=1}^m X_{ik}Y_{ik}.
$$

Rename  $k\to j$ :

$$
=\sum_{i=1}^m\sum_{j=1}^n X_{ij}Y_{ij}.
$$

∎

**Interpretation:** it’s literally the dot product of the matrices treated as long vectors of their entries.

* * *

2.3 The standard matrix basis is orthonormal under  $\langle\cdot,\cdot\rangle_F$ 
----------------------------------------------------------------------------------

Let  $E_{ij}\in\mathbb R^{m\times n}$  be the matrix with a 1 in entry  $(i,j)$  and 0 elsewhere.

Then

 $$
\boxed{\ \langle E_{ij},E_{k\ell}\rangle_F=\delta_{ik}\delta_{j\ell}\ }.
$$

**Proof.** Entrywise formula gives:

$$
\langle E_{ij},E_{k\ell}\rangle_F=\sum_{a=1}^m\sum_{b=1}^n (E_{ij})_{ab}(E_{k\ell})_{ab}.
$$

Only the  $(a,b)=(i,j)$  term of  $E_{ij}$  is nonzero (and equals 1), so this becomes  $(E_{k\ell})_{ij}$ , which is 1 iff  $(k,\ell)=(i,j)$  and 0 otherwise. ∎

This is the matrix analogue of the standard basis  $e_i$  being orthonormal in  $\mathbb R^n$ .

* * *

3) Prove Frobenius is an inner product (all axioms)
===================================================

We must verify on  $\mathbb R^{m\times n}$ :

1.  linearity in the first argument
2.  symmetry
3.  positive definiteness

3.1 Linearity in first argument
-------------------------------

For  $X_1,X_2,Y$  and scalars  $\alpha,\beta$ ,

$$
\langle \alpha X_1+\beta X_2,\,Y\rangle_F =\alpha\langle X_1,Y\rangle_F+\beta\langle X_2,Y\rangle_F.
$$

**Proof.**

$$
\langle \alpha X_1+\beta X_2, Y\rangle_F =\operatorname{tr}((\alpha X_1+\beta X_2)^\top Y) =\operatorname{tr}(\alpha X_1^\top Y+\beta X_2^\top Y)
$$

and by trace linearity this is

$$
=\alpha\operatorname{tr}(X_1^\top Y)+\beta\operatorname{tr}(X_2^\top Y).
$$

∎

(Linearity in the second argument follows similarly or from symmetry + first linearity.)

* * *

3.2 Symmetry
------------

$$
\langle X,Y\rangle_F=\langle Y,X\rangle_F.
$$

**Proof.**

$$
\langle X,Y\rangle_F=\operatorname{tr}(X^\top Y) =\operatorname{tr}((X^\top Y)^\top) =\operatorname{tr}(Y^\top X)=\langle Y,X\rangle_F,
$$

using  $\operatorname{tr}(M)=\operatorname{tr}(M^\top)$ . ∎

* * *

3.3 Positive definiteness
-------------------------

$$
\langle X,X\rangle_F \ge 0,\quad \text{and } \langle X,X\rangle_F=0 \iff X=0.
$$

**Proof.**

$$
\langle X,X\rangle_F=\operatorname{tr}(X^\top X)=\sum_{i,j}X_{ij}^2 \ge 0.
$$

The sum of squares equals 0 iff every  $X_{ij}=0$ , i.e.  $X=0$ . ∎

So  $\langle\cdot,\cdot\rangle_F$  is a valid inner product. ∎

* * *

4) Frobenius norm and its geometry
==================================

4.1 Definition
--------------

 $$
\boxed{\ \|X\|_F := \sqrt{\langle X,X\rangle_F} = \sqrt{\operatorname{tr}(X^\top X)}\ }.
$$

Using the entrywise identity:

 $$
\boxed{\ \|X\|_F^2=\sum_{i=1}^m\sum_{j=1}^n X_{ij}^2\ }.
$$

So  $\|X\|_F$  is the Euclidean length of the  $mn$ \-dimensional vector of entries.

* * *

4.2 Cauchy–Schwarz for Frobenius (you’ll use this constantly)
-------------------------------------------------------------

 $$
\boxed{\ |\langle X,Y\rangle_F|\le \|X\|_F\|Y\|_F. }
$$

**Proof idea (cleanest):** use entrywise identity and ordinary Cauchy–Schwarz in  $\mathbb R^{mn}$ .  
Let  $x=\mathrm{vec}(X)$ ,  $y=\mathrm{vec}(Y)$ . Then

$$
\langle X,Y\rangle_F = x^\top y,\quad \|X\|_F=\|x\|_2,\quad \|Y\|_F=\|y\|_2,
$$

so the inequality follows immediately. ∎

(If you want it without  $\mathrm{vec}$ , you can run the standard quadratic-discriminant proof with  $\|X+tY\|_F^2\ge0$ . Same logic as vector case.)

* * *

4.3 Orthogonal invariance (crucial for SVD later)
-------------------------------------------------

If  $U\in\mathbb R^{m\times m}$  and  $V\in\mathbb R^{n\times n}$  are **orthogonal** ( $U^\top U=I,\ V^\top V=I$ ), then

 $$
\boxed{\ \|UXV\|_F=\|X\|_F\ } \quad \text{and} \quad \boxed{\ \langle UXV, UYV\rangle_F=\langle X,Y\rangle_F. }
$$

**Proof.**

$$
\langle UXV, UYV\rangle_F =\operatorname{tr}((UXV)^\top (UYV)) =\operatorname{tr}(V^\top X^\top U^\top U Y V) =\operatorname{tr}(V^\top X^\top Y V).
$$

Now use cyclic trace (proved soon):  $\operatorname{tr}(V^\top X^\top Y V)=\operatorname{tr}(X^\top Y V V^\top)=\operatorname{tr}(X^\top Y)$ .  
Thus inner products are preserved, and setting  $Y=X$  gives norm preservation. ∎

Geometric meaning: multiplying on left/right by orthogonal matrices is a “rotation/reflection” in matrix-space.

* * *

5) Cyclic trace property (the workhorse), proved carefully
==========================================================

5.1 Two-factor cyclicity
------------------------

If  $A\in\mathbb R^{n\times m}$ ,  $B\in\mathbb R^{m\times n}$  (so both  $AB$  and  $BA$  are square), then:

 $$
\boxed{\ \operatorname{tr}(AB)=\operatorname{tr}(BA)\ }.
$$

**Proof (entrywise).**

$$
\operatorname{tr}(AB)=\sum_{i=1}^n (AB)_{ii} =\sum_{i=1}^n\sum_{k=1}^m A_{ik}B_{k i}.
$$

Also

$$
\operatorname{tr}(BA)=\sum_{k=1}^m (BA)_{kk} =\sum_{k=1}^m\sum_{i=1}^n B_{k i}A_{i k}.
$$

These are identical double sums with dummy indices swapped. ∎

* * *

5.2 General cyclicity (rotate, don’t reorder)
---------------------------------------------

For conformable matrices  $A,B,C$  such that  $ABC$  is square:

 $$
\boxed{\ \operatorname{tr}(ABC)=\operatorname{tr}(BCA)=\operatorname{tr}(CAB)\ }.
$$

**Proof.** Group as  $\operatorname{tr}((AB)C)$  and apply the 2-factor rule with  $(AB)$  and  $C$ :

$$
\operatorname{tr}((AB)C)=\operatorname{tr}(C(AB))=\operatorname{tr}(CAB).
$$

Rotate again similarly to get  $\operatorname{tr}(BCA)$ . ∎

**Warning (important):** cyclic rotation is allowed; arbitrary permutation is not. In general,

$$
\operatorname{tr}(ABC)\neq \operatorname{tr}(ACB).
$$

* * *

5.3 Similarity invariance (one of the most useful corollaries)
--------------------------------------------------------------

If  $P$  is invertible, then

 $$
\boxed{\ \operatorname{tr}(P^{-1}AP)=\operatorname{tr}(A)\ }.
$$

**Proof.** Use cyclicity:

$$
\operatorname{tr}(P^{-1}AP)=\operatorname{tr}(AP P^{-1})=\operatorname{tr}(A).
$$

∎

This is why trace is a spectral quantity: it doesn’t depend on the basis.

* * *

6) Trace and eigenvalues (what trace _means_ spectrally)
========================================================

6.1 Statement
-------------

For any  $A\in\mathbb R^{n\times n}$ , its eigenvalues  $\lambda_1,\dots,\lambda_n$  (over  $\mathbb C$ , counting algebraic multiplicity) satisfy

 $$
\boxed{\ \operatorname{tr}(A)=\sum_{i=1}^n \lambda_i(A)\ }.
$$

6.2 Why it’s true (coefficient-matching via characteristic polynomial)
----------------------------------------------------------------------

Define the characteristic polynomial:

$$
p(\lambda)=\det(\lambda I-A).
$$

Fact from determinant expansion (standard, but not “magic”):  
 $p(\lambda)$  is a monic polynomial of degree  $n$ , and the coefficient of  $\lambda^{n-1}$  equals  $-\operatorname{tr}(A)$ .  
(You can verify this by expanding  $\det(\lambda I-A)$  as a polynomial: the  $\lambda^{n-1}$  term comes from choosing  $\lambda$  from all but one diagonal entry and choosing the  $-A_{ii}$  term once; summing over  $i$  yields  $-\sum_i A_{ii}$ .)

On the other hand, eigenvalues satisfy

$$
p(\lambda)=\prod_{i=1}^n (\lambda-\lambda_i) =\lambda^n-\left(\sum_i \lambda_i\right)\lambda^{n-1}+\cdots
$$

by expanding the product.

Matching coefficients of  $\lambda^{n-1}$  gives

$$
-\operatorname{tr}(A)=-\sum_i \lambda_i \quad\Rightarrow\quad \operatorname{tr}(A)=\sum_i \lambda_i.
$$

∎

**Special case (symmetric  $A$ ):** all eigenvalues are real, and the statement becomes fully real-geometric. This will become very tangible once we do the spectral theorem.

* * *

7) Matrix linear functionals = trace inner products (the SDP language)
======================================================================

This is the “why SDPs write  $\langle C,X\rangle$ ” theorem.

7.1 Definition: linear functional on matrices
---------------------------------------------

A map  $L:\mathbb R^{m\times n}\to\mathbb R$  is linear if

$$
L(\alpha X+\beta Y)=\alpha L(X)+\beta L(Y).
$$

7.2 Representation theorem (concrete, no abstract Riesz required)
-----------------------------------------------------------------

> For every linear functional  $L$  on  $\mathbb R^{m\times n}$ , there exists a **unique** matrix  $C\in\mathbb R^{m\times n}$  such that
> 
>  $$
> \boxed{\ L(X)=\langle C,X\rangle_F=\operatorname{tr}(C^\top X)\quad \forall X. }
> $$

### Existence proof (build  $C$  from values on basis matrices)

Use the basis  $E_{ij}$ . Any  $X$  decomposes as

$$
X=\sum_{i=1}^m\sum_{j=1}^n X_{ij}E_{ij}.
$$

By linearity of  $L$ ,

$$
L(X)=\sum_{i,j} X_{ij}L(E_{ij}).
$$

Define  $C$  by  $C_{ij}:=L(E_{ij})$ . Then

$$
L(X)=\sum_{i,j} X_{ij}C_{ij}.
$$

But from the entrywise Frobenius identity,

$$
\langle C,X\rangle_F=\sum_{i,j}C_{ij}X_{ij}.
$$

So  $L(X)=\langle C,X\rangle_F$ . Existence done. ∎

### Uniqueness proof

Suppose  $\langle C,X\rangle_F=\langle D,X\rangle_F$  for all  $X$ . Then  $\langle C-D,X\rangle_F=0$  for all  $X$ . Take  $X=C-D$ :

$$
0=\langle C-D, C-D\rangle_F = \|C-D\|_F^2.
$$

So  $C-D=0\Rightarrow C=D$ . ∎

**Why this matters for SDPs:**  
Constraints  $\langle A_i,X\rangle=b_i$  are just linear equations in the entries of  $X$ , written in a basis-free way. The objective  $\langle C,X\rangle$  is “maximize a linear functional.”

* * *

8) A few trace/Frobenius identities you should be able to derive instantly
==========================================================================

These are the “algebraic moves” you’ll keep using.

8.1 Quadratic forms as trace (key for SDPs)
-------------------------------------------

For  $x\in\mathbb R^n$ ,  $A\in\mathbb R^{n\times n}$ ,

 $$
\boxed{\ x^\top A x = \operatorname{tr}(A\,xx^\top)\ }.
$$

**Proof.**

$$
\operatorname{tr}(Axx^\top)=\operatorname{tr}(x^\top A x)=x^\top A x
$$

More explicitly:  $x^\top A x$  is a  $1\times1$  matrix; its trace is itself; cyclicity moves factors. ∎

This is one of the main bridges from vector optimization to SDP formulations (because  $xx^\top\succeq 0$  and has rank 1).

8.2 Frobenius norm via columns (or rows)
----------------------------------------

If  $X=[x_1\ \cdots\ x_n]$  with columns  $x_j\in\mathbb R^m$ , then

 $$
\boxed{\ \|X\|_F^2=\sum_{j=1}^n \|x_j\|_2^2\ }.
$$

Same for rows. It’s just regrouping  $\sum_{i,j}X_{ij}^2$ .

* * *

9) Concrete computation (sanity check)
======================================

Let

$$
X=\begin{pmatrix}1&2\\3&4\end{pmatrix},\quad Y=\begin{pmatrix}5&6\\7&8\end{pmatrix}.
$$

Compute  $X^\top Y$ :

$$
X^\top Y= \begin{pmatrix}1&3\\2&4\end{pmatrix} \begin{pmatrix}5&6\\7&8\end{pmatrix} = \begin{pmatrix}26&30\\38&44\end{pmatrix}.
$$

So

$$
\langle X,Y\rangle_F=\operatorname{tr}(X^\top Y)=26+44=70.
$$

Check entrywise:

$$
\sum_{i,j}X_{ij}Y_{ij} =1\cdot5+2\cdot6+3\cdot7+4\cdot8 =5+12+21+32=70.
$$

Frobenius norm:

$$
\|X\|_F^2=\sum_{i,j}X_{ij}^2=1+4+9+16=30,\quad \|X\|_F=\sqrt{30}.
$$

* * *

10) End-of-Module 6 checklist (no mercy)
========================================

You should be able to do these _cold_:

1.  Prove  $\operatorname{tr}(X^\top Y)=\sum_{i,j}X_{ij}Y_{ij}$ .
2.  Prove  $\langle\cdot,\cdot\rangle_F$  satisfies all inner product axioms.
3.  Prove cyclic trace  $\operatorname{tr}(AB)=\operatorname{tr}(BA)$  entrywise, and extend to rotations.
4.  Explain why any linear functional  $L(X)$  must be  $\langle C,X\rangle_F$  for a unique  $C$ .
5.  Translate  $x^\top A x$  into a trace expression and explain why that’s SDP-friendly.

* * *

Next module (natural continuation)
----------------------------------

**Module 7 — Determinant, volume scaling, and log-det geometry**:  
 $\det$  as “volume multiplier,”  $\det(A)=0 \Leftrightarrow$  singular, and  $\log\det(X)$  on  $S_{++}^n$  (where convexity/concavity of  $\log\det$  becomes a flagship example in convex optimization).

## Prompt:
Now this:

# Module 7 — Determinant, volume, and log-det geometry

*(why (\det) is not “random,” and why (\log\det) is a convex-optimization celebrity)*

## 0) What this module is secretly doing

Determinant is the bridge between:

* **algebra** (invertibility, solving linear systems),
* **geometry** (volume scaling and orientation),
* **spectral structure** (eigenvalues),
* **convex optimization** (the (\log\det) barrier for SDP / covariance estimation).

If you internalize just one sentence, make it this:

> A linear map (A) scales (n)-dimensional volume by (|\det(A)|), and it collapses volume to 0 exactly when it squashes some nonzero direction to 0 (i.e., is singular).

---

# 1) Determinant: definition (no handwaving)

Everything that follows depends on what determinant *is*. There are multiple equivalent definitions; I’ll pick one that is explicit and then derive properties from it.

## 1.1 Determinant via the Leibniz (permutation) formula

For (A\in\mathbb R^{n\times n}),
[
\boxed{\ \det(A) := \sum_{\sigma\in S_n} \mathrm{sgn}(\sigma)\prod_{i=1}^n a_{i,\sigma(i)}\ }
]
where:

* (S_n) is the set of all permutations of ({1,\dots,n}),
* (\mathrm{sgn}(\sigma)\in{+1,-1}) is the sign of the permutation (even/odd number of swaps).

This definition is “brute force,” but it’s unambiguous and lets us prove facts cleanly.

### Sanity checks

* If (A) is diagonal with diagonal entries (d_1,\dots,d_n), only the identity permutation contributes, so:
  [
  \det(A)=\prod_{i=1}^n d_i.
  ]
* For (I), all diagonal entries are 1, so (\det(I)=1).

---

# 2) Determinant algebra: the three core structural properties

From the Leibniz formula you can prove these (I’ll do the important ones carefully).

## 2.1 Multilinearity in columns (linear in each column separately)

Let (A=[c_1,\cdots,c_n]) where (c_j\in\mathbb R^n) is the (j)-th column.

Fix all columns except column (j). Then (\det(A)) is a linear function of (c_j).

### Proof (sketch but still rigorous)

In the Leibniz formula, each term picks exactly one entry from each column. If you change only column (j), then in each product (\prod_i a_{i,\sigma(i)}) only one factor comes from column (j) (the row index depends on (\sigma)). Thus the whole sum is linear in that column’s entries. Formally, if (c_j = u+v), the entries in column (j) satisfy (a_{i,j} = u_i+v_i), and distributivity splits the determinant into (\det(\cdots,u,\cdots)+\det(\cdots,v,\cdots)). Scaling similarly pulls out. ∎

## 2.2 Alternating property (swap two columns flips sign; equal columns ⇒ determinant 0)

* If you swap two columns of (A), determinant changes sign.
* If two columns are equal, (\det(A)=0).

### Proof of “swap flips sign”

Swapping two columns corresponds to composing each permutation (\sigma) with a transposition, which flips (\mathrm{sgn}(\sigma)). Products match term-by-term except for sign. ∎

### Proof of “equal columns ⇒ 0”

If columns (j) and (k) are identical, swapping them leaves (A) unchanged. But swapping columns flips the sign of (\det). Hence (\det(A)=-\det(A)), so (\det(A)=0). ∎

## 2.3 Normalization (\det(I)=1)

Already checked above.

**Commentary (why these three matter):**
These three properties (multilinear + alternating + (\det(I)=1)) uniquely characterize the determinant. It’s not an arbitrary gadget; it’s the unique “oriented volume” functional compatible with linearity.

---

# 3) Determinant and singularity: (\det(A)=0) iff (A) is singular

This is one of the most important equivalences in all of linear algebra.

## Theorem

For (A\in\mathbb R^{n\times n}),
[
\boxed{\ \det(A)=0 \iff A\ \text{is singular} \iff \ker(A)\neq{0}. }
]

We’ll prove it in two logically clean steps:

1. (\det(A)=0 \iff) columns are linearly dependent.
2. columns dependent (\iff) (\ker(A)\neq{0}) (\iff) singular.

---

## 3.1 Lemma: (\det(A)=0) iff columns are linearly dependent

### ((\Leftarrow)) Dependent columns ⇒ determinant 0

If columns are dependent, some column is a linear combination of others. WLOG suppose
[
c_1=\sum_{j=2}^n \alpha_j c_j.
]
Use multilinearity in the first column:
[
\det(c_1,c_2,\dots,c_n)=\det!\left(\sum_{j=2}^n \alpha_j c_j,,c_2,\dots,c_n\right)
=\sum_{j=2}^n \alpha_j \det(c_j,c_2,\dots,c_n).
]
But in (\det(c_j,c_2,\dots,c_n)), the first column equals column (j) (because column 1 is (c_j) and column (j) is also (c_j)), so two columns are identical ⇒ that determinant is 0 by the alternating property. Therefore the whole sum is 0, hence (\det(A)=0). ∎

### ((\Rightarrow)) Determinant 0 ⇒ dependent columns

This direction is a bit subtler; here is a standard rigorous route:

If columns were independent, then they form a basis of (\mathbb R^n). Consider the linear map (T(x)=Ax). In the basis of standard unit vectors, the columns of (A) are exactly (Ae_1,\dots,Ae_n). If those are independent, then (T) is injective (because (Ax=0) would force (x=0)), hence bijective in finite dimensions, hence invertible.

Now we use a fundamental determinant fact (which follows from the uniqueness characterization above and can be proven from the Leibniz formula):

> If (A) is invertible, then (\det(A)\neq 0).

I’ll justify this concretely using the inverse and multiplicativity (next subsection): if (A) has an inverse, then (AA^{-1}=I). Taking determinants gives (\det(A)\det(A^{-1})=\det(I)=1), so (\det(A)\neq 0). (So once we prove multiplicativity, this direction is locked in.)

So: if columns independent ⇒ (A) invertible ⇒ (\det(A)\neq 0). Contrapositive gives: (\det(A)=0) ⇒ columns dependent. ∎

> If you want this direction without using multiplicativity, we can do it purely from row-reduction + determinant effect of elementary operations; it reaches the same conclusion: dependent columns row-reduce to a matrix with a zero row ⇒ determinant 0.

---

## 3.2 Lemma: columns dependent ⇔ (\ker(A)\neq{0})

Columns dependent means there exists (\alpha\neq 0) with
[
\sum_{j=1}^n \alpha_j c_j = 0.
]
But (\sum_{j=1}^n \alpha_j c_j = A\alpha) (column combination interpretation). So this is:
[
A\alpha = 0\quad\text{with}\quad \alpha\neq 0,
]
i.e. (\alpha\in\ker(A)\setminus{0}). Hence (\ker(A)\neq{0}). Conversely, if (\ker(A)\neq{0}), pick (\alpha\neq 0) with (A\alpha=0), which is exactly a nontrivial dependence among columns. ∎

Combine the lemmas ⇒ the theorem. ∎

**Intuition:**
(\det(A)=0) means “(A) collapses (n)-dimensional volume to zero,” which can only happen if some nonzero direction gets squashed to 0.

---

# 4) Multiplicativity: (\det(AB)=\det(A)\det(B))

This fact is extremely powerful (and used constantly).

## Theorem

If (A,B\in\mathbb R^{n\times n}),
[
\boxed{\ \det(AB)=\det(A)\det(B). }
]

### Proof idea (high-level but correct)

There are many proofs. Here’s a conceptually clean one using the “uniqueness characterization” of determinant (multilinear + alternating + normalized).

Define a function (f(A)=\det(AB)) as a function of the columns of (A) (with (B) fixed). The mapping (A\mapsto AB) is linear in each column of (A) (since ((AB)*{:j}=A(B*{:j})) is a linear combination of columns of (A)). One can show (f) is multilinear and alternating in columns of (A). Also (f(I)=\det(B)). By uniqueness, (f(A)=\det(B)\det(A)). That is exactly (\det(AB)=\det(A)\det(B)). ∎

**Immediate corollaries:**

* If (A) invertible, (\det(A^{-1})=\frac{1}{\det(A)}).
* (\det(A)\neq 0) iff (A) invertible.
* (\det(A^\top)=\det(A)) (true from Leibniz too; also from multiplicativity + orthogonal similarity arguments).

---

# 5) Determinant as volume scaling (the geometric meaning)

This is where determinant becomes inevitable instead of mystical.

## 5.1 Parallelepiped volume (the key geometric object)

Given vectors (v_1,\dots,v_n\in\mathbb R^n), form the parallelepiped
[
P(v_1,\dots,v_n)=\left{\sum_{i=1}^n t_i v_i : t_i\in[0,1]\right}.
]
Let (A=[v_1,\cdots,v_n]). Then this parallelepiped is exactly (A) applied to the unit cube ([0,1]^n).

### Theorem (volume of a parallelepiped)

[
\boxed{\ \mathrm{Vol}(P(v_1,\dots,v_n)) = |\det(A)|. }
]
The sign of (\det(A)) encodes orientation (whether the basis preserves or flips “handedness”).

**Why this is plausible (intuition):**

* If you scale one vector by (\alpha), volume scales by (|\alpha|) → matches multilinearity.
* If two vectors become equal, shape becomes flat → volume 0 → matches alternating property.
* For the unit cube (columns are standard basis), volume (1) → matches (\det(I)=1).

This uniquely pins down volume scaling, so determinant must be the algebraic form of that scaling.

## 5.2 Volume scaling of general sets (conceptual statement)

For a linear map (x\mapsto Ax), (n)-dimensional volume scales by (|\det(A)|):
[
\mathrm{Vol}(A(S)) = |\det(A)|,\mathrm{Vol}(S)
]
for measurable (S\subset\mathbb R^n). (This is a standard result from change-of-variables in multivariable calculus; we’ll treat it as “known once you accept Jacobians.”)

**Edge cases:**

* If (\det(A)=0), (A) collapses volume to 0 (outputs live in a lower-dimensional subspace).
* If (|\det(A)|>1), volumes expand; if (<1), volumes shrink.
* If (\det(A)<0), orientation flips (reflection-like behavior).

---

# 6) Determinant and eigenvalues (spectral meaning)

Now we connect determinant to the spectrum.

## 6.1 For triangular matrices

If (T) is upper (or lower) triangular, then
[
\boxed{\ \det(T)=\prod_{i=1}^n T_{ii}. }
]
This follows directly from the Leibniz formula: only the identity permutation contributes without hitting zeros below/above the diagonal.

## 6.2 For diagonalizable matrices (especially symmetric)

If (A=V\Lambda V^{-1}), then by multiplicativity:
[
\det(A)=\det(V)\det(\Lambda)\det(V^{-1})=\det(\Lambda).
]
So
[
\boxed{\ \det(A)=\prod_{i=1}^n \lambda_i(A)\ }
]
(again counting multiplicity), because (\det(\Lambda)=\prod_i \lambda_i).

### Special clean case: symmetric (A)

If (A) is real symmetric, spectral theorem says (A=Q\Lambda Q^\top) with (Q) orthogonal. Then
[
\det(A)=\det(Q)\det(\Lambda)\det(Q^\top)=\det(\Lambda)
]
since (\det(Q^\top)=\det(Q)) and (\det(Q)^2=1). So the product formula is especially clean here.

---

# 7) Log-det: definition, domain, and spectral formula

## 7.1 Domain honesty

(\log\det(X)) as a real number only makes sense when (\det(X)>0).

In convex optimization, we usually apply (\log\det) to **symmetric positive definite** matrices:
[
X\in \mathbf S_{++}^n \quad(\text{symmetric and } X\succ 0).
]
For such (X), all eigenvalues are strictly positive, hence (\det(X)>0).

So:
[
\boxed{\ \log\det(X)\ \text{is well-defined for } X\succ 0. }
]

If (X\succeq 0) but singular, then (\det(X)=0) and (\log\det(X)=-\infty) in the extended-value sense.

## 7.2 Spectral formula for SPD matrices

Let (X\in\mathbf S_{++}^n). By spectral theorem:
[
X=Q\Lambda Q^\top,\quad \Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n),\ \lambda_i>0.
]
Then:
[
\det(X)=\det(\Lambda)=\prod_{i=1}^n \lambda_i
]
and therefore:
[
\boxed{\ \log\det(X)=\sum_{i=1}^n \log \lambda_i(X). }
]

**Geometric meaning:**
(\det(X)) is the volume scaling of the linear map (x\mapsto Xx). Taking log turns products into sums, so (\log\det) is “additive volume scaling across principal axes.”

---

# 8) (Important) Concavity of (\log\det) on (\mathbf S_{++}^n)

You said “go deep,” so here’s the core calculus fact that makes (-\log\det) the canonical barrier.

## 8.1 Jacobi’s formula (derivative of determinant)

Let (X(t)) be differentiable and invertible. Then
[
\boxed{\ \frac{d}{dt}\det(X(t))=\det(X(t))\ \mathrm{tr}!\big(X(t)^{-1}X'(t)\big). }
]
From this:
[
\boxed{\ \frac{d}{dt}\log\det(X(t))=\mathrm{tr}!\big(X(t)^{-1}X'(t)\big). }
]
(Just divide by (\det(X(t))).)

*Proof idea (rigorous route):* use the adjugate matrix (\mathrm{adj}(X)) satisfying (X,\mathrm{adj}(X)=\det(X)I), differentiate both sides, take traces, and rearrange. This is standard and fully rigorous.

## 8.2 Second derivative along a line ⇒ concavity

Take a line in matrix space:
[
X(t)=X+tH,\quad X\succ 0,\ H=H^\top,
]
for (t) in an interval where (X(t)\succ 0).

We have (X'(t)=H). So
[
\frac{d}{dt}\log\det(X(t))=\mathrm{tr}(X(t)^{-1}H).
]
Differentiate again. Use the identity
[
\frac{d}{dt}X(t)^{-1} = -X(t)^{-1}X'(t)X(t)^{-1} = -X(t)^{-1}HX(t)^{-1}.
]
Therefore:
[
\frac{d^2}{dt^2}\log\det(X(t))
= \mathrm{tr}!\left(\frac{d}{dt}(X(t)^{-1})H\right)
= \mathrm{tr}!\left(-X(t)^{-1}HX(t)^{-1}H\right).
]
Now set (M = X(t)^{-1/2} H X(t)^{-1/2}) (symmetric if (H) is symmetric). Then
[
X(t)^{-1}H X(t)^{-1}H
= X(t)^{-1/2}, M, X(t)^{-1/2}, X(t)^{-1/2}, M, X(t)^{-1/2}
= X(t)^{-1/2} M^2 X(t)^{-1/2}.
]
Using cyclic trace (Module 6):
[
\mathrm{tr}(X(t)^{-1}H X(t)^{-1}H)=\mathrm{tr}(M^2).
]
But (M^2\succeq 0) so (\mathrm{tr}(M^2)\ge 0). Hence:
[
\boxed{\ \frac{d^2}{dt^2}\log\det(X(t)) = -\mathrm{tr}(M^2)\le 0. }
]
So (\log\det) is concave along every line in (\mathbf S_{++}^n), i.e. concave on (\mathbf S_{++}^n).

Therefore:
[
\boxed{\ \log\det \text{ is concave on } \mathbf S_{++}^n,\quad -\log\det \text{ is convex.} }
]

**Why you should care later:**
(-\log\det(X)) blows up as (X) approaches singularity, so it’s a perfect barrier that keeps iterates inside (X\succ 0) (interior-point methods, log-barrier, etc.).

---

# 9) End-of-Module 7 checklist

You can proceed only if you can do these cleanly:

1. State the Leibniz definition of (\det) and extract: multilinearity + alternating + (\det(I)=1).
2. Prove: dependent columns ⇒ (\det=0) (using multilinearity + alternating).
3. Prove: (\ker(A)\neq{0}) ⇔ columns dependent ⇔ singular ⇔ (\det=0).
4. Explain (|\det(A)|) as volume scaling and sign as orientation.
5. For (X\succ 0), prove (\log\det(X)=\sum_i\log\lambda_i(X)).
6. Understand (at least line-wise) why (\log\det) is concave and (-\log\det) convex.

---

## Next module

**Module 8 — Eigenvalues, spectral theorem, PSD order, and quadratic forms.**
That’s where “(x^\top Px\ge 0)” becomes “(P\succeq 0), eigenvalues (\ge 0), curvature (\ge 0), Rayleigh quotient bounds,” and it ties directly into convexity via Hessians.

## Response:
Module 7 — Determinant, volume, and log-det geometry
====================================================

_(why  $\det$  is not “random,” and why  $\log\det$  is a convex-optimization celebrity)_

0) What this module is secretly doing
-------------------------------------

Determinant is the bridge between four worlds:

1.  **Algebra:** invertibility, solvability of  $Ax=b$ 
2.  **Geometry:** volume scaling + orientation of linear maps
3.  **Spectrum:** eigenvalues (products / sums of logs)
4.  **Optimization:** the  $-\log\det$  barrier on  $S_{++}^n$ 

The one-sentence core:

$$
\boxed{\text{A linear map }A\text{ scales }n\text{-dimensional volume by }|\det(A)|,\text{ and } \det(A)=0 \iff A\text{ collapses some nonzero direction.}}
$$

* * *

1) Determinant: definition (no handwaving)
==========================================

There are many equivalent definitions (Laplace expansion, volume characterization, exterior algebra, etc.). For “no gaps,” we pick a brutally explicit one.

1.1 Leibniz (permutation) formula
---------------------------------

For  $A=(a_{ij})\in\mathbb R^{n\times n}$ ,

 $$
\boxed{\ \det(A) := \sum_{\sigma\in S_n} \operatorname{sgn}(\sigma)\prod_{i=1}^n a_{i,\sigma(i)}\ }
$$

where:

*    $S_n$ : all permutations  $\sigma:\{1,\dots,n\}\to\{1,\dots,n\}$ 
*    $\operatorname{sgn}(\sigma)\in\{+1,-1\}$ :  $+1$  for even permutations,  $-1$  for odd (parity = number of swaps mod 2)

### Sanity checks you should be able to do instantly

**(a) Diagonal matrix**  $D=\operatorname{diag}(d_1,\dots,d_n)$ .  
If  $\sigma\neq \text{id}$ , then some  $i$  has  $\sigma(i)\neq i$ , so  $d_{i,\sigma(i)}=0$ . Hence only identity permutation contributes:

$$
\det(D)=\prod_{i=1}^n d_i.
$$

**(b) Identity matrix**  $I$ .  
Same argument:  $\det(I)=1$ .

* * *

2) The three structural properties (and why they are everything)
================================================================

These are the “axioms” that make determinant a _geometric_ object.

Let  $A=[c_1\ \cdots\ c_n]$  with columns  $c_j\in\mathbb R^n$ .

2.1 Multilinearity in columns
-----------------------------

Fix all columns except column  $j$ . Then  $\det(A)$  is a **linear** function of  $c_j$ .

### Proof (from Leibniz, genuinely)

Look at a single Leibniz term:

$$
\operatorname{sgn}(\sigma)\prod_{i=1}^n a_{i,\sigma(i)}.
$$

Each term chooses exactly one entry from each **column**: column  $\sigma(i)$  is picked at row  $i$ . So if we vary only column  $j$ , then in each product only the factor corresponding to the unique  $i$  with  $\sigma(i)=j$  changes; everything else is fixed. Thus each product is linear in the entries of column  $j$ , and sums of linear expressions are linear.

Formally, if  $c_j=u+v$ , then every  $a_{i,j}$  becomes  $u_i+v_i$ , and each term splits by distributivity into “all  $u$ ” plus “all  $v$ .” Same for scalar scaling. ∎

* * *

2.2 Alternating property: swap two columns flips sign; equal columns force zero
-------------------------------------------------------------------------------

### (a) Swapping two columns flips sign

Let  $A'$  be  $A$  with columns  $j$  and  $k$  swapped. Then

$$
\boxed{\det(A')=-\det(A).}
$$

**Proof (clean parity argument).**  
Swapping two columns corresponds to composing each permutation  $\sigma$  with a transposition  $\tau=(j\ k)$ . A transposition has sign  $-1$ , and  $\operatorname{sgn}(\tau\circ\sigma)=\operatorname{sgn}(\tau)\operatorname{sgn}(\sigma)=-\operatorname{sgn}(\sigma)$ . Meanwhile the products  $\prod_i a_{i,\sigma(i)}$  match term-by-term under this relabeling. So the whole sum flips sign. ∎

### (b) If two columns are equal then determinant is zero

If  $c_j=c_k$  for some  $j\neq k$ , then

$$
\boxed{\det(A)=0.}
$$

**Proof.** Swapping columns  $j$  and  $k$  leaves  $A$  unchanged, so  $\det(A)=\det(A')$ . But swapping flips sign, so  $\det(A')=-\det(A)$ . Hence  $\det(A)=-\det(A)\Rightarrow \det(A)=0$ . ∎

* * *

2.3 Normalization
-----------------

$$
\boxed{\det(I)=1.}
$$

Already checked.

* * *

2.4 Why these three are not random
----------------------------------

A deep (and useful) fact:

> There is exactly **one** function  $D:\mathbb R^{n\times n}\to\mathbb R$  that is multilinear in the columns, alternating, and satisfies  $D(I)=1$ . That function is  $\det$ .

So determinant is the unique “oriented volume” functional compatible with linearity. That’s why it keeps showing up.

* * *

3) Determinant and singularity:  $\det(A)=0$  iff  $A$  is singular
===================================================================

This is the algebra–geometry hinge.

Theorem (three-way equivalence)
-------------------------------

For  $A\in\mathbb R^{n\times n}$ ,

 $$
\boxed{\ \det(A)=0 \iff A \text{ is singular} \iff \ker(A)\neq\{0\}. }
$$

We’ll prove it via two lemmas that are each “geometrically obvious” but must be algebraically airtight.

* * *

3.1 Lemma: dependent columns  $\Rightarrow \det(A)=0$ 
------------------------------------------------------

Assume columns  $c_1,\dots,c_n$  are linearly dependent. Then WLOG one column is a linear combination of the others; say

$$
c_1=\sum_{j=2}^n \alpha_j c_j.
$$

Using multilinearity in the first column:

$$
\det(c_1,c_2,\dots,c_n) =\det\!\Big(\sum_{j=2}^n \alpha_j c_j,\ c_2,\dots,c_n\Big) =\sum_{j=2}^n \alpha_j\det(c_j,c_2,\dots,c_n).
$$

But in  $\det(c_j,c_2,\dots,c_n)$ , the first column equals the  $j$ \-th column (both are  $c_j$ ), so there are two identical columns ⇒ determinant is zero by alternating property. Each term vanishes, so the sum is zero:

$$
\det(A)=0.
$$

∎

* * *

3.2 Lemma:  $\ker(A)\neq\{0\}$   $\Leftrightarrow$  columns are dependent
-------------------------------------------------------------------------

### ( $\Rightarrow$ ) Nontrivial kernel implies dependence

If  $\ker(A)\neq\{0\}$ , pick  $x\neq 0$  with  $Ax=0$ . Write  $x=(x_1,\dots,x_n)^\top$ . Then

$$
Ax = A\sum_{j=1}^n x_j e_j=\sum_{j=1}^n x_j A e_j=\sum_{j=1}^n x_j c_j = 0.
$$

Since  $x\neq 0$ , not all  $x_j$  are zero. This is a nontrivial linear dependence among the columns.

### ( $\Leftarrow$ ) Dependence implies nontrivial kernel

If columns are dependent, there exists  $\alpha\neq 0$  with  $\sum_{j=1}^n \alpha_j c_j=0$ . But  $\sum \alpha_j c_j = A\alpha$ . So  $A\alpha=0$  with  $\alpha\neq 0$ . Hence  $\ker(A)\neq\{0\}$ .

So they are equivalent. ∎

* * *

3.3 Finish the theorem
----------------------

*   If  $\ker(A)\neq\{0\}$ , columns are dependent (Lemma 3.2), hence  $\det(A)=0$  (Lemma 3.1).
*   Conversely, if  $\det(A)\neq 0$ , we will soon prove this implies invertible, hence trivial kernel. Equivalently,  $\det(A)=0\Rightarrow$  not invertible  $\Rightarrow$  nontrivial kernel.

To make the “ $\det(A)\neq 0\Rightarrow A$  invertible” fully sealed, we now prove multiplicativity and use  $AA^{-1}=I$ . (That route is clean and standard.)

* * *

4) Multiplicativity:  $\det(AB)=\det(A)\det(B)$ 
================================================

This is the engine behind almost every algebraic determinant manipulation.

Theorem
-------

For  $A,B\in\mathbb R^{n\times n}$ ,

 $$
\boxed{\ \det(AB)=\det(A)\det(B). }
$$

### Proof (via the “uniqueness characterization”)

Fix  $B$ . Define a function of  $A$ :

$$
f(A):=\det(AB).
$$

We claim  $f$  is multilinear and alternating in the columns of  $A$ .

*   **Multilinear in column  $j$ :**  
    The  $j$ \-th column of  $AB$  is
    $$
    (AB)_{:j} = A(B_{:j}),
    $$
    and  $A(B_{:j})$  is a linear combination of the columns of  $A$  with coefficients given by entries of  $B_{:j}$ . In particular, if we change only column  $j$  of  $A$  linearly, the resulting column of  $AB$  changes linearly, and since  $\det$  is multilinear in columns, the composition is multilinear.
*   **Alternating:** if two columns of  $A$  are equal, then the corresponding columns of  $AB$  are equal (because multiplying by  $B$  just forms linear combinations of columns of  $A$ ), so  $\det(AB)=0$ . Likewise swapping columns of  $A$  swaps columns of  $AB$ , flipping sign.

So  $f$  is an alternating multilinear function of the columns of  $A$ . Therefore by uniqueness,  $f(A)$  must be a scalar multiple of  $\det(A)$ :

$$
f(A)=\det(A)\cdot f(I).
$$

But  $f(I)=\det(IB)=\det(B)$ . Hence

$$
\det(AB)=f(A)=\det(A)\det(B).
$$

∎

* * *

4.1 Corollaries (now the singularity story fully locks)
-------------------------------------------------------

1.  If  $A$  invertible, then
    
$$
I = AA^{-1}\ \Rightarrow\ 1=\det(I)=\det(A)\det(A^{-1}) \ \Rightarrow\ \boxed{\det(A)\neq 0,\ \det(A^{-1})=\frac{1}{\det(A)}}.
$$
2.  Conversely, if  $\det(A)\neq 0$ , then  $A$  cannot have dependent columns (by Lemma 3.1 contrapositive), so  $\ker(A)=\{0\}$ . In finite dimension, injective  $\Rightarrow$  bijective  $\Rightarrow$  invertible. Thus:
    
$$
\boxed{\det(A)\neq 0 \iff A \text{ invertible}.}
$$

So the famous equivalence is now completely airtight.

* * *

5) Determinant as volume scaling (the geometric meaning)
========================================================

Here’s the geometric object determinant measures.

5.1 Parallelepiped generated by vectors
---------------------------------------

Given  $v_1,\dots,v_n\in\mathbb R^n$ , define the parallelepiped

$$
P(v_1,\dots,v_n)=\Big\{\sum_{i=1}^n t_i v_i: t_i\in[0,1]\Big\}.
$$

Let  $A=[v_1\ \cdots\ v_n]$ . Then

$$
P(v_1,\dots,v_n) = A([0,1]^n)
$$

(the image of the unit cube under the linear map  $x\mapsto Ax$ ).

5.2 Theorem (volume of parallelepiped)
--------------------------------------

 $$
\boxed{\ \mathrm{Vol}_n(P(v_1,\dots,v_n)) = |\det(A)|\ }.
$$

### Why this is not a “handwave” (how it’s forced)

Define  $V(v_1,\dots,v_n)$  to be the oriented volume (could be negative for orientation flips). It must satisfy:

*   **multilinear:** scaling one vector scales volume; adding vectors adds volumes (by cutting/shearing decomposition)
*   **alternating:** if two generating vectors coincide, the set is flat (volume 0); swapping two vectors flips orientation
*   **normalization:** the unit cube generated by  $e_1,\dots,e_n$  has volume 1

These three properties uniquely characterize  $\det$ . Therefore oriented volume _is_  $\det$ , and actual volume is  $|\det|$ .

If you know multivariable calculus, this also appears as the Jacobian determinant in change-of-variables:

$$
\mathrm{Vol}(A(S)) = |\det(A)|\,\mathrm{Vol}(S).
$$

* * *

6) Determinant and eigenvalues:  $\det(A)=\prod_i \lambda_i$ 
=============================================================

6.1 Triangular matrices
-----------------------

If  $T$  is upper or lower triangular, then

 $$
\boxed{\ \det(T)=\prod_{i=1}^n T_{ii}\ }.
$$

(Only the identity permutation contributes; all other permutations hit a zero below/above diagonal.)

6.2 Diagonalizable matrices (esp. symmetric)
--------------------------------------------

If  $A=V\Lambda V^{-1}$ , then using multiplicativity:

$$
\det(A)=\det(V)\det(\Lambda)\det(V^{-1})=\det(\Lambda)=\prod_{i=1}^n \lambda_i.
$$

So:

 $$
\boxed{\ \det(A)=\prod_{i=1}^n \lambda_i(A)\ }.
$$

For real symmetric  $A$ , spectral theorem gives  $A=Q\Lambda Q^\top$  with orthogonal  $Q$ , and the same conclusion holds with minimal fuss.

* * *

7) Log-det: domain, spectral identity, and why it’s famous
==========================================================

7.1 Domain honesty
------------------

 $\log\det(X)$  as a real number requires  $\det(X)>0$ . In convex optimization we usually restrict to

$$
\mathbf S_{++}^n = \{X=X^\top:\ X\succ 0\}.
$$

For  $X\succ 0$ , all eigenvalues satisfy  $\lambda_i>0$ , so  $\det(X)>0$ , so  $\log\det(X)$  is finite.

If  $X\succeq 0$  but singular, then  $\det(X)=0$  and  $\log\det(X)=-\infty$  (extended-value sense). That blow-up is exactly why it acts like a barrier.

* * *

7.2 Spectral formula
--------------------

If  $X\in\mathbf S_{++}^n$ , write  $X=Q\Lambda Q^\top$  with  $\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n)$ ,  $\lambda_i>0$ . Then

$$
\det(X)=\prod_{i=1}^n \lambda_i \quad\Rightarrow\quad \boxed{\ \log\det(X)=\sum_{i=1}^n \log\lambda_i(X)\ }.
$$

**Interpretation:** determinant is multiplicative volume scaling; log turns multiplicative into additive. So  $\log\det$  is “additive volume scaling across principal axes.”

* * *

8) Concavity of  $\log\det$  and convexity of  $-\log\det$ 
===========================================================

This is the convex-optimization “celebrity” part.

8.1 First derivative (Jacobi’s formula → log-det derivative)
------------------------------------------------------------

For a differentiable path  $X(t)$  of invertible matrices,

 $$
\boxed{\ \frac{d}{dt}\log\det(X(t))=\operatorname{tr}\!\big(X(t)^{-1}X'(t)\big)\ }.
$$

(You can prove Jacobi’s formula via differentiating  $X\,\operatorname{adj}(X)=\det(X)I$ , or via determinant multilinearity; either route is rigorous.)

8.2 Second derivative along a line is negative
----------------------------------------------

Take a line in symmetric matrix space:

$$
X(t)=X+tH,\quad X\succ 0,\ H=H^\top,
$$

for  $t$  such that  $X(t)\succ 0$ .

We have  $X'(t)=H$ , and derivative of inverse:

$$
\frac{d}{dt}X(t)^{-1} = -X(t)^{-1}H X(t)^{-1}.
$$

Differentiate once more:

$$
\frac{d^2}{dt^2}\log\det(X(t)) =\frac{d}{dt}\operatorname{tr}(X(t)^{-1}H) =\operatorname{tr}\!\Big(\frac{d}{dt}X(t)^{-1}\,H\Big) =-\operatorname{tr}\!\big(X(t)^{-1}H X(t)^{-1}H\big).
$$

Now set  $M:=X(t)^{-1/2} H X(t)^{-1/2}$  (symmetric). Then

$$
X(t)^{-1}H X(t)^{-1}H = X(t)^{-1/2} M^2 X(t)^{-1/2},
$$

so by cyclic trace,

$$
\operatorname{tr}(X(t)^{-1}H X(t)^{-1}H)=\operatorname{tr}(M^2)\ge 0.
$$

Hence

 $$
\boxed{\ \frac{d^2}{dt^2}\log\det(X(t))=-\operatorname{tr}(M^2)\le 0. }
$$

So  $\log\det$  is concave on  $\mathbf S_{++}^n$ . Therefore:

 $$
\boxed{\ \log\det \text{ concave on }\mathbf S_{++}^n,\quad -\log\det \text{ convex.}}
$$

**Why  $-\log\det$  is a barrier:** as  $X$  approaches singularity, some  $\lambda_i(X)\downarrow 0$ , so  $\log\lambda_i\to -\infty$ , so  $-\log\det(X)\to +\infty$ . It “punishes” the boundary  $X\succeq 0$  hard.

* * *

9) End-of-Module 7 checklist
============================

You should be able to do all of these without vibes-based reasoning:

1.  State the Leibniz formula and get  $\det(I)=1$ , diagonal case, and  $\det$  multilinear/alternating.
2.  Prove: dependent columns  $\Rightarrow \det=0$  using multilinearity + equal-columns property.
3.  Prove:  $\ker(A)\neq\{0\}\iff$  columns dependent    $\iff A$  singular    $\iff \det(A)=0$ .
4.  Explain  $|\det(A)|$  as volume scaling, sign as orientation.
5.  For  $X\succ 0$ : derive  $\log\det(X)=\sum_i\log\lambda_i(X)$ .
6.  Understand why  $\log\det$  is concave and  $-\log\det$  convex (line restriction + second derivative).

* * *

Next module
-----------

**Module 8 — Eigenvalues, spectral theorem, PSD order, Rayleigh quotients.**  
That’s where “ $x^\top Px\ge 0$ ” becomes “ $P\succeq 0$ ” becomes “all eigenvalues  $\ge 0$ ” becomes “convex quadratic form,” and the geometry snaps into place.

## Prompt:
Now this:

# Module 8 — Eigenvalues, spectral theorem, PSD order, and quadratic forms

*(the point where “(x^\top P x\ge 0)” becomes a complete geometric language)*

## 0) What this module is secretly doing

Later you will read things like:

* “(\nabla^2 f(x)\succeq 0)”
* “(P\succ 0) so the quadratic is strictly convex”
* “(L)-smoothness means (|\nabla^2 f(x)|_2\le L)”
* “the top eigenvalue gives the worst-case curvature direction”

All of that is one story:

> A symmetric matrix is a quadratic energy landscape. Eigenvectors are the principal axes; eigenvalues are the curvatures along those axes.

This module builds that story rigorously from scratch.

---

# 1) Eigenvalues/eigenvectors: definitions (and what they mean)

Let (A\in\mathbb R^{n\times n}).

## 1.1 Definition

A scalar (\lambda\in\mathbb C) is an **eigenvalue** of (A) if there exists a nonzero vector (v\in\mathbb C^n) such that
[
Av=\lambda v.
]
That vector (v\neq 0) is an **eigenvector** for (\lambda).

If we restrict to real (A) and real (v), (\lambda) might still be complex in general.
**But** for **symmetric** real matrices, eigenvalues are real and eigenvectors can be chosen real (we will prove this).

## 1.2 “Why do we care?” (meaning)

(Av=\lambda v) means:

* (A) sends the direction (v) to the **same direction** (no rotation away),
* it only **scales** it by factor (\lambda).

So eigenvectors are “directions that (A) doesn’t mix.” Eigenvalues are the scaling in those directions.

---

# 2) Symmetry is the magic ingredient

From now on we focus on **real symmetric** matrices:
[
A\in\mathbf S^n := {A\in\mathbb R^{n\times n}: A^\top=A}.
]

Symmetry is the reason everything becomes clean:

* real eigenvalues,
* orthogonal eigenvectors,
* full diagonalization by an orthogonal matrix.

---

# 3) A key geometric lemma: maxima on the unit sphere exist

We will use a standard compactness fact (this is “real analysis 0,” but I’ll state it clearly).

## Lemma (Weierstrass extreme value theorem, specialized)

If (f:\mathbb R^n\to\mathbb R) is continuous and (K\subset\mathbb R^n) is compact (closed + bounded), then (f) attains a maximum and a minimum on (K).

### Apply it to the sphere

The unit sphere
[
S^{n-1}={x\in\mathbb R^n:|x|_2=1}
]
is compact. The function (x\mapsto x^\top A x) is continuous. Therefore:

[
\exists x_{\max}\in S^{n-1}:\ x_{\max}^\top A x_{\max}=\max_{|x|=1} x^\top A x,
]
and similarly for a minimizer.

This is the “existence engine” behind the spectral theorem proof we’ll do.

---

# 4) Rayleigh quotient: define it early (it’s the spine)

For (A\in\mathbf S^n) and (x\neq 0), define the **Rayleigh quotient**
[
\boxed{\ R_A(x) := \frac{x^\top A x}{x^\top x} \ }.
]

Notes:

* It’s scale-invariant: (R_A(\alpha x)=R_A(x)) for (\alpha\neq 0).
* So maximizing over (x\neq 0) is the same as maximizing over (|x|=1).

---

# 5) The spectral theorem (full proof, induction + optimization)

## Theorem (Spectral theorem for real symmetric matrices)

If (A\in\mathbf S^n), then there exists an orthogonal matrix (Q\in\mathbb R^{n\times n}) and a real diagonal matrix (\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n)) such that
[
\boxed{\ A = Q\Lambda Q^\top. \ }
]
Equivalently: (A) has an orthonormal basis of eigenvectors.

We will prove this in a constructive, no-handwaving way.

---

## Step 1: show there exists at least one real eigenpair

Consider the maximization problem:
[
\max_{|x|_2=1} ; f(x):=x^\top A x.
]
By the compactness lemma, an optimizer (u) exists.

Let
[
\lambda := u^\top A u = \max_{|x|=1} x^\top A x.
]

### Claim: (Au=\lambda u). (This is the crucial step.)

We prove it via Lagrange multipliers (fully explicit).

We maximize (f(x)=x^\top A x) subject to the constraint (g(x)=x^\top x-1=0).

* Gradient facts you must know:

  * (\nabla(x^\top x)=2x).
  * If (A) is symmetric, (\nabla(x^\top A x)=2Ax).
    (Quick derivation: (x^\top A x = \sum_{i,j} a_{ij}x_ix_j). Differentiate w.r.t. (x_k); symmetry makes it (2(Ax)_k).)

At a constrained maximizer (u), there exists a scalar (\mu) such that
[
\nabla f(u)=\mu \nabla g(u).
]
So:
[
2Au = \mu \cdot 2u \quad\Rightarrow\quad Au = \mu u.
]
Thus (u) is an eigenvector and (\mu) is its eigenvalue.

Now identify (\mu) with our (\lambda):
Multiply (Au=\mu u) on the left by (u^\top):
[
u^\top Au = \mu u^\top u = \mu \cdot 1 = \mu.
]
But (u^\top Au=\lambda) by definition. So (\mu=\lambda). Therefore
[
Au=\lambda u.
]

So we have found a **real** eigenpair ((\lambda,u)) with (|u|=1).

**Commentary (what happened):**
The “direction of steepest increase” of the quadratic form on the sphere must point outward normal to the sphere. The outward normal at (u) is (u) itself. So (Au) must be parallel to (u). That “parallel” condition is exactly the eigenvector equation.

---

## Step 2: eigenvectors for distinct eigenvalues are orthogonal (proved)

### Lemma

If (A\in\mathbf S^n), and (Av=\lambda v), (Aw=\mu w) with (\lambda\neq\mu), then (v^\top w=0).

**Proof.**
Compute (v^\top Aw) in two ways:

* Using (Aw=\mu w): (v^\top Aw = v^\top(\mu w)=\mu v^\top w).
* Using symmetry (A^\top=A): (v^\top Aw = (A^\top v)^\top w = (Av)^\top w = (\lambda v)^\top w=\lambda v^\top w).

So (\mu v^\top w = \lambda v^\top w). Since (\lambda\neq\mu), we must have (v^\top w=0). ∎

---

## Step 3: the orthogonal complement of an eigenvector is invariant

Let (u) be a unit eigenvector: (Au=\lambda u).

Define the subspace
[
U := u^\perp = {x\in\mathbb R^n: u^\top x=0}.
]

### Claim: (A(U)\subseteq U). (Invariance)

**Proof.** Take any (x\in U), so (u^\top x=0). We must show (u^\top (Ax)=0).

Compute:
[
u^\top(Ax) = (A^\top u)^\top x = (Au)^\top x = (\lambda u)^\top x = \lambda (u^\top x)=\lambda\cdot 0=0.
]
So (Ax\in U). ∎

**Meaning:** once you pick one eigen-direction, the symmetric matrix never “leaks” vectors out of the perpendicular subspace.

---

## Step 4: induct on dimension

We now reduce the problem from dimension (n) to dimension (n-1).

Since (U=u^\perp) is invariant, we can restrict (A) to (U). Concretely:

* pick an orthonormal basis of (U),
* represent the restriction as an ((n-1)\times(n-1)) symmetric matrix,
* apply the same argument.

By induction, (A) has an orthonormal eigenbasis inside (U): vectors (u_2,\dots,u_n\in U), orthonormal, and
[
Au_i=\lambda_i u_i \quad (i=2,\dots,n).
]
Together with (u_1:=u), we get an orthonormal basis ({u_1,\dots,u_n}) of (\mathbb R^n) consisting of eigenvectors.

Let (Q=[u_1\ \cdots\ u_n]) (orthogonal), and (\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n)). Then
[
AQ = [Au_1\ \cdots\ Au_n]=[\lambda_1u_1\ \cdots\ \lambda_nu_n]=Q\Lambda,
]
so multiplying on the right by (Q^\top),
[
A = Q\Lambda Q^\top.
]
∎

---

# 6) Quadratic forms become diagonal in the eigenbasis

Let (A=Q\Lambda Q^\top), (Q) orthogonal.

For any (x\in\mathbb R^n), define coordinates in the eigenbasis:
[
z := Q^\top x \quad\Longleftrightarrow\quad x=Qz.
]
Then:
[
x^\top A x = (Qz)^\top(Q\Lambda Q^\top)(Qz)
= z^\top \Lambda z
= \sum_{i=1}^n \lambda_i z_i^2.
]
So:
[
\boxed{\ x^\top A x = \sum_{i=1}^n \lambda_i (q_i^\top x)^2\ }
]
where (q_i) are the columns of (Q).

**This formula is the whole PSD story.**

---

# 7) PSD/PD: definitions and the eigenvalue equivalences

## 7.1 Definitions

For (P\in\mathbf S^n):

* **Positive semidefinite (PSD)**:
  [
  \boxed{\ P\succeq 0 \iff x^\top P x \ge 0\ \forall x\in\mathbb R^n. }
  ]
* **Positive definite (PD)**:
  [
  \boxed{\ P\succ 0 \iff x^\top P x > 0\ \forall x\neq 0. }
  ]

These are statements about the quadratic form (energy) being never negative / strictly positive.

---

## 7.2 Theorem: PSD iff eigenvalues (\ge 0)

Let (P\in\mathbf S^n) with eigen-decomposition (P=Q\Lambda Q^\top). Then:
[
\boxed{\ P\succeq 0 \iff \lambda_i(P)\ge 0\ \forall i. }
]

### Proof

Using the diagonal quadratic form formula:
[
x^\top P x = z^\top\Lambda z = \sum_{i=1}^n \lambda_i z_i^2,\quad z=Q^\top x.
]

**((\Rightarrow))** Assume (P\succeq 0). Take (x=q_k) (the (k)-th eigenvector). Then (Pq_k=\lambda_k q_k), and
[
q_k^\top P q_k = q_k^\top (\lambda_k q_k) = \lambda_k |q_k|^2 = \lambda_k.
]
PSD means this is (\ge 0). So (\lambda_k\ge 0) for each (k).

**((\Leftarrow))** If all (\lambda_i\ge 0), then for any (x),
[
x^\top P x = \sum_{i=1}^n \lambda_i z_i^2 \ge 0
]
because each term is nonnegative ((\lambda_i\ge 0), (z_i^2\ge 0)). So (P\succeq 0). ∎

---

## 7.3 Theorem: PD iff eigenvalues (>0)

Similarly,
[
\boxed{\ P\succ 0 \iff \lambda_i(P)>0\ \forall i. }
]

### Proof

If (\lambda_i>0), then for (x\neq 0), (z=Q^\top x\neq 0), so at least one (z_i\neq 0), hence
[
x^\top P x=\sum \lambda_i z_i^2>0.
]
Conversely, if some (\lambda_k\le 0), choosing (x=q_k) gives (x^\top P x=\lambda_k\le 0), contradicting PD. ∎

---

## 7.4 Invertibility connection

For symmetric (P),
[
\boxed{\ P\ \text{invertible} \iff \lambda_i(P)\neq 0\ \forall i. }
]
So PD matrices are always invertible.

---

# 8) Loewner order (PSD order) and what it really means

## 8.1 Definition

For (A,B\in\mathbf S^n),
[
\boxed{\ A\succeq B \iff A-B\succeq 0. }
]
This is called the **Loewner (semidefinite) order**.

## 8.2 What it means (quadratic form comparison)

Unpack:
[
A\succeq B
\iff x^\top(A-B)x\ge 0\ \forall x
\iff x^\top A x \ge x^\top B x\ \forall x.
]
So it’s an ordering of quadratic forms: (A) always gives at least as much “energy/curvature” as (B) in every direction.

## 8.3 It is a partial order (briefly, but correctly)

* Reflexive: (A-A=0\succeq 0).
* Transitive: if (A-B\succeq 0) and (B-C\succeq 0), then ((A-C)=(A-B)+(B-C)\succeq 0).
* Antisymmetric: if (A-B\succeq 0) and (B-A\succeq 0), then (x^\top(A-B)x=0\ \forall x), which forces (A-B=0) (a symmetric matrix with zero quadratic form in all directions must be the zero matrix). Hence (A=B).

---

# 9) Rayleigh quotient bounds and extremal eigenvalues

## 9.1 Extremal characterization

For (A\in\mathbf S^n),
[
\boxed{\ \lambda_{\max}(A)=\max_{|x|=1} x^\top A x,\qquad
\lambda_{\min}(A)=\min_{|x|=1} x^\top A x. }
]
This is exactly how we found the first eigenvector in the spectral theorem proof.

## 9.2 The inequality you will use everywhere

For all (x\neq 0),
[
\boxed{\ \lambda_{\min}(A)\ \le\ R_A(x)\ \le\ \lambda_{\max}(A). }
]

### Proof (clean, using diagonal form)

Let (A=Q\Lambda Q^\top), (z=Q^\top x). Then
[
R_A(x)=\frac{x^\top A x}{x^\top x}
=\frac{z^\top\Lambda z}{z^\top z}
=\frac{\sum_i \lambda_i z_i^2}{\sum_i z_i^2}.
]
Define weights
[
w_i := \frac{z_i^2}{\sum_j z_j^2}.
]
Then (w_i\ge 0) and (\sum_i w_i=1). So
[
R_A(x)=\sum_i w_i \lambda_i,
]
a convex combination of eigenvalues. Any convex combination lies between the minimum and maximum:
[
\min_i \lambda_i \le \sum_i w_i\lambda_i \le \max_i\lambda_i.
]
Thus:
[
\lambda_{\min}(A)\le R_A(x)\le \lambda_{\max}(A).
]
∎

**Commentary:** Rayleigh quotient is literally “average eigenvalue,” weighted by how much of (x) lies in each eigen-direction (squared coordinates).

---

# 10) Big geometric interpretation: ellipsoids and curvature

For (P\succ 0), the set
[
{x: x^\top P x \le 1}
]
is an ellipsoid. In eigen-coordinates (z=Q^\top x), it becomes
[
\sum_i \lambda_i z_i^2 \le 1
\quad\Longleftrightarrow\quad
\sum_i \left(\frac{z_i}{1/\sqrt{\lambda_i}}\right)^2 \le 1.
]
So the principal semi-axes lengths are (1/\sqrt{\lambda_i}).

* Big eigenvalue ⇒ tight curvature ⇒ short axis.
* Small eigenvalue ⇒ flat direction ⇒ long axis.

This is exactly the same geometry you’ll meet in Newton methods and conditioning.

---

# 11) “Do” skills / sanity checks (quick but essential)

1. If (P\succeq 0), you should be able to justify **both ways**:

   * “(x^\top Px\ge 0\ \forall x)”
   * “all eigenvalues (\ge 0)”
2. Given (A=Q\Lambda Q^\top), you can rewrite any quadratic form as (\sum \lambda_i z_i^2).
3. You can prove Rayleigh bounds by convex-combination weights (w_i=z_i^2/|z|^2).
4. You can interpret (A\succeq B) as “curvature of (A) dominates curvature of (B) in every direction.”

---

# 12) End-of-Module 8 checklist (no mercy)

You are ready for Module 9 only if:

* You can reproduce the spectral theorem proof outline: maximize (x^\top A x) on the sphere → eigenvector → invariant orthogonal complement → induction.
* You can prove orthogonality of eigenvectors for distinct eigenvalues in 3 lines.
* You can prove PSD ⇔ eigenvalues nonnegative (both directions).
* You can prove the Rayleigh quotient bound and explain it as a weighted average of eigenvalues.
* You can translate “Hessian PSD” into “curvature nonnegative in every direction” without blinking.

---

## Next module

**Module 9 — Operator norms, induced norms, and conditioning (why sensitivity is geometry).**
We’ll prove (|A|*2=\sigma*{\max}(A)), specialize to symmetric (A) where (|A|_2=\max|\lambda_i|), and connect condition number (\kappa_2(A)) to stretching of the unit ball and numerical stability.

## Response:
Thought for 53s

Module 8 — Eigenvalues, spectral theorem, PSD order, and quadratic forms
========================================================================

_(the point where  $x^\top P x\ge 0$  becomes a complete geometric language)_

0) What this module is secretly doing
-------------------------------------

A real symmetric matrix  $A$  is not “a table of numbers.” It’s a **quadratic energy landscape**:

$$
x \mapsto x^\top A x.
$$

Eigenvectors are the **principal axes** of that landscape. Eigenvalues are the **curvatures** (how fast the energy grows/decays) along those axes. Everything you’ll later read—Hessians, curvature bounds, smoothness constants, strong convexity, PSD constraints—reduces to:

$$
x^\top A x = \sum_{i=1}^n \lambda_i (q_i^\top x)^2 \quad\text{(after choosing the right orthonormal basis).}
$$

This module proves that identity from scratch.

* * *

1) Eigenvalues/eigenvectors: definitions and meaning
====================================================

Let  $A\in\mathbb R^{n\times n}$ .

1.1 Definition (general)
------------------------

A scalar  $\lambda\in\mathbb C$  is an **eigenvalue** of  $A$  if there exists  $v\in\mathbb C^n\setminus\{0\}$  such that

$$
Av=\lambda v.
$$

Such a nonzero  $v$  is an **eigenvector**.

### Meaning

 $Av=\lambda v$  means: the direction  $v$  is not “mixed” into other directions by  $A$ ; it is only scaled.

In general (non-symmetric  $A$ ), eigenvalues/eigenvectors can be complex and the geometry is messy. **Symmetry is the magic ingredient** that makes everything clean.

* * *

2) Symmetry is the magic ingredient
===================================

From now on we focus on real symmetric matrices:

$$
A\in \mathbf S^n := \{A\in\mathbb R^{n\times n}: A^\top=A\}.
$$

For symmetric  $A$ , we will prove:

1.  eigenvalues are real,
2.  eigenvectors for distinct eigenvalues are orthogonal,
3.   $A$  has an orthonormal eigenbasis (spectral theorem), i.e.
    
$$
\boxed{A=Q\Lambda Q^\top}
$$

with  $Q$  orthogonal and  $\Lambda$  real diagonal.

* * *

3) Compactness engine: maxima on the unit sphere exist
======================================================

We need a precise existence tool.

3.1 Lemma: the unit sphere is compact
-------------------------------------

Define

$$
S^{n-1}:=\{x\in\mathbb R^n:\|x\|_2=1\}.
$$
*   **Closed:** the map  $x\mapsto \|x\|_2$  is continuous, so  $S^{n-1}=\|\,\cdot\,\|_2^{-1}(\{1\})$  is the preimage of a closed set.
*   **Bounded:**  $\|x\|_2=1$  is bounded by definition.

In  $\mathbb R^n$ , closed + bounded  $\Rightarrow$  compact (Heine–Borel). ∎

3.2 Lemma: continuous function on compact set attains extrema (Weierstrass)
---------------------------------------------------------------------------

If  $f$  is continuous and  $K$  is compact, then  $\max_{x\in K} f(x)$  and  $\min_{x\in K} f(x)$  exist (are attained).

We’ll treat this as a core real-analysis fact. (It’s exactly what prevents “supremum floating in the void.”)

3.3 Apply it to quadratic forms
-------------------------------

For symmetric  $A$ , define

$$
f(x)=x^\top A x.
$$

This is a polynomial in entries of  $x$ , hence continuous. Therefore there exist  $u_{\max},u_{\min}\in S^{n-1}$  such that

$$
u_{\max}^\top A u_{\max}=\max_{\|x\|_2=1} x^\top A x,\qquad u_{\min}^\top A u_{\min}=\min_{\|x\|_2=1} x^\top A x.
$$

That existence is the starting point of the spectral theorem proof.

* * *

4) Rayleigh quotient: define it early (it’s the spine)
======================================================

For  $A\in\mathbf S^n$  and  $x\neq 0$ , define the **Rayleigh quotient**

$$
\boxed{R_A(x):=\frac{x^\top A x}{x^\top x}=\frac{x^\top A x}{\|x\|_2^2}.}
$$

4.1 Scale invariance
--------------------

For  $\alpha\neq 0$ ,

$$
R_A(\alpha x)=\frac{(\alpha x)^\top A (\alpha x)}{(\alpha x)^\top(\alpha x)} =\frac{\alpha^2 x^\top A x}{\alpha^2 x^\top x}=R_A(x).
$$

So maximizing/minimizing  $R_A(x)$  over  $x\neq 0$  is equivalent to maximizing/minimizing  $x^\top A x$  over the unit sphere.

* * *

5) Spectral theorem (full proof, no handwaving)
===============================================

Theorem (Spectral theorem for real symmetric matrices)
------------------------------------------------------

If  $A\in\mathbf S^n$ , then there exists an orthogonal  $Q\in\mathbb R^{n\times n}$  and a real diagonal  $\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n)$  such that

$$
\boxed{A=Q\Lambda Q^\top.}
$$

Equivalently:  $\mathbb R^n$  has an orthonormal basis of eigenvectors of  $A$ .

We prove this by: (i) existence of one eigenvector via maximizing  $x^\top A x$  on the sphere, (ii) invariance of the orthogonal complement, (iii) induction.

* * *

Step 1: show there exists at least one real eigenpair
-----------------------------------------------------

Let

$$
\lambda_{\max}:=\max_{\|x\|_2=1} x^\top A x,
$$

and let  $u\in S^{n-1}$  be a maximizer:

$$
u^\top A u=\lambda_{\max}.
$$

### Goal: prove  $Au=\lambda_{\max}u$ 

Instead of invoking “Lagrange multipliers” as magic words, we do the geometric calculus properly: **at a constrained maximizer, the directional derivative along every feasible tangent direction must be zero**.

#### 1) Tangent directions to the sphere at  $u$  are exactly  $u^\perp$ 

A direction  $d$  is tangent at  $u$  if there exists a differentiable curve  $\gamma(t)\in S^{n-1}$  with  $\gamma(0)=u$  and  $\gamma'(0)=d$ .

*   If  $\gamma(t)\in S^{n-1}$ , then  $\|\gamma(t)\|_2^2=1$  for all  $t$ . Differentiate at  $0$ :
    $$
    0=\frac{d}{dt}\Big|_{t=0} \|\gamma(t)\|_2^2 =\frac{d}{dt}\Big|_{t=0} (\gamma(t)^\top \gamma(t)) =2u^\top d.
    $$
    Hence any tangent  $d$  must satisfy  $u^\top d=0$ , i.e.  $d\in u^\perp$ .
*   Conversely, if  $d\in u^\perp$  and  $\|d\|_2=1$ , the curve
    $$
    \gamma(t)=\cos(t)\,u+\sin(t)\,d
    $$
    satisfies  $\|\gamma(t)\|_2^2=\cos^2 t+\sin^2 t=1$  and  $\gamma(0)=u,\ \gamma'(0)=d$ . So every  $d\in u^\perp$  is a feasible tangent direction.

Thus the tangent space is exactly  $u^\perp$ . ∎

#### 2) Compute directional derivative of  $f(x)=x^\top A x$  at  $u$ 

Consider  $\phi(t):=f(\gamma(t))=\gamma(t)^\top A\gamma(t)$ . Differentiate:

Using product rule and symmetry of  $A$ ,

$$
\phi'(t) =\gamma'(t)^\top A\gamma(t)+\gamma(t)^\top A\gamma'(t) =2\gamma'(t)^\top A\gamma(t).
$$

So at  $t=0$  (where  $\gamma(0)=u,\ \gamma'(0)=d$ ),

$$
\phi'(0)=2d^\top Au.
$$

#### 3) Use optimality:  $\phi'(0)=0$  for all tangent directions  $d\in u^\perp$ 

Because  $u$  maximizes  $f$  over the sphere, moving along any feasible curve through  $u$  cannot increase  $f$  to first order, so  $\phi'(0)=0$ . Hence:

$$
2d^\top Au=0\quad\forall d\in u^\perp \quad\Longrightarrow\quad d^\top Au=0\quad\forall d\in u^\perp.
$$

But the set of vectors orthogonal to **all**  $d\in u^\perp$  is exactly  $(u^\perp)^\perp=\mathrm{span}\{u\}$ . Therefore,

$$
Au \in \mathrm{span}\{u\} \quad\Longrightarrow\quad Au=\lambda u
$$

for some scalar  $\lambda\in\mathbb R$ .

Finally, identify  $\lambda$ :

$$
u^\top Au = u^\top(\lambda u)=\lambda \,u^\top u=\lambda.
$$

But  $u^\top Au=\lambda_{\max}$ . Hence  $\lambda=\lambda_{\max}$ , so

$$
\boxed{Au=\lambda_{\max}u.}
$$

So we have found a **real eigenpair**  $(\lambda_{\max},u)$ . ∎

**Important payoff:** we did _not_ assume eigenvalues are real. We produced a real eigenvalue by optimization on a real compact set.

* * *

Step 2: eigenvectors for distinct eigenvalues are orthogonal
------------------------------------------------------------

### Lemma

If  $A\in\mathbf S^n$ ,  $Av=\lambda v$ ,  $Aw=\mu w$ , and  $\lambda\neq\mu$ , then  $v^\top w=0$ .

**Proof.**  
Compute  $v^\top Aw$  in two ways:

*   Using  $Aw=\mu w$ :  $v^\top Aw=\mu v^\top w$ .
*   Using symmetry  $A^\top=A$ :  $v^\top Aw=(A^\top v)^\top w=(Av)^\top w=(\lambda v)^\top w=\lambda v^\top w$ .

So  $\mu v^\top w=\lambda v^\top w$ . Since  $\lambda\neq\mu$ , we must have  $v^\top w=0$ . ∎

* * *

Step 3: the orthogonal complement of an eigenvector is invariant
----------------------------------------------------------------

Let  $u$  be a unit eigenvector:  $Au=\lambda u$ . Define

$$
U:=u^\perp=\{x:u^\top x=0\}.
$$

### Lemma (invariance)

If  $x\in U$ , then  $Ax\in U$ .

**Proof.**  
If  $x\in U$ , then  $u^\top x=0$ . Compute:

$$
u^\top(Ax)=(A^\top u)^\top x=(Au)^\top x=(\lambda u)^\top x=\lambda(u^\top x)=0.
$$

So  $Ax\in u^\perp=U$ . ∎

**Meaning:** symmetric matrices never “leak” vectors out of the perpendicular subspace once you lock in an eigen-direction.

* * *

Step 4: induction on dimension
------------------------------

We now reduce from  $n$  to  $n-1$ .

*   The subspace  $U=u^\perp$  has dimension  $n-1$ .
*   The restriction  $A|_U:U\to U$  is a linear map. It is also **symmetric as an operator on  $U$ **: for any  $x,y\in U$ ,
    $$
    \langle A|_U x,y\rangle = x^\top Ay = (A^\top x)^\top y = (Ax)^\top y = \langle x,A|_U y\rangle.
    $$

Choose an orthonormal basis of  $U$  and represent  $A|_U$  in that basis: you get an  $(n-1)\times(n-1)$  real symmetric matrix. By induction hypothesis,  $A|_U$  has an orthonormal eigenbasis  $\{u_2,\dots,u_n\}\subset U$ .

Together with  $u_1:=u$ , we obtain an orthonormal basis  $\{u_1,\dots,u_n\}$  of  $\mathbb R^n$  consisting of eigenvectors of  $A$ .

Let

$$
Q=[u_1\ \cdots\ u_n] \quad(\text{orthogonal}),\qquad \Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n),
$$

where  $Au_i=\lambda_i u_i$ . Then

$$
AQ=[Au_1\ \cdots\ Au_n]=[\lambda_1u_1\ \cdots\ \lambda_nu_n]=Q\Lambda,
$$

so multiplying by  $Q^\top$  gives

$$
\boxed{A=Q\Lambda Q^\top.}
$$

∎

* * *

6) Quadratic forms become diagonal in the eigenbasis
====================================================

With  $A=Q\Lambda Q^\top$  and  $Q$  orthogonal, define eigen-coordinates

$$
z:=Q^\top x \quad\Longleftrightarrow\quad x=Qz.
$$

Then

$$
x^\top A x =(Qz)^\top(Q\Lambda Q^\top)(Qz) =z^\top\Lambda z =\sum_{i=1}^n \lambda_i z_i^2.
$$

Equivalently, if  $q_i$  is the  $i$ \-th eigenvector (column of  $Q$ ), then  $z_i=q_i^\top x$  and

$$
\boxed{x^\top A x=\sum_{i=1}^n \lambda_i (q_i^\top x)^2.}
$$

This identity is the “one formula to rule them all” for PSD, curvature bounds, and convex quadratics.

* * *

7) PSD/PD: definitions and eigenvalue equivalences
==================================================

Let  $P\in\mathbf S^n$ .

7.1 Definitions
---------------

*   **PSD**:
    $$
    \boxed{P\succeq 0 \iff x^\top P x\ge 0\ \forall x.}
    $$
*   **PD**:
    $$
    \boxed{P\succ 0 \iff x^\top P x>0\ \forall x\neq 0.}
    $$

7.2 Theorem: PSD    $\iff$  all eigenvalues  $\ge 0$ 
-----------------------------------------------------

Let  $P=Q\Lambda Q^\top$ . Then:

$$
\boxed{P\succeq 0 \iff \lambda_i(P)\ge 0\ \forall i.}
$$

**Proof.**

*   ( $\Rightarrow$ ) If  $P\succeq 0$ , take  $x=q_k$  (an eigenvector). Then
    $$
    q_k^\top P q_k = q_k^\top(\lambda_k q_k)=\lambda_k\|q_k\|_2^2=\lambda_k\ge 0.
    $$
*   ( $\Leftarrow$ ) If all  $\lambda_i\ge 0$ , then for any  $x$  with  $z=Q^\top x$ ,
    $$
    x^\top P x=\sum_{i=1}^n \lambda_i z_i^2\ge 0.
    $$

∎

7.3 Theorem: PD    $\iff$  all eigenvalues  $>0$ 
-------------------------------------------------

Similarly,

$$
\boxed{P\succ 0 \iff \lambda_i(P)>0\ \forall i.}
$$

**Proof.**  
If all  $\lambda_i>0$  and  $x\neq 0$ , then  $z=Q^\top x\neq 0$ , so some  $z_i\neq 0$ , hence  $\sum \lambda_i z_i^2>0$ . Conversely, if some  $\lambda_k\le 0$ , set  $x=q_k$  to violate strict positivity. ∎

7.4 Invertibility
-----------------

For symmetric  $P$ ,

$$
\boxed{P\text{ invertible} \iff \lambda_i(P)\neq 0\ \forall i.}
$$

In particular,  $P\succ 0 \Rightarrow P$  invertible.

* * *

8) Loewner (semidefinite) order: what it really means
=====================================================

8.1 Definition
--------------

For  $A,B\in\mathbf S^n$ ,

$$
\boxed{A\succeq B \iff A-B\succeq 0.}
$$

8.2 Equivalent “quadratic form domination” meaning
--------------------------------------------------

Unpack the definition:

$$
A\succeq B \iff x^\top(A-B)x\ge 0\ \forall x \iff x^\top A x\ge x^\top B x\ \forall x.
$$

So it’s literally an “every-direction” curvature/energy comparison.

* * *

9) Rayleigh quotient extremals and bounds
=========================================

9.1 Extremal characterization
-----------------------------

For  $A\in\mathbf S^n$ ,

$$
\boxed{\lambda_{\max}(A)=\max_{\|x\|_2=1} x^\top A x,\qquad \lambda_{\min}(A)=\min_{\|x\|_2=1} x^\top A x.}
$$

This is exactly how we constructed the first eigenpair.

9.2 Fundamental inequality
--------------------------

For all  $x\neq 0$ ,

$$
\boxed{\lambda_{\min}(A)\le R_A(x)\le \lambda_{\max}(A).}
$$

**Proof (convex-combination proof).**  
Write  $A=Q\Lambda Q^\top$ , let  $z=Q^\top x\neq 0$ . Then

$$
R_A(x)=\frac{z^\top\Lambda z}{z^\top z} =\frac{\sum_i \lambda_i z_i^2}{\sum_i z_i^2}.
$$

Define weights

$$
w_i:=\frac{z_i^2}{\sum_j z_j^2}\quad(\ge 0),\qquad \sum_i w_i=1.
$$

Then

$$
R_A(x)=\sum_i w_i\lambda_i,
$$

a convex combination of eigenvalues, hence between the minimum and maximum eigenvalue. ∎

9.3 Corollary: sandwich bound for the quadratic form
----------------------------------------------------

Multiply the Rayleigh bound by  $\|x\|_2^2$ :

$$
\boxed{\lambda_{\min}(A)\|x\|_2^2\ \le\ x^\top A x\ \le\ \lambda_{\max}(A)\|x\|_2^2.}
$$

This is the precise statement “largest eigenvalue controls worst-case curvature.”

* * *

10) Operator norm of a symmetric matrix (a key bridge to “smoothness”)
======================================================================

Even before SVD, you can already prove the symmetric case cleanly.

Define the induced (Euclidean) operator norm:

$$
\|A\|_2:=\max_{\|x\|_2=1}\|Ax\|_2.
$$

Then

$$
\|A\|_2^2=\max_{\|x\|_2=1}\|Ax\|_2^2 =\max_{\|x\|_2=1} x^\top A^\top A x.
$$

If  $A$  is symmetric,  $A^\top A=A^2$ . Eigenvalues of  $A^2$  are  $\lambda_i(A)^2$  with the same eigenvectors. Therefore,

$$
\|A\|_2^2=\lambda_{\max}(A^2)=\max_i \lambda_i(A)^2,
$$

so

$$
\boxed{\|A\|_2=\max_i |\lambda_i(A)|.}
$$

This is exactly why “largest eigenvalue” becomes the Lipschitz/smoothness constant for Hessians later.

* * *

11) Geometric picture you should actually _see_
===============================================

For  $P\succ 0$ , the set

$$
\{x: x^\top P x\le 1\}
$$

is an ellipsoid. In eigen-coordinates  $z=Q^\top x$ ,

$$
\sum_i \lambda_i z_i^2\le 1 \iff \sum_i \left(\frac{z_i}{1/\sqrt{\lambda_i}}\right)^2\le 1.
$$

So the principal semi-axis lengths are  $1/\sqrt{\lambda_i}$ .

Big  $\lambda_i$  = tight direction (high curvature).  
Small  $\lambda_i$  = flat direction (low curvature).  
That’s the entire conditioning story in one sentence.

* * *

12) End-of-Module 8 checklist (no mercy)
========================================

You’re good only if you can do these without handwaving:

1.  Prove the spectral theorem via: maximize  $x^\top A x$  on the sphere  $\Rightarrow$  eigenvector, then invariance of  $u^\perp$ , then induction.
2.  Prove orthogonality of eigenvectors for distinct eigenvalues in 3 lines (using symmetry).
3.  Prove  $P\succeq 0 \iff \lambda_i(P)\ge 0$  (both directions).
4.  Prove Rayleigh bounds via the “convex combination of eigenvalues” argument.
5.  Derive  $\lambda_{\min}\|x\|^2 \le x^\top A x \le \lambda_{\max}\|x\|^2$ .
6.  Prove  $\|A\|_2=\max_i|\lambda_i(A)|$  for symmetric  $A$ .

* * *

Next module
-----------

**Module 9 — Operator norms, induced norms, singular values, and conditioning.**  
We’ll prove:  $\|A\|_2=\sigma_{\max}(A)$ , relate it to ellipsoid stretching, define condition numbers, and connect all of it to numerical stability and sensitivity (which later becomes “smoothness” and “strong convexity” in optimization).

1/2

## Prompt:
Noe this:

# Module 9 — Operator norms, induced norms, and conditioning

*(how “worst-case amplification” becomes a number, and why numerical pain has geometry)*

## 0) What this module is secretly doing

In optimization and numerical linear algebra you constantly see statements like:

* “(\nabla f) is (L)-Lipschitz”
* “(\nabla^2 f(x)\preceq LI)”
* “gradient descent needs step size (\le 1/L)”
* “this system is ill-conditioned: (\kappa) is huge”

All of these reduce to one idea:

> A matrix is a machine that stretches vectors. An **operator norm** measures the worst stretch. A **condition number** measures how uneven that stretching is (and thus how errors get magnified).

This module makes that precise and proves the key equalities that connect:

* induced norms (|A|_{p\to p}),
* singular values (\sigma_i),
* eigenvalues when symmetric,
* conditioning (\kappa).

---

# 1) Induced/operator norms: definitions (with full domain honesty)

Let (|\cdot|) be a norm on (\mathbb R^n) and (|\cdot|') a norm on (\mathbb R^m). For (A\in\mathbb R^{m\times n}), define the **induced (operator) norm**
[
\boxed{\ |A|*{|\cdot|\to|\cdot|'} := \sup*{x\neq 0}\frac{|Ax|'}{|x|}. }
]
When the same norm is used on both sides, we write (|A|=|A|*{p\to p}) or (|A|*{p}) (common shorthand).

### Important equivalent form (restriction to unit sphere)

Because the ratio is homogeneous (scale-invariant), we can restrict to (|x|=1):
[
\boxed{\ |A|*{|\cdot|\to|\cdot|'} = \sup*{|x|=1}|Ax|'. }
]
**Proof:** For any (x\neq 0), write (x=|x|u) where (|u|=1). Then
[
\frac{|Ax|'}{|x|}=\frac{|A(|x|u)|'}{|x|}=\frac{|x||Au|'}{|x|}=|Au|'.
]
So optimizing over all (x\neq0) equals optimizing over unit vectors (u). ∎

### Existence of the supremum (is it attained?)

In finite dimensions, on the unit sphere ({x:|x|=1}) which is compact, the map (x\mapsto |Ax|') is continuous, hence the supremum is actually a maximum:
[
|A|*{|\cdot|\to|\cdot|'}=\max*{|x|=1}|Ax|'.
]
So there is at least one worst-case direction.

---

# 2) Prove it’s a norm on matrices (yes, operator norm really is a norm)

Fix norms (|\cdot|) on (\mathbb R^n) and (|\cdot|') on (\mathbb R^m). Define (|A|:=|A|_{|\cdot|\to|\cdot|'}).

We check the three norm axioms on matrices:

## 2.1 Nonnegativity and definiteness

* (|A|\ge 0) because it’s a supremum of nonnegative numbers.
* If (|A|=0), then (|Ax|'=0) for all (x) with (|x|=1), hence for all (x\neq0) by scaling, hence (Ax=0) for all (x), so (A=0).
  Conversely, if (A=0), clearly (|A|=0).

## 2.2 Absolute homogeneity

For scalar (\alpha),
[
|\alpha A|=\sup_{x\neq0}\frac{|\alpha Ax|'}{|x|}
=\sup_{x\neq0}\frac{|\alpha||Ax|'}{|x|}
=|\alpha|\sup_{x\neq0}\frac{|Ax|'}{|x|}
=|\alpha||A|.
]

## 2.3 Triangle inequality

We need (|A+B|\le |A|+|B|).

For any (x\neq0),
[
|(A+B)x|' \le |Ax|'+|Bx|' \quad\text{(triangle inequality in }\mathbb R^m\text{)}.
]
Divide by (|x|):
[
\frac{|(A+B)x|'}{|x|} \le \frac{|Ax|'}{|x|}+\frac{|Bx|'}{|x|}.
]
Take supremum over (x\neq0):
[
|A+B|=\sup_{x\neq0}\frac{|(A+B)x|'}{|x|}
\le \sup_{x\neq0}\frac{|Ax|'}{|x|} + \sup_{x\neq0}\frac{|Bx|'}{|x|}
=|A|+|B|.
]
∎

So induced operator norms are genuine matrix norms.

---

# 3) The most important special case: the 2→2 operator norm

From now on we focus on the Euclidean norm (|\cdot|_2).

Define:
[
\boxed{\ |A|*2 := \sup*{x\neq0}\frac{|Ax|_2}{|x|*2} = \max*{|x|_2=1}|Ax|_2. }
]

**Meaning:** the largest factor by which (A) can stretch a vector in Euclidean length.

---

# 4) Connect (|A|_2) to eigenvalues of (A^\top A) (the core proof)

This is the bridge to singular values (Module 10), but we can already prove the key identity now.

## Theorem

For any (A\in\mathbb R^{m\times n}),
[
\boxed{\ |A|*2^2 = \lambda*{\max}(A^\top A). }
]
Equivalently,
[
\boxed{\ |A|*2 = \sqrt{\lambda*{\max}(A^\top A)}. }
]

### Proof (step-by-step)

Start from definition:
[
|A|*2 = \max*{|x|_2=1}|Ax|_2.
]
Square both sides (all nonnegative):
[
|A|*2^2 = \left(\max*{|x|=1}|Ax|*2\right)^2 = \max*{|x|=1}|Ax|_2^2.
]
Now expand (|Ax|*2^2):
[
|Ax|*2^2 = (Ax)^\top(Ax) = x^\top A^\top A x.
]
Thus:
[
|A|*2^2 = \max*{|x|=1} x^\top(A^\top A)x.
]
But (A^\top A) is symmetric PSD (Module 5), so by Module 8 (Rayleigh characterization),
[
\max*{|x|=1} x^\top(A^\top A)x = \lambda*{\max}(A^\top A).
]
Therefore:
[
|A|*2^2=\lambda*{\max}(A^\top A).
]
∎

**Commentary:**
We turned “worst-case stretch” into a Rayleigh quotient maximization. That’s why eigenvalues and operator norms are the same family of concepts.

---

# 5) Symmetric case: (|A|_2 = \max_i|\lambda_i(A)|)

When (A\in\mathbf S^n), the spectral theorem makes this even sharper.

## Theorem (symmetric operator norm)

If (A\in\mathbf S^n), then
[
\boxed{\ |A|*2 = \max*{i}|\lambda_i(A)|. }
]

### Proof

For symmetric (A), diagonalize (A=Q\Lambda Q^\top). Then
[
A^\top A = A^2 = Q\Lambda Q^\top Q\Lambda Q^\top = Q\Lambda^2 Q^\top.
]
So eigenvalues of (A^\top A) are (\lambda_i(A)^2). Therefore:
[
|A|*2^2=\lambda*{\max}(A^\top A)=\max_i \lambda_i(A)^2.
]
Take square roots:
[
|A|_2=\max_i |\lambda_i(A)|.
]
∎

**Interpretation:**
For symmetric matrices, the largest stretching factor equals the largest magnitude eigenvalue, because eigenvectors are the principal axes and the matrix doesn’t do any “mixing rotation” beyond orthogonal change of basis.

---

# 6) Other induced norms: (|A|*1) and (|A|*\infty) (and exact formulas)

These are induced by (\ell_1) and (\ell_\infty). They have clean closed forms.

## 6.1 The (\infty\to\infty) norm: max absolute row sum

[
\boxed{\ |A|*\infty := \max*{|x|*\infty=1}|Ax|*\infty = \max_{i}\sum_{j=1}^n |a_{ij}|. }
]

### Proof (both directions, no gaps)

Let (r_i^\top) be row (i) of (A).

For any (x) with (|x|*\infty\le 1), we have (|x_j|\le 1). Then
[
|(Ax)*i| = \left|\sum*{j=1}^n a*{ij}x_j\right|
\le \sum_{j=1}^n |a_{ij}||x_j|
\le \sum_{j=1}^n |a_{ij}|.
]
Taking max over (i):
[
|Ax|*\infty = \max_i |(Ax)*i| \le \max_i\sum_j |a*{ij}|.
]
Now take supremum over (|x|*\infty\le 1):
[
|A|*\infty \le \max_i\sum_j|a*{ij}|.
]

For the reverse inequality, pick (i^\star) achieving the max row sum:
[
i^\star\in\arg\max_i\sum_j|a_{ij}|.
]
Define (x\in\mathbb R^n) by
[
x_j := \mathrm{sign}(a_{i^\star j})\quad(\text{choose }x_j=1 \text{ if }a_{i^\star j}=0).
]
Then (|x|*\infty=1). Compute the (i^\star)-th component:
[
(Ax)*{i^\star} = \sum_j a_{i^\star j}x_j = \sum_j a_{i^\star j}\mathrm{sign}(a_{i^\star j})=\sum_j |a_{i^\star j}|.
]
So (|Ax|*\infty \ge |(Ax)*{i^\star}| = \sum_j |a_{i^\star j}| = \max_i\sum_j|a_{ij}|).
Taking supremum gives:
[
|A|*\infty \ge \max_i\sum_j|a*{ij}|.
]
Combine both directions ⇒ equality. ∎

## 6.2 The (1\to 1) norm: max absolute column sum

Similarly,
[
\boxed{\ |A|*1 = \max*{j}\sum_{i=1}^m |a_{ij}|. }
]
Proof is analogous but uses the column expansion and (|x|_1\le 1).

---

# 7) Conditioning: definition and what it really measures

For an invertible square matrix (A\in\mathbb R^{n\times n}), the condition number (in norm (|\cdot|)) is
[
\boxed{\ \kappa(A) := |A|\ |A^{-1}|. }
]
In particular:
[
\kappa_2(A)=|A|_2|A^{-1}|_2.
]

## 7.1 Why this is the right quantity (error amplification)

Suppose you want to solve (Ax=b). The true solution is (x=A^{-1}b).

If (b) is perturbed to (b+\Delta b), the solution becomes (x+\Delta x = A^{-1}(b+\Delta b)), so
[
\Delta x = A^{-1}\Delta b.
]
Take norms:
[
|\Delta x|\le |A^{-1}|\ |\Delta b|.
]
Divide by (|x|=|A^{-1}b|) is tricky, but we can bound (|x|) from below using (b=Ax):
[
|b|=|Ax|\le |A||x|\quad\Rightarrow\quad |x|\ge \frac{|b|}{|A|}.
]
So:
[
\frac{|\Delta x|}{|x|} \le \frac{|A^{-1}||\Delta b|}{|b|/|A|}
= |A||A^{-1}|\ \frac{|\Delta b|}{|b|}
= \kappa(A)\ \frac{|\Delta b|}{|b|}.
]
Thus:
[
\boxed{\ \text{relative solution error} \ \lesssim\  \kappa(A)\times \text{relative data error}. }
]

**Meaning:** (\kappa(A)) is a worst-case error magnifier.

---

# 8) (\kappa_2) and singular values (preview, but we can prove part now)

Using the identity (|A|*2^2=\lambda*{\max}(A^\top A)), define the singular values later as
[
\sigma_i(A)=\sqrt{\lambda_i(A^\top A)}.
]
Then (|A|*2=\sigma*{\max}(A)).

If (A) is invertible, eigenvalues of (A^\top A) are positive, so the smallest singular value (\sigma_{\min}(A)>0). One can show:
[
\boxed{\ |A^{-1}|*2 = \frac{1}{\sigma*{\min}(A)}\ }
]
and therefore
[
\boxed{\ \kappa_2(A)=\frac{\sigma_{\max}(A)}{\sigma_{\min}(A)}. }
]
We’ll prove these cleanly in Module 10 with SVD (that’s the right place).

**Geometric meaning:** the unit sphere under (A) becomes an ellipsoid. (\sigma_{\max}) is the longest semi-axis, (\sigma_{\min}) the shortest. (\kappa_2) is “how elongated the ellipsoid is.”

---

# 9) End-of-Module 9 checklist (must be automatic)

You can:

1. Move between the ratio definition and unit-sphere definition of (|A|_{p\to p}).
2. Prove induced norm is a matrix norm (three axioms).
3. Prove (|A|*2^2=\lambda*{\max}(A^\top A)) via Rayleigh quotient.
4. For symmetric (A), prove (|A|_2=\max|\lambda_i(A)|).
5. Prove exact formulas:
   [
   |A|*\infty=\max_i\sum_j|a*{ij}|,\qquad |A|*1=\max_j\sum_i|a*{ij}|.
   ]
6. Derive the relative-error bound and interpret (\kappa(A)) as sensitivity.

---

## Next module

**Module 10 — SVD, pseudoinverse, and best rank-(k) approximation.**
We’ll build the SVD from the spectral theorem of (A^\top A), prove (\sigma_i=\sqrt{\lambda_i(A^\top A)}), derive the pseudoinverse, solve least squares/minimum-norm solutions, and prove the Eckart–Young theorem (best low-rank approximation).

## Response:
Thought

Module 9 — Operator norms, induced norms, and conditioning
==========================================================

_(how “worst-case amplification” becomes a number, and why numerical pain has geometry)_

0) What this module is secretly doing
-------------------------------------

Every time you see “ $L$ \-smooth”, “step size  $\le 1/L$ ”, “ill-conditioned”, or “errors explode”, the hidden engine is:

> A matrix is a vector-stretching machine.  
> An **operator norm** measures the worst stretch.  
> A **condition number** measures how uneven the stretching is (hence how errors get magnified).

This module builds that engine carefully and proves the key identities:

*   induced/operator norms are real norms on matrices,
*    $\|A\|_2^2=\lambda_{\max}(A^\top A)$ ,
*   for symmetric  $A$ ,  $\|A\|_2=\max_i|\lambda_i(A)|$ ,
*    $\|A\|_1$  and  $\|A\|_\infty$  have exact “max column/row sum” formulas,
*    $\kappa(A)=\|A\|\|A^{-1}\|$  controls relative error amplification,
*   and (already now, without SVD)
    $$
    \kappa_2(A)=\frac{\sigma_{\max}(A)}{\sigma_{\min}(A)} \quad\text{where }\sigma_i(A)=\sqrt{\lambda_i(A^\top A)}.
    $$

* * *

1) Induced/operator norms: definition + the “unit sphere” reduction
===================================================================

Let  $\|\cdot\|$  be a norm on  $\mathbb R^n$  and  $\|\cdot\|'$  a norm on  $\mathbb R^m$ . For  $A\in\mathbb R^{m\times n}$ , define the **induced (operator) norm**

 $$
\boxed{\ \|A\|_{\|\cdot\|\to \|\cdot\|'} := \sup_{x\neq 0}\frac{\|Ax\|'}{\|x\|}\ }.
$$

### 1.1 Why this definition is the “right” one

*   The fraction  $\|Ax\|'/\|x\|$  is the _amplification factor_ on input  $x$ .
*   Taking  $\sup$  means “worst-case amplification”.

### 1.2 Equivalent “unit sphere” form (no gaps)

Because the ratio is scale-invariant, we can restrict to  $\|x\|=1$ :

 $$
\boxed{\ \|A\|_{\|\cdot\|\to \|\cdot\|'} = \sup_{\|x\|=1}\|Ax\|'\ }.
$$

**Proof.** For any  $x\neq 0$ , write  $x=\|x\|u$  where  $u:=x/\|x\|$  so  $\|u\|=1$ . Then

$$
\frac{\|Ax\|'}{\|x\|}=\frac{\|A(\|x\|u)\|'}{\|x\|} =\frac{\|x\|\|Au\|'}{\|x\|}=\|Au\|'.
$$

So optimizing over all nonzero  $x$  is the same as optimizing over unit vectors  $u$ . ∎

* * *

2) Is the supremum attained? (finite-dimensional “compactness honesty”)
=======================================================================

In  $\mathbb R^n$ , **every norm** gives a closed, bounded unit sphere, hence compact.

### 2.1 Lemma:  $\{x:\|x\|=1\}$  is compact in  $\mathbb R^n$ 

Sketch you should actually be able to justify:

*   All norms on  $\mathbb R^n$  are equivalent: there exist constants  $c,C>0$  such that
    $$
    c\|x\|_2\le \|x\|\le C\|x\|_2\quad \forall x.
    $$
    This implies the  $\|\cdot\|$ \-unit sphere is bounded in  $\|\cdot\|_2$ .
*   It is closed because  $\|x\|$  is continuous and  $\{1\}$  is closed.

Closed + bounded in  $\mathbb R^n$   $\Rightarrow$  compact (Heine–Borel). ∎

### 2.2 Consequence: the supremum is a maximum

The map  $x\mapsto \|Ax\|'$  is continuous, and we are optimizing it over a compact set  $\{x:\|x\|=1\}$ . Therefore:

 $$
\boxed{\ \|A\|_{\|\cdot\|\to \|\cdot\|'}=\max_{\|x\|=1}\|Ax\|'\ }.
$$

So there exists at least one “worst-case direction”.

* * *

3) Induced operator norm is a matrix norm (and is submultiplicative)
====================================================================

Fix  $\|\cdot\|$  on  $\mathbb R^n$ ,  $\|\cdot\|'$  on  $\mathbb R^m$ , and define  $\|A\|:=\|A\|_{\|\cdot\|\to \|\cdot\|'}$ .

3.1 Nonnegativity and definiteness
----------------------------------

*    $\|A\|\ge 0$  because  $\|Ax\|'/\|x\|\ge 0$ .
*   If  $\|A\|=0$ , then  $\|Ax\|'=0$  for all  $\|x\|=1$ , hence for all  $x\neq 0$  by scaling, hence  $Ax=0\ \forall x$ , so  $A=0$ .
*   If  $A=0$ , clearly  $\|A\|=0$ .

3.2 Absolute homogeneity
------------------------

For scalar  $\alpha$ ,

$$
\|\alpha A\| =\sup_{x\neq 0}\frac{\|\alpha Ax\|'}{\|x\|} =\sup_{x\neq 0}\frac{|\alpha|\|Ax\|'}{\|x\|} =|\alpha|\|A\|.
$$

3.3 Triangle inequality
-----------------------

For any  $x\neq 0$ ,

$$
\|(A+B)x\|'\le \|Ax\|'+\|Bx\|' \Rightarrow \frac{\|(A+B)x\|'}{\|x\|} \le \frac{\|Ax\|'}{\|x\|}+\frac{\|Bx\|'}{\|x\|}.
$$

Take  $\sup$  over  $x\neq 0$  and use  $\sup(f+g)\le \sup f + \sup g$ :

$$
\|A+B\|\le \|A\|+\|B\|.
$$

So it’s a genuine norm.

3.4 Submultiplicativity (crucial for conditioning)
--------------------------------------------------

If  $A:\mathbb R^n\to\mathbb R^m$  and  $B:\mathbb R^k\to\mathbb R^n$ , then

 $$
\boxed{\ \|AB\| \le \|A\|\ \|B\|\ }.
$$

**Proof.** For any  $x\neq 0$ ,

$$
\|ABx\|' \le \|A\|\ \|Bx\| \le \|A\|\ \|B\|\ \|x\|.
$$

Divide by  $\|x\|$  and take  $\sup$ . ∎

This one inequality is what makes  $\kappa(A)=\|A\|\|A^{-1}\|$  the right “amplification” measure.

* * *

4) The flagship case: the Euclidean operator norm  $\|A\|_2$ 
=============================================================

From now on, unless stated otherwise,  $\|\cdot\|=\|\cdot\|_2$ .

 $$
\boxed{\ \|A\|_2 := \sup_{x\neq 0}\frac{\|Ax\|_2}{\|x\|_2} = \max_{\|x\|_2=1}\|Ax\|_2. }
$$

Interpretation: maximum Euclidean stretch factor.

* * *

5) Core theorem:  $\|A\|_2^2 = \lambda_{\max}(A^\top A)$ 
=========================================================

Theorem
-------

For any  $A\in\mathbb R^{m\times n}$ ,

 $$
\boxed{\ \|A\|_2^2 = \lambda_{\max}(A^\top A)\ },\qquad \boxed{\ \|A\|_2 = \sqrt{\lambda_{\max}(A^\top A)}\ }.
$$

### Proof (step-by-step, no shortcuts)

1.  Start from the definition:
    
$$
\|A\|_2 = \max_{\|x\|_2=1}\|Ax\|_2.
$$
2.  Square (everything is nonnegative):
    
$$
\|A\|_2^2 = \max_{\|x\|_2=1}\|Ax\|_2^2.
$$
3.  Expand the squared norm:
    
$$
\|Ax\|_2^2 = (Ax)^\top(Ax)=x^\top(A^\top A)x.
$$
4.  Substitute:
    
$$
\|A\|_2^2 = \max_{\|x\|_2=1} x^\top(A^\top A)x.
$$
5.  Note  $A^\top A$  is symmetric PSD. By the Rayleigh quotient extremal characterization (Module 8),
    
$$
\max_{\|x\|_2=1} x^\top(A^\top A)x = \lambda_{\max}(A^\top A).
$$

Therefore  $\|A\|_2^2=\lambda_{\max}(A^\top A)$ . Taking square roots gives the second formula. ∎

**What to feel:** “worst stretch” is exactly “largest eigenvalue of the energy matrix  $A^\top A$ ”.

* * *

6) Symmetric case:  $\|A\|_2 = \max_i|\lambda_i(A)|$ 
=====================================================

Theorem
-------

If  $A\in\mathbf S^n$ , then

 $$
\boxed{\ \|A\|_2 = \max_i |\lambda_i(A)|\ }.
$$

### Proof

If  $A$  is symmetric, then  $A^\top A = A^2$ . Diagonalize  $A=Q\Lambda Q^\top$ , then

$$
A^2=Q\Lambda^2 Q^\top,
$$

so the eigenvalues of  $A^2$  are  $\lambda_i(A)^2$ . Using the previous theorem:

$$
\|A\|_2^2=\lambda_{\max}(A^\top A)=\lambda_{\max}(A^2)=\max_i \lambda_i(A)^2.
$$

Taking square roots:

$$
\|A\|_2=\max_i|\lambda_i(A)|.
$$

∎

* * *

7) Exact closed forms for  $\|A\|_1$  and  $\|A\|_\infty$ 
==========================================================

These are induced norms for  $\ell_1$  and  $\ell_\infty$ . They matter because they’re cheap to compute and give clean bounds.

7.1 The  $\infty\to\infty$  norm (max absolute row sum)
-------------------------------------------------------

 $$
\boxed{\ \|A\|_\infty := \max_{\|x\|_\infty=1}\|Ax\|_\infty = \max_{i=1,\dots,m}\sum_{j=1}^n |a_{ij}|. }
$$

### Proof (both directions)

**(≤)** Let  $\|x\|_\infty\le 1$ , so  $|x_j|\le 1$ . For each row  $i$ ,

$$
|(Ax)_i|=\left|\sum_{j=1}^n a_{ij}x_j\right| \le \sum_{j=1}^n |a_{ij}||x_j| \le \sum_{j=1}^n |a_{ij}|.
$$

Take max over  $i$ :

$$
\|Ax\|_\infty \le \max_i \sum_j |a_{ij}|.
$$

Now take sup over  $\|x\|_\infty\le 1$ :

$$
\|A\|_\infty \le \max_i \sum_j |a_{ij}|.
$$

**(≥)** Pick a row  $i^\star$  achieving the maximum row sum. Define  $x$  by

$$
x_j := \operatorname{sign}(a_{i^\star j}) \quad(\text{take }x_j=1\text{ if }a_{i^\star j}=0).
$$

Then  $\|x\|_\infty=1$  and

$$
(Ax)_{i^\star}=\sum_j a_{i^\star j}x_j = \sum_j |a_{i^\star j}|.
$$

So

$$
\|Ax\|_\infty \ge |(Ax)_{i^\star}| = \sum_j |a_{i^\star j}| = \max_i \sum_j |a_{ij}|.
$$

Taking the supremum over unit vectors gives

$$
\|A\|_\infty \ge \max_i \sum_j |a_{ij}|.
$$

Combine with (≤) ⇒ equality. ∎

7.2 The  $1\to 1$  norm (max absolute column sum)
-------------------------------------------------

 $$
\boxed{\ \|A\|_1 := \max_{\|x\|_1=1}\|Ax\|_1 = \max_{j=1,\dots,n}\sum_{i=1}^m |a_{ij}|. }
$$

Proof is the same template, but with columns.

* * *

8) Conditioning: definition + why it measures error amplification
=================================================================

From here on, conditioning is primarily about **square invertible** matrices  $A\in\mathbb R^{n\times n}$ . (Rectangular “conditioning” exists too, via pseudoinverse; we’ll touch it later.)

8.1 Definition
--------------

 $$
\boxed{\ \kappa(A):=\|A\|\ \|A^{-1}\|\ }.
$$

In particular:

$$
\kappa_2(A)=\|A\|_2\ \|A^{-1}\|_2.
$$

### Immediate facts

*    $\kappa(A)\ge 1$ .  
    Proof:  $\|I\|=\|AA^{-1}\|\le \|A\|\|A^{-1}\|$ . Also  $\|I\|=1$  for induced norms. Hence  $\kappa(A)\ge 1$ .
*    $\kappa(A)=1$  iff  $A$  is an isometry up to scaling in that norm (e.g. orthogonal matrices in  $\|\cdot\|_2$  have  $\kappa_2=1$ ).

8.2 Relative error amplification for solving  $Ax=b$ 
-----------------------------------------------------

True solution:  $x=A^{-1}b$ . Perturb the right-hand side:  $b\mapsto b+\Delta b$ . New solution:

$$
x+\Delta x = A^{-1}(b+\Delta b)=x + A^{-1}\Delta b \Rightarrow \Delta x = A^{-1}\Delta b.
$$

Take norms:

$$
\|\Delta x\|\le \|A^{-1}\|\ \|\Delta b\|.
$$

To relate  $\|x\|$  to  $\|b\|$ , use  $b=Ax$ :

$$
\|b\|=\|Ax\|\le \|A\|\ \|x\| \Rightarrow \|x\|\ge \frac{\|b\|}{\|A\|}.
$$

Now divide:

$$
\frac{\|\Delta x\|}{\|x\|} \le \frac{\|A^{-1}\|\ \|\Delta b\|}{\|b\|/\|A\|} = \|A\|\|A^{-1}\|\ \frac{\|\Delta b\|}{\|b\|} = \boxed{\ \kappa(A)\ \frac{\|\Delta b\|}{\|b\|}\ }.
$$

**Meaning:** in the worst case, relative error in  $b$  gets amplified by about  $\kappa(A)$  in the solution.

That is the precise mathematical reason “ill-conditioned” means “errors explode.”

* * *

9)  $\kappa_2$  in terms of  $A^\top A$  eigenvalues (already provable now)
===========================================================================

Define (this is the canonical definition even before SVD):

$$
\sigma_i(A):=\sqrt{\lambda_i(A^\top A)}\quad(\text{nonnegative}).
$$

Then

$$
\sigma_{\max}(A)=\sqrt{\lambda_{\max}(A^\top A)},\qquad \sigma_{\min}(A)=\sqrt{\lambda_{\min}(A^\top A)}.
$$

We already proved:

$$
\|A\|_2 = \sqrt{\lambda_{\max}(A^\top A)}=\sigma_{\max}(A).
$$

Now assume  $A$  is square invertible. Then  $A^\top A$  is symmetric **positive definite** (no nonzero vector is sent to zero), so  $\lambda_{\min}(A^\top A)>0$ .

### Key identity:  $(A^{-1})^\top A^{-1} = (A^\top A)^{-1}$ 

Because

$$
(A^\top A)(A^{-1}(A^{-1})^\top) = A^\top(AA^{-1})(A^{-1})^\top = A^\top I (A^{-1})^\top = A^\top (A^{-1})^\top = I,
$$

so indeed  $(A^\top A)^{-1}=(A^{-1}) (A^{-1})^\top$ , and transposing gives the stated form (either way is fine).

Then

$$
\|A^{-1}\|_2^2 = \lambda_{\max}\big((A^{-1})^\top A^{-1}\big) = \lambda_{\max}\big((A^\top A)^{-1}\big).
$$

But eigenvalues of  $M^{-1}$  for SPD  $M$  are reciprocals of eigenvalues of  $M$ . So

$$
\lambda_{\max}\big((A^\top A)^{-1}\big) = \frac{1}{\lambda_{\min}(A^\top A)}.
$$

Hence

$$
\|A^{-1}\|_2 = \frac{1}{\sqrt{\lambda_{\min}(A^\top A)}}=\frac{1}{\sigma_{\min}(A)}.
$$

Therefore:

 $$
\boxed{\ \kappa_2(A)=\|A\|_2\|A^{-1}\|_2 = \frac{\sigma_{\max}(A)}{\sigma_{\min}(A)}\ }.
$$

**Geometric meaning (the cleanest one):**  $A$  maps the unit sphere into an ellipsoid.

*    $\sigma_{\max}$  = longest semiaxis length,
*    $\sigma_{\min}$  = shortest semiaxis length,
*    $\kappa_2$  = “how stretched/skinny the ellipsoid is”.

That “skinniness” is exactly numerical instability.

* * *

10) One more bridge to optimization: Lipschitz gradients and Hessian norms (why  $L$  is an operator norm)
==========================================================================================================

This is why this module matters for convex optimization.

If  $f:\mathbb R^n\to\mathbb R$  is twice differentiable and  $\nabla^2 f(x)$  exists, then:

*   “ $\nabla f$  is  $L$ \-Lipschitz in  $\|\cdot\|_2$ ” is equivalent to
     $$
    \boxed{\ \|\nabla^2 f(x)\|_2 \le L\ \ \forall x\ }
    $$
    (under standard regularity assumptions), i.e. the Hessian never stretches a direction more than  $L$ .
*   Since for symmetric matrices  $\|H\|_2=\max|\lambda_i(H)|$ , this also means:
     $$
    \boxed{\ -L I \preceq \nabla^2 f(x) \preceq L I. }
    $$

For convex  $f$ , Hessian is PSD, so it becomes  $0\preceq \nabla^2 f(x)\preceq LI$ .

That’s the exact algebra behind step sizes like  $1/L$ .

* * *

11) End-of-Module 9 checklist (must be automatic)
=================================================

You can:

1.  Go from  $\sup_{x\neq0}\frac{\|Ax\|'}{\|x\|}$  to  $\sup_{\|x\|=1}\|Ax\|'$  cleanly.
2.  Prove induced operator norms satisfy all norm axioms and are submultiplicative.
3.  Prove  $\|A\|_2^2=\lambda_{\max}(A^\top A)$  via Rayleigh quotient.
4.  Prove symmetric case  $\|A\|_2=\max_i|\lambda_i(A)|$ .
5.  Prove exact formulas  $\|A\|_\infty=\max_i\sum_j|a_{ij}|$  and  $\|A\|_1=\max_j\sum_i|a_{ij}|$ .
6.  Derive the relative error bound  $\frac{\|\Delta x\|}{\|x\|}\le \kappa(A)\frac{\|\Delta b\|}{\|b\|}$ .
7.  Prove (already now)  $\kappa_2(A)=\sigma_{\max}(A)/\sigma_{\min}(A)$  using eigenvalues of  $A^\top A$ .

* * *

Next module
-----------

**Module 10 — SVD, pseudoinverse, and best rank- $k$  approximation.**  
We’ll build SVD from the spectral theorem of  $A^\top A$ , prove  $\|A\|_2=\sigma_{\max}(A)$  in the strongest sense, derive the pseudoinverse, classify least squares/minimum-norm solutions, and prove Eckart–Young (best low-rank approximation).

## Prompt:
Now this:

# Module 10 — SVD, pseudoinverse, and best rank-(k) approximation

*(the “x-ray machine” for linear maps: rotate → stretch → rotate)*

## 0) What this module is secretly doing

SVD (singular value decomposition) is the **master key** that unlocks, in one unified language:

* the **four fundamental subspaces** (column/row/null/left-null),
* the **operator norm** (|A|_2) and conditioning,
* **least squares** (including minimum-norm solutions),
* **PCA** (via SVD of centered data),
* and the deep theorem: **truncated SVD gives the best rank-(k) approximation** (Eckart–Young–Mirsky).

If you truly learn SVD, many later proofs become “change coordinates so the matrix is diagonal.”

---

## 1) Setup and notation (be precise now; it pays off forever)

Let (A\in\mathbb R^{m\times n}).
Define (r:=\mathrm{rank}(A)).

* An **orthogonal matrix** (Q\in\mathbb R^{p\times p}) satisfies (Q^\top Q=QQ^\top=I). Its columns form an orthonormal basis.
* For a diagonal matrix (\Sigma=\mathrm{diag}(\sigma_1,\dots,\sigma_r)) with (\sigma_i\ge 0), we will arrange (\sigma_1\ge\sigma_2\ge\cdots\ge\sigma_r>0).

We will use these facts from previous modules:

* (A^\top A\succeq 0) and is symmetric (Module 5).
* Spectral theorem for symmetric matrices: (S=V\Lambda V^\top) with (V) orthogonal, (\Lambda) diagonal real (Module 8).
* (|A|*2^2=\lambda*{\max}(A^\top A)) (Module 9).

---

## 2) Definitions: singular values/vectors and the SVD

### 2.1 Singular values

The **singular values** of (A) are the numbers
[
\sigma_i(A):=\sqrt{\lambda_i(A^\top A)}\quad(i=1,\dots,\min{m,n}),
]
where (\lambda_i(A^\top A)) are eigenvalues of (A^\top A) (nonnegative because (A^\top A\succeq 0)).
By convention, order them
[
\sigma_1\ge\sigma_2\ge\cdots\ge\sigma_{\min(m,n)}\ge 0.
]

### 2.2 Right and left singular vectors

* A **right singular vector** (v_i) is an eigenvector of (A^\top A):
  [
  A^\top A v_i=\sigma_i^2 v_i.
  ]
* A **left singular vector** (u_i) (for (\sigma_i>0)) is defined by
  [
  u_i := \frac{1}{\sigma_i}A v_i.
  ]

### 2.3 SVD statement (what we want to prove exists)

There exist orthogonal matrices (U\in\mathbb R^{m\times m}), (V\in\mathbb R^{n\times n}) and a diagonal “rectangular” matrix (\Sigma\in\mathbb R^{m\times n}) of the form
[
\Sigma=\begin{pmatrix}
\mathrm{diag}(\sigma_1,\dots,\sigma_r) & 0\
0 & 0
\end{pmatrix}
]
such that
[
\boxed{\ A=U\Sigma V^\top. \ }
]
This is the **singular value decomposition**.

---

## 3) Existence of the SVD (constructive proof, no magic)

### Step 1: diagonalize (A^\top A)

Because (A^\top A) is symmetric PSD, spectral theorem gives:
[
A^\top A = V \Lambda V^\top,
]
where (V=[v_1,\dots,v_n]) is orthogonal and (\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n)) with (\lambda_i\ge 0).
Define (\sigma_i:=\sqrt{\lambda_i}). Reorder so (\sigma_1\ge\cdots\ge\sigma_n\ge 0). Let (r) be the number of positive (\sigma_i); this will equal (\mathrm{rank}(A)) (we’ll prove soon).

So we have:
[
A^\top A v_i=\sigma_i^2 v_i,\quad |v_i|*2=1,\quad v_i^\top v_j=\delta*{ij}.
]

### Step 2: define left singular vectors (u_i) for (\sigma_i>0)

For (i=1,\dots,r), define
[
u_i := \frac{1}{\sigma_i}A v_i.
]
This is well-defined because (\sigma_i>0).

#### Claim: the (u_i) are orthonormal

Take (i,j\le r). Compute:
[
u_i^\top u_j
=\frac{1}{\sigma_i\sigma_j}(Av_i)^\top(Av_j)
=\frac{1}{\sigma_i\sigma_j}v_i^\top(A^\top A)v_j
=\frac{1}{\sigma_i\sigma_j}v_i^\top(\sigma_j^2 v_j)
=\frac{\sigma_j}{\sigma_i}v_i^\top v_j
=\frac{\sigma_j}{\sigma_i}\delta_{ij}.
]
So:

* if (i\ne j), (u_i^\top u_j=0);
* if (i=j), (u_i^\top u_i=\frac{\sigma_i}{\sigma_i}\cdot 1=1).

Hence ({u_1,\dots,u_r}) is orthonormal. ∎

### Step 3: extend ({u_1,\dots,u_r}) to an orthonormal basis of (\mathbb R^m)

Complete it to an orthonormal basis ({u_1,\dots,u_m}) (Gram–Schmidt on any completion).
Let (U=[u_1,\dots,u_m]\in\mathbb R^{m\times m}), which is orthogonal.

### Step 4: show (A v_i = \sigma_i u_i) and (A v_i = 0) for (\sigma_i=0)

* For (i\le r): by definition (u_i=\frac{1}{\sigma_i}Av_i), so (Av_i=\sigma_i u_i).
* For (i>r): (\sigma_i=0) implies (A^\top A v_i=0). Then
  [
  |Av_i|_2^2 = v_i^\top A^\top A v_i = v_i^\top 0 = 0 \Rightarrow Av_i=0.
  ]

### Step 5: assemble the matrix identity (A=U\Sigma V^\top)

Consider (AV). Its (i)-th column is (Av_i). From Step 4:
[
AV = [\sigma_1 u_1\ \cdots\ \sigma_r u_r\ 0\ \cdots\ 0].
]
Now multiply on the left by (U^\top). Since (U^\top u_i = e_i),
[
U^\top AV =
\begin{pmatrix}
\sigma_1 &        &        &        \
& \ddots &        &        \
&        & \sigma_r &       \
&        &        & 0
\end{pmatrix}
\text{embedded in } \mathbb R^{m\times n}
=:\Sigma.
]
So
[
U^\top A V = \Sigma \quad\Rightarrow\quad A = U\Sigma V^\top.
]
That is the SVD. ∎

---

## 4) Immediate consequences (and why they matter)

### 4.1 (AA^\top) has the same nonzero eigenvalues

From (A=U\Sigma V^\top),
[
AA^\top = U\Sigma V^\top V\Sigma^\top U^\top = U(\Sigma\Sigma^\top)U^\top,
]
so eigenvalues of (AA^\top) are (\sigma_i^2) (plus zeros). Thus:

* right singular vectors diagonalize (A^\top A),
* left singular vectors diagonalize (AA^\top).

### 4.2 Rank equals number of positive singular values

From (\Sigma), the rank of (A) equals the number of nonzero diagonal entries of (\Sigma), i.e.
[
\boxed{\ \mathrm{rank}(A)=|{i:\sigma_i>0}|=r. }
]

### 4.3 Norm identities

* **Spectral/operator norm**:
  [
  \boxed{\ |A|_2=\sigma_1. }
  ]
  Because (|A|*2^2=\lambda*{\max}(A^\top A)=\sigma_1^2).
* **Frobenius norm**:
  [
  \boxed{\ |A|*F^2=\sum*{i=1}^{r}\sigma_i^2. }
  ]
  Proof:
  [
  |A|_F^2=\mathrm{tr}(A^\top A)=\mathrm{tr}(V\Sigma^\top\Sigma V^\top)=\mathrm{tr}(\Sigma^\top\Sigma)=\sum_i\sigma_i^2.
  ]

### 4.4 Geometry: “rotate → stretch → rotate”

For any (x\in\mathbb R^n),
[
Ax = U\Sigma V^\top x.
]
Interpretation:

1. (V^\top) rotates/reflections in input space,
2. (\Sigma) stretches coordinates (by (\sigma_i)) and kills null directions,
3. (U) rotates/reflections in output space.

So the image of the unit sphere under (A) is an ellipsoid with semi-axis lengths (\sigma_i).

---

## 5) The four fundamental subspaces from SVD (cleanest possible description)

Let (A=U\Sigma V^\top) with rank (r).

### Column space (\mathcal C(A)\subseteq\mathbb R^m)

Claim:
[
\boxed{\ \mathcal C(A)=\mathrm{span}{u_1,\dots,u_r}. }
]
**Proof:** For any (x), write (x=V y). Then
[
Ax = U\Sigma y = \sum_{i=1}^r \sigma_i y_i u_i \in \mathrm{span}{u_1,\dots,u_r}.
]
Conversely, for each (i\le r), (u_i = \frac{1}{\sigma_i}A v_i\in \mathcal C(A)). So the spans match. ∎

### Row space (\mathcal C(A^\top)\subseteq\mathbb R^n)

Claim:
[
\boxed{\ \mathcal C(A^\top)=\mathrm{span}{v_1,\dots,v_r}. }
]
Same proof with (A^\top=V\Sigma^\top U^\top).

### Null space (\mathcal N(A)\subseteq\mathbb R^n)

Claim:
[
\boxed{\ \mathcal N(A)=\mathrm{span}{v_{r+1},\dots,v_n}. }
]
**Proof:** If (x=Vy), then (Ax=U\Sigma y). This is zero iff the first (r) coordinates (y_1,\dots,y_r) are zero. So (x) is a combination of (v_{r+1},\dots,v_n). ∎

### Left null space (\mathcal N(A^\top)\subseteq\mathbb R^m)

Claim:
[
\boxed{\ \mathcal N(A^\top)=\mathrm{span}{u_{r+1},\dots,u_m}. }
]
Same reasoning.

This exactly matches the “fundamental theorem” orthogonality picture from Module 4, but now you can literally *read it off* from the SVD.

---

## 6) Pseudoinverse: definition and Moore–Penrose conditions (full proof)

### 6.1 Definition

Given (\Sigma) with diagonal (\sigma_1,\dots,\sigma_r), define (\Sigma^+\in\mathbb R^{n\times m}) by
[
\Sigma^+_{ii}=\begin{cases}
1/\sigma_i,& i\le r\
0,& i>r
\end{cases}
]
(i.e. invert the nonzero singular values, leave zeros as zeros).

Define the **Moore–Penrose pseudoinverse**
[
\boxed{\ A^+ := V\Sigma^+U^\top. }
]

### 6.2 What the pseudoinverse must satisfy (Moore–Penrose equations)

A matrix (X) is the pseudoinverse of (A) iff it satisfies all four:

1. (AXA = A)
2. (XAX = X)
3. ((AX)^\top = AX)
4. ((XA)^\top = XA)

We prove (A^+=V\Sigma^+U^\top) satisfies these, hence is the pseudoinverse.

### 6.3 Proof

Use (A=U\Sigma V^\top), (A^+=V\Sigma^+U^\top).

Compute:
[
AA^+A = (U\Sigma V^\top)(V\Sigma^+U^\top)(U\Sigma V^\top)
=U(\Sigma\Sigma^+\Sigma)V^\top.
]
Now check the diagonal action: for each (i\le r),
[
\sigma_i\cdot \frac{1}{\sigma_i}\cdot \sigma_i = \sigma_i,
]
and for (i>r) everything is 0. So (\Sigma\Sigma^+\Sigma=\Sigma). Therefore (AA^+A=A). (1) holds.

Similarly:
[
A^+AA^+ = V(\Sigma^+\Sigma\Sigma^+)U^\top = V\Sigma^+U^\top = A^+,
]
since (\Sigma^+\Sigma\Sigma^+=\Sigma^+). So (2) holds.

Next:
[
AA^+=U\Sigma V^\top V\Sigma^+U^\top=U(\Sigma\Sigma^+)U^\top.
]
But (\Sigma\Sigma^+) is diagonal with entries (1) for (i\le r) and (0) for (i>r), hence symmetric. Thus (AA^+) is symmetric:
[
(AA^+)^\top = (U(\Sigma\Sigma^+)U^\top)^\top = U(\Sigma\Sigma^+)U^\top = AA^+.
]
So (3) holds.

Similarly:
[
A^+A = V(\Sigma^+\Sigma)V^\top,
]
also symmetric, hence (4) holds. ∎

**Interpretation:**
(AA^+) is the orthogonal projector onto (\mathcal C(A)).
(A^+A) is the orthogonal projector onto (\mathcal C(A^\top)) (row space).

---

## 7) Least squares via SVD: all solutions + minimum-norm solution

We solve
[
\min_x |Ax-b|_2.
]

### 7.1 Reduce the problem using orthogonal invariance

Orthogonal matrices preserve (\ell_2)-norm: (|U y|_2=|y|_2).

Write (A=U\Sigma V^\top). Let (x=Vy) (change coordinates). Then:
[
|Ax-b|_2 = |U\Sigma V^\top Vy - b|_2 = |U(\Sigma y) - b|_2.
]
Multiply by (U^\top) (norm unchanged):
[
|Ax-b|_2 = |\Sigma y - U^\top b|*2.
]
Let (\tilde b := U^\top b\in\mathbb R^m). The problem becomes:
[
\min*{y\in\mathbb R^n} |\Sigma y - \tilde b|_2.
]

### 7.2 Solve the diagonal/rectangular problem explicitly

Because (\Sigma) is diagonal in the first (r) coordinates:

* For (i\le r): ((\Sigma y)_i = \sigma_i y_i).
* For (i>r): ((\Sigma y)_i = 0) (in output coordinates).

So the squared error is:
[
|\Sigma y - \tilde b|*2^2
=\sum*{i=1}^r (\sigma_i y_i - \tilde b_i)^2 + \sum_{i=r+1}^{m} (0-\tilde b_i)^2.
]
The second sum does not depend on (y). So we minimize the first sum by choosing, for each (i\le r),
[
\sigma_i y_i = \tilde b_i \quad\Rightarrow\quad y_i^\star = \tilde b_i/\sigma_i.
]
For (i>r), (y_i) does not affect the objective (because those coordinates lie in (\mathcal N(A))). So the minimizers are:
[
y^\star =
\begin{pmatrix}
\tilde b_1/\sigma_1\
\vdots\
\tilde b_r/\sigma_r\
\text{free}\
\vdots
\end{pmatrix}.
]

Returning to (x=Vy), we get the full family of least-squares minimizers:
[
\boxed{\ x = A^+b + (I - A^+A)z,\quad z\in\mathbb R^n\ \text{arbitrary}. }
]
Why? Because (A^+b = V\Sigma^+U^\top b = V y_0) where (y_0) sets (y_i=\tilde b_i/\sigma_i) for (i\le r) and (0) for (i>r). And ((I-A^+A)) projects onto (\mathcal N(A)), i.e. it changes only the free coordinates (i>r).

### 7.3 Minimum-norm least squares solution

Among all minimizers, the one with smallest (|x|*2) is obtained by setting all “free” null-space coordinates to zero. That gives:
[
\boxed{\ x*{\min\ |x|} = A^+ b. }
]
**Reason (clean):** In (y)-coordinates, (V) is orthogonal so (|x|_2=|y|_2). The norm (|y|*2^2) is minimized by choosing the free coordinates (y*{r+1},\dots,y_n) as (0). ∎

### 7.4 The residual and projection interpretation

The fitted vector is:
[
\hat b := Ax^\star = A A^+ b,
]
and (AA^+) is the orthogonal projector onto (\mathcal C(A)). So least squares is literally:
[
\hat b = P_{\mathcal C(A)}(b).
]
The residual is
[
r=b-\hat b = (I-AA^+)b \in \mathcal N(A^\top),
]
matching Module 5’s “residual is orthogonal to column space.”

---

## 8) Best rank-(k) approximation: Eckart–Young–Mirsky (full, usable proof)

### 8.1 Define the truncated SVD

Let (A=U\Sigma V^\top) with singular values (\sigma_1\ge\cdots\ge\sigma_r>0).

For (k<r), define (\Sigma_k) by keeping only the top (k) singular values:
[
\Sigma_k=\mathrm{diag}(\sigma_1,\dots,\sigma_k,0,\dots,0)
\quad\text{(embedded in }m\times n\text{)}.
]
Define the rank-(k) truncation:
[
\boxed{\ A_k := U\Sigma_k V^\top. }
]
Clearly (\mathrm{rank}(A_k)=k).

### 8.2 The theorem (two norms)

Among all matrices (B) with (\mathrm{rank}(B)\le k):

* **Spectral norm optimality**
  [
  \boxed{\ \min_{\mathrm{rank}(B)\le k}|A-B|*2 = \sigma*{k+1},\quad \text{achieved by }B=A_k. }
  ]

* **Frobenius norm optimality**
  [
  \boxed{\ \min_{\mathrm{rank}(B)\le k}|A-B|*F^2 = \sum*{i=k+1}^r \sigma_i^2,\quad \text{achieved by }B=A_k. }
  ]

This is the Eckart–Young–Mirsky theorem.

---

### 8.3 Two key facts we use

#### Fact 1: Unitary/orthogonal invariance

For orthogonal (U,V),
[
|U M V^\top|_2=|M|_2,\qquad |U M V^\top|_F=|M|_F.
]
**Reason:** both norms can be expressed via singular values, or directly:

* Frobenius: (|UMV^\top|_F^2=\mathrm{tr}(V M^\top U^\top U M V^\top)=\mathrm{tr}(V M^\top M V^\top)=\mathrm{tr}(M^\top M)).
* Spectral: (|UMV^\top|*2=\max*{|x|=1}|UMV^\top x|=\max_{|x|=1}|M(V^\top x)|=|M|_2).

So we can rotate the problem into the SVD basis without changing distances.

#### Fact 2: Rank is invariant under orthogonal multiplications

[
\mathrm{rank}(UMV^\top)=\mathrm{rank}(M).
]

---

### 8.4 Reduce the problem to approximating a diagonal matrix

Let (A=U\Sigma V^\top). Consider any rank-(k) matrix (B). Define
[
\tilde B := U^\top B V.
]
Then (\mathrm{rank}(\tilde B)=\mathrm{rank}(B)\le k), and
[
|A-B| = |U\Sigma V^\top - B|
= |U(\Sigma - U^\top B V)V^\top|
= |\Sigma-\tilde B|
]
for both (|\cdot|_2) and (|\cdot|_F) by orthogonal invariance.

So the problem is equivalent to:
[
\min_{\mathrm{rank}(\tilde B)\le k}|\Sigma-\tilde B|.
]

Now (\Sigma) is diagonal with entries (\sigma_1,\dots,\sigma_r) (and the rest zeros). So we are approximating a diagonal matrix by a rank-(k) matrix.

---

### 8.5 Frobenius norm case (cleanest proof)

We claim the best rank-(k) approximation to diagonal (\Sigma) in Frobenius norm is (\Sigma_k).

**Step 1: Lower bound by “you can’t fit all diagonal energy with rank (k)”**

Write (\Sigma = \Sigma_k + \Sigma_{\perp}) where (\Sigma_{\perp}) contains the tail singular values (\sigma_{k+1},\dots,\sigma_r) on the diagonal.

Key observation: (\Sigma_k) and (\Sigma_\perp) are orthogonal in Frobenius inner product:
[
\langle \Sigma_k,\Sigma_\perp\rangle_F=\mathrm{tr}(\Sigma_k^\top\Sigma_\perp)=0
]
because they have disjoint diagonal supports.

For any (\tilde B) with rank (\le k), we want to show:
[
|\Sigma-\tilde B|*F^2 \ge |\Sigma*\perp|_F^2.
]

Consider decomposing (\tilde B) into its best match to (\Sigma_k) and the rest. A fully rigorous way is: among all rank-(k) matrices, (\Sigma_k) is itself rank-(k), so set (\tilde B=\Sigma_k) is feasible and achieves error (|\Sigma_\perp|_F). We must show no other (\tilde B) can do better.

A standard inequality here is: for any matrix (M), the sum of squares of its singular values equals (|M|_F^2), and rank (\le k) means at most (k) singular values are nonzero. But to keep this self-contained: the most transparent argument uses the fact that Frobenius norm is just Euclidean norm of entries. Any rank-(k) matrix (\tilde B) can match at most (k) independent directions perfectly; for a diagonal target, the best it can do is match the (k) largest diagonal entries and leave the rest.

Here’s a clean direct diagonal argument:

* For a diagonal (\Sigma), the Frobenius error is:
  [
  |\Sigma-\tilde B|*F^2 = \sum*{i}(\sigma_i-\tilde b_{ii})^2 + \sum_{i\ne j}\tilde b_{ij}^2.
  ]
  Off-diagonal entries of (\tilde B) only **increase** the error (since (\Sigma) has zeros off-diagonal). So an optimal (\tilde B) can be taken diagonal without increasing rank beyond (k) (a diagonal matrix has rank equal to number of nonzero diagonals).

* A diagonal matrix of rank (\le k) has at most (k) nonzero diagonal entries. So the best choice is:
  [
  \tilde b_{ii}=\sigma_i\ \text{for }i\le k,\quad \tilde b_{ii}=0\ \text{for }i>k,
  ]
  i.e. (\tilde B=\Sigma_k).

Then the minimal error is exactly:
[
|\Sigma-\Sigma_k|*F^2 = |\Sigma*\perp|*F^2 = \sum*{i=k+1}^r\sigma_i^2.
]
Thus for the original problem:
[
\min_{\mathrm{rank}(B)\le k}|A-B|*F^2=\sum*{i=k+1}^r\sigma_i^2,
]
achieved by (B=A_k). ∎

*(There are deeper proofs that don’t rely on “make it diagonal,” but this one is perfectly rigorous because we reduced to diagonal (\Sigma) using orthogonal invariance.)*

---

### 8.6 Spectral norm case (key idea: you can’t shrink the ((k+1))-th singular direction)

We prove:
[
\min_{\mathrm{rank}(B)\le k}|A-B|*2=\sigma*{k+1}.
]

Reduce again to diagonal (\Sigma). So we need:
[
\min_{\mathrm{rank}(\tilde B)\le k}|\Sigma-\tilde B|*2=\sigma*{k+1}.
]

**Step 1: Upper bound (construction)**
Take (\tilde B=\Sigma_k). Then
[
\Sigma-\Sigma_k=\mathrm{diag}(0,\dots,0,\sigma_{k+1},\dots,\sigma_r),
]
whose operator norm is its largest diagonal entry:
[
|\Sigma-\Sigma_k|*2=\sigma*{k+1}.
]
So the minimum is (\le\sigma_{k+1}).

**Step 2: Lower bound (any rank-(k) approximation leaves a vector in the “tail” that it can’t capture)**
A rank-(k) matrix (\tilde B\in\mathbb R^{m\times n}) has (\dim(\mathcal C(\tilde B))\le k). Consider the subspace spanned by the first (k+1) standard basis vectors in (\mathbb R^n):
[
S:=\mathrm{span}{e_1,\dots,e_{k+1}}.
]
Inside this ((k+1))-dimensional space, the map (x\mapsto \tilde Bx) has image dimension (\le k). Therefore its kernel restricted to (S) is nontrivial: there exists a nonzero (x\in S) such that (\tilde Bx=0). (This is rank–nullity on the linear map (\tilde B|_S:S\to\mathbb R^m).)

Pick such an (x\neq 0), and normalize it so (|x|_2=1). Then
[
|(\Sigma-\tilde B)x|_2 = |\Sigma x|_2,
]
because (\tilde Bx=0).

Now, because (x\in S), its coordinates satisfy (x_{k+2}=\cdots=x_n=0). Hence:
[
|\Sigma x|*2^2=\sum*{i=1}^{k+1}\sigma_i^2 x_i^2 \ge \sigma_{k+1}^2 \sum_{i=1}^{k+1} x_i^2 = \sigma_{k+1}^2|x|*2^2=\sigma*{k+1}^2,
]
since (\sigma_1\ge\cdots\ge\sigma_{k+1}) and (\sum_{i=1}^{k+1}x_i^2=1).

So (|\Sigma x|*2 \ge \sigma*{k+1}), hence
[
|\Sigma-\tilde B|*2 \ge |(\Sigma-\tilde B)x|*2 \ge \sigma*{k+1}.
]
This holds for every rank-(k) (\tilde B). Therefore the minimum is (\ge\sigma*{k+1}).

Combine with the upper bound (\le\sigma_{k+1}): the minimum equals (\sigma_{k+1}), achieved by (\Sigma_k), hence by (A_k). ∎

---

## 9) What you should now be able to do (no-mercy checklist)

You can proceed only if you can do these without “trust me” steps:

1. Construct the SVD from the eigen-decomposition of (A^\top A), including proving the (u_i) are orthonormal.
2. Read off all four fundamental subspaces from (U,V,r).
3. Prove (|A|_2=\sigma_1) and (|A|_F^2=\sum\sigma_i^2).
4. Prove the Moore–Penrose conditions for (A^+=V\Sigma^+U^\top).
5. Derive the full least-squares solution set and the minimum-norm solution (x=A^+b).
6. Prove Eckart–Young–Mirsky (at least the diagonal-reduction proof above) and remember the error formulas:
   [
   |A-A_k|*2=\sigma*{k+1},\qquad |A-A_k|*F^2=\sum*{i>k}\sigma_i^2.
   ]

---

## Next module

**Module 11 — Probability basics: covariance is PSD, variance in a direction is a quadratic form.**
This will feel *much* easier now because covariance is literally an (X^\top X)-type object, and PCA will drop out of “maximize a Rayleigh quotient” + “SVD of centered data.”

## Response:
Thought for 28s

Module 10 — SVD, pseudoinverse, and best rank- $k$  approximation
=================================================================

_(the “x-ray machine” for linear maps: rotate → stretch → rotate)_

0) What this module is secretly doing
-------------------------------------

The SVD is the one coordinate system change that makes **everything** in linear algebra and least squares feel inevitable:

*   “four fundamental subspaces” become “first  $r$  columns of  $U$ / $V$  vs the rest,”
*    $\|A\|_2$ , conditioning, and sensitivity become “largest vs smallest stretch,”
*   least squares becomes “solve a diagonal problem,”
*   pseudoinverse becomes “invert the nonzero stretches and kill the rest,”
*   best rank- $k$  approximation becomes “keep the  $k$  biggest stretches, drop the tail.”

If you _really_ own SVD, many later proofs reduce to:

> “Apply orthogonal changes of coordinates so the matrix is diagonal, then the statement is obvious.”

* * *

1) Setup and notation (precision now saves pain later)
======================================================

Let  $A\in\mathbb R^{m\times n}$ . Define

$$
p:=\min(m,n),\qquad r:=\operatorname{rank}(A).
$$

An **orthogonal** matrix  $Q\in\mathbb R^{d\times d}$  satisfies  $Q^\top Q = QQ^\top = I$ .  
Equivalently: its columns form an orthonormal basis of  $\mathbb R^d$ .

We will order singular values as

$$
\sigma_1\ge \sigma_2\ge \cdots \ge \sigma_r > 0,\qquad \sigma_{r+1}=\cdots=\sigma_p=0.
$$

Key facts already proven earlier (we’ll reuse them explicitly):

*    $A^\top A\succeq 0$  and symmetric.
*   Spectral theorem: symmetric  $\Rightarrow$  orthogonal diagonalization.
*    $\|A\|_2^2=\lambda_{\max}(A^\top A)$  and Rayleigh extremal characterization.

* * *

2) Singular values and singular vectors (definitions that match geometry)
=========================================================================

2.1 Singular values
-------------------

Because  $A^\top A$  is symmetric PSD, it has real eigenvalues

$$
\lambda_1\ge \cdots \ge \lambda_n \ge 0.
$$

Define

 $$
\boxed{\ \sigma_i(A):=\sqrt{\lambda_i(A^\top A)}\ \ \ (i=1,\dots,p)\ }
$$

and order them nonincreasingly (padding with zeros if needed).

So “singular values” are literally “square roots of eigenvalues of  $A^\top A$ .”

2.2 Right singular vectors
--------------------------

A **right singular vector**  $v_i\in\mathbb R^n$  is a unit eigenvector of  $A^\top A$ :

 $$
\boxed{\ A^\top A v_i = \sigma_i^2 v_i,\qquad \|v_i\|_2=1. }
$$

For symmetric matrices, eigenvectors for different eigenvalues can be chosen orthonormal; we’ll take  $v_1,\dots,v_n$  to be an orthonormal basis.

2.3 Left singular vectors (defined only for  $\sigma_i>0$ )
-----------------------------------------------------------

For each  $i\le r$  (so  $\sigma_i>0$ ), define

 $$
\boxed{\ u_i := \frac{1}{\sigma_i}A v_i \in \mathbb R^m. }
$$

This definition is not arbitrary: it forces  $Av_i$  to align with a unit vector  $u_i$ , i.e.

$$
Av_i = \sigma_i u_i.
$$

* * *

3) The SVD theorem (statement)
==============================

Theorem (SVD)
-------------

There exist orthogonal matrices  $U\in\mathbb R^{m\times m}$ ,  $V\in\mathbb R^{n\times n}$ , and a “rectangular diagonal” matrix  $\Sigma\in\mathbb R^{m\times n}$  of the form

$$
\Sigma= \begin{pmatrix} \operatorname{diag}(\sigma_1,\dots,\sigma_r) & 0\\ 0 & 0 \end{pmatrix},
$$

such that

 $$
\boxed{\ A = U\Sigma V^\top. }
$$

There is also the **thin SVD** (often the most useful):

 $$
\boxed{\ A = U_r \Sigma_r V_r^\top }
$$

where  $U_r\in\mathbb R^{m\times r}$ ,  $V_r\in\mathbb R^{n\times r}$  have orthonormal columns, and  $\Sigma_r=\operatorname{diag}(\sigma_1,\dots,\sigma_r)\in\mathbb R^{r\times r}$ .

* * *

4) Existence proof (constructive; no magic)
===========================================

Step 1: diagonalize  $A^\top A$ 
--------------------------------

By spectral theorem (since  $A^\top A$  is symmetric PSD),

$$
A^\top A = V\Lambda V^\top,
$$

where  $V=[v_1,\dots,v_n]$  is orthogonal and  $\Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_n)$  with  $\lambda_i\ge 0$ .  
Set  $\sigma_i:=\sqrt{\lambda_i}$  and reorder so  $\sigma_1\ge\cdots\ge\sigma_n\ge 0$ . Let  $r$  be the number of positive  $\sigma_i$ .

So we have

$$
A^\top A v_i = \sigma_i^2 v_i,\qquad v_i^\top v_j=\delta_{ij}.
$$

Step 2: define  $u_i$  for  $\sigma_i>0$  and prove orthonormality
------------------------------------------------------------------

For  $i\le r$ , define  $u_i=\frac{1}{\sigma_i}Av_i$ .

### Claim:  $\{u_1,\dots,u_r\}$  is orthonormal.

Take any  $i,j\le r$ . Compute carefully:

$$
u_i^\top u_j =\frac{1}{\sigma_i\sigma_j}(Av_i)^\top(Av_j) =\frac{1}{\sigma_i\sigma_j}v_i^\top(A^\top A)v_j.
$$

Now use  $A^\top A v_j=\sigma_j^2 v_j$ :

$$
u_i^\top u_j =\frac{1}{\sigma_i\sigma_j}v_i^\top(\sigma_j^2 v_j) =\frac{\sigma_j}{\sigma_i}v_i^\top v_j =\frac{\sigma_j}{\sigma_i}\delta_{ij}.
$$

So if  $i\neq j$ ,  $u_i^\top u_j=0$ ; if  $i=j$ ,  $u_i^\top u_i=1$ . ∎

Step 3: extend to an orthonormal basis of  $\mathbb R^m$ 
---------------------------------------------------------

Extend  $\{u_1,\dots,u_r\}$  to an orthonormal basis  $\{u_1,\dots,u_m\}$  (Gram–Schmidt).  
Let  $U=[u_1,\dots,u_m]\in\mathbb R^{m\times m}$ , orthogonal.

Step 4: show the “diagonal action” on the  $v_i$ ’s
---------------------------------------------------

*   For  $i\le r$ : by definition  $Av_i=\sigma_i u_i$ .
*   For  $i>r$ :  $\sigma_i=0$ , so  $A^\top A v_i=0$ . Then
    $$
    \|Av_i\|_2^2 = (Av_i)^\top(Av_i) = v_i^\top(A^\top A)v_i = 0 \Rightarrow Av_i=0.
    $$

Step 5: assemble  $A=U\Sigma V^\top$ 
-------------------------------------

Look at the product  $AV$ . Its  $i$ \-th column is  $Av_i$ . From Step 4:

$$
AV = [\sigma_1 u_1\ \cdots\ \sigma_r u_r\ 0\ \cdots\ 0].
$$

Multiply on the left by  $U^\top$ . Since  $U^\top u_i=e_i$ ,

$$
U^\top A V = \Sigma,
$$

where  $\Sigma$  has  $\sigma_1,\dots,\sigma_r$  on its (rectangular) diagonal and zeros elsewhere. Therefore

$$
A = U\Sigma V^\top.
$$

That’s the SVD. ∎

* * *

5) Immediate consequences you should _use automatically_
========================================================

5.1  $AA^\top$  has the same nonzero eigenvalues as  $A^\top A$ 
----------------------------------------------------------------

From  $A=U\Sigma V^\top$ ,

$$
AA^\top = U\Sigma\Sigma^\top U^\top,\qquad A^\top A = V\Sigma^\top\Sigma V^\top.
$$

So the eigenvalues of  $AA^\top$  are  $\sigma_i^2$  (plus zeros), and similarly for  $A^\top A$ .

5.2 Rank = number of positive singular values
---------------------------------------------

 $\Sigma$  has exactly  $r$  nonzero diagonal entries, hence

 $$
\boxed{\ \operatorname{rank}(A)=r=\#\{i:\sigma_i>0\}. }
$$

5.3 Norm identities
-------------------

*   Operator norm:
     $$
    \boxed{\ \|A\|_2 = \sigma_1. }
    $$
*   Frobenius norm:
     $$
    \boxed{\ \|A\|_F^2 = \sum_{i=1}^r \sigma_i^2. }
    $$
    Proof:  $\|A\|_F^2=\operatorname{tr}(A^\top A)=\operatorname{tr}(V\Sigma^\top\Sigma V^\top)=\operatorname{tr}(\Sigma^\top\Sigma)=\sum \sigma_i^2$ .

5.4 Geometry: rotate → stretch → rotate
---------------------------------------

For any  $x\in\mathbb R^n$ ,

$$
Ax = U\Sigma V^\top x.
$$

Interpret:

1.   $V^\top$ : rotate/reflect input coordinates,
2.   $\Sigma$ : stretch by  $\sigma_i$  in the first  $r$  coordinates, kill the rest,
3.   $U$ : rotate/reflect output coordinates.

So the unit sphere maps to an ellipsoid whose semiaxes are  $\sigma_1,\dots,\sigma_r$ .

* * *

6) The four fundamental subspaces from SVD (the cleanest possible statement)
============================================================================

Let  $A=U\Sigma V^\top$  with rank  $r$ .

 $$
\boxed{\ \mathcal C(A)=\operatorname{span}(u_1,\dots,u_r)\subseteq\mathbb R^m\ }
$$  $$
\boxed{\ \mathcal N(A^\top)=\operatorname{span}(u_{r+1},\dots,u_m)\subseteq\mathbb R^m\ }
$$  $$
\boxed{\ \mathcal C(A^\top)=\operatorname{span}(v_1,\dots,v_r)\subseteq\mathbb R^n\ }
$$  $$
\boxed{\ \mathcal N(A)=\operatorname{span}(v_{r+1},\dots,v_n)\subseteq\mathbb R^n\ }
$$

**Why these are true (one proof covers all):** write any  $x=Vy$ . Then

$$
Ax = U\Sigma y = \sum_{i=1}^r \sigma_i y_i u_i.
$$

So outputs live in  $\operatorname{span}(u_1,\dots,u_r)$ , and every  $u_i$  with  $i\le r$  is achieved by  $u_i=(1/\sigma_i)Av_i$ . Nullspace corresponds to coordinates with  $y_1=\cdots=y_r=0$ , i.e. span of the remaining  $v$ ’s. Left-null similarly from  $A^\top$ . ∎

This recovers Module 4’s orthogonality laws as “first block vs tail block”.

* * *

7) Pseudoinverse  $A^+$  (definition + what it _does_)
======================================================

7.1 Define  $\Sigma^+$  and  $A^+$ 
-----------------------------------

Define  $\Sigma^+\in\mathbb R^{n\times m}$  by

$$
(\Sigma^+)_{ii}= \begin{cases} 1/\sigma_i,& i\le r\\ 0,& i>r. \end{cases}
$$

Then define the Moore–Penrose pseudoinverse:

 $$
\boxed{\ A^+ := V\Sigma^+U^\top. }
$$

Equivalent “sum” form (very useful):

 $$
\boxed{\ A^+ = \sum_{i=1}^r \frac{1}{\sigma_i} v_i u_i^\top. }
$$

7.2 Moore–Penrose equations (and verification)
----------------------------------------------

 $A^+$  is characterized by four identities:

1.   $AA^+A=A$ 
2.   $A^+AA^+=A^+$ 
3.   $(AA^+)^\top=AA^+$ 
4.   $(A^+A)^\top=A^+A$ 

**Check them mechanically using SVD:**

$$
AA^+A = U(\Sigma\Sigma^+\Sigma)V^\top = U\Sigma V^\top = A,
$$

since  $\Sigma\Sigma^+\Sigma=\Sigma$  entrywise on the diagonal. Similarly for (2).  
For (3),

$$
AA^+=U(\Sigma\Sigma^+)U^\top,
$$

and  $\Sigma\Sigma^+$  is diagonal with  $1$ ’s then  $0$ ’s, hence symmetric. Same for  $A^+A$ . ∎

7.3 Projector interpretation (extremely important)
--------------------------------------------------

 $$
\boxed{\ AA^+ = P_{\mathcal C(A)} \quad\text{(orthogonal projector onto column space)} }
$$  $$
\boxed{\ A^+A = P_{\mathcal C(A^\top)} \quad\text{(orthogonal projector onto row space)} }
$$

You can see this directly:  $AA^+=U(\Sigma\Sigma^+)U^\top$  acts like identity on  $\operatorname{span}(u_1,\dots,u_r)$  and kills  $\operatorname{span}(u_{r+1},\dots,u_m)$ .

7.4 Special cases you should recognize instantly
------------------------------------------------

*   If  $A$  is square invertible:  $A^+=A^{-1}$ .
*   If  $A$  has full column rank ( $r=n$ ,  $m\ge n$ ):
     $$
    \boxed{\ A^+ = (A^\top A)^{-1}A^\top. }
    $$
*   If  $A$  has full row rank ( $r=m$ ,  $n\ge m$ ):
     $$
    \boxed{\ A^+ = A^\top(AA^\top)^{-1}. }
    $$

These fall out by writing SVD and simplifying the diagonal inverses.

* * *

8) Least squares solved completely by SVD
=========================================

We want:

$$
\min_{x\in\mathbb R^n}\|Ax-b\|_2.
$$

8.1 Reduce to a diagonal problem
--------------------------------

Write  $A=U\Sigma V^\top$ , and change variables  $x=Vy$ . Then

$$
\|Ax-b\|_2 = \|U\Sigma y - b\|_2.
$$

Left-multiply by  $U^\top$  (orthogonal, preserves norms):

$$
\|Ax-b\|_2 = \|\Sigma y - \tilde b\|_2,\qquad \tilde b:=U^\top b.
$$

Now  $\Sigma y$  has entries  $(\sigma_1 y_1,\dots,\sigma_r y_r,0,\dots)$ . So

$$
\|\Sigma y-\tilde b\|_2^2 =\sum_{i=1}^r(\sigma_i y_i-\tilde b_i)^2+\sum_{i=r+1}^{m}(\tilde b_i)^2.
$$

The second sum is constant in  $y$ . Minimize termwise:

$$
y_i^\star=\tilde b_i/\sigma_i \ (i\le r),\qquad y_{r+1},\dots,y_n \ \text{free}.
$$

8.2 Full solution set
---------------------

Returning to  $x=Vy$ , every least-squares minimizer has the form:

 $$
\boxed{\ x = A^+b + z,\quad z\in\mathcal N(A). }
$$

Equivalently:

 $$
\boxed{\ x = A^+b + (I-A^+A)w,\quad w\in\mathbb R^n. }
$$

(Here  $I-A^+A$  is the orthogonal projector onto  $\mathcal N(A)$ .)

8.3 The minimum-norm least squares solution
-------------------------------------------

Among all minimizers, the unique one with smallest  $\|x\|_2$  is obtained by setting the free null-space coordinates to zero:

 $$
\boxed{\ x_{\min\text{-}\|x\|} = A^+b. }
$$

8.4 Fitted value and residual as projections
--------------------------------------------

The fitted vector is

$$
\hat b = Ax^\star = AA^+b = P_{\mathcal C(A)}b,
$$

and the residual

$$
r=b-\hat b = (I-AA^+)b \in \mathcal N(A^\top),
$$

exactly matching Module 5’s “residual orthogonal to column space”.

* * *

9) Best rank- $k$  approximation (Eckart–Young–Mirsky) with full proofs
=======================================================================

Let  $A=U\Sigma V^\top$  with singular values  $\sigma_1\ge\cdots\ge\sigma_r>0$ . For  $k<r$ , define the truncated SVD:

$$
\Sigma_k=\operatorname{diag}(\sigma_1,\dots,\sigma_k,0,\dots),\qquad \boxed{\ A_k:=U\Sigma_k V^\top. }
$$

Then  $\operatorname{rank}(A_k)=k$ .

Theorem (Eckart–Young–Mirsky, spectral + Frobenius)
---------------------------------------------------

Among all matrices  $B$  with  $\operatorname{rank}(B)\le k$ :

 $$
\boxed{\ \min_{\operatorname{rank}(B)\le k}\|A-B\|_2 = \sigma_{k+1},\quad \text{achieved by }B=A_k. }
$$  $$
\boxed{\ \min_{\operatorname{rank}(B)\le k}\|A-B\|_F^2 = \sum_{i=k+1}^r\sigma_i^2,\quad \text{achieved by }B=A_k. }
$$

### 9.1 Two invariances we’ll use (prove once, use forever)

**Orthogonal invariance of norms.** For orthogonal  $U,V$ :

$$
\|UMV^\top\|_2=\|M\|_2,\qquad \|UMV^\top\|_F=\|M\|_F.
$$
*   Frobenius:  $\|UMV^\top\|_F^2=\operatorname{tr}(V M^\top U^\top U M V^\top)=\operatorname{tr}(M^\top M)$ .
*   Operator norm:  $\|UMV^\top\|_2=\max_{\|x\|=1}\|UMV^\top x\|=\max_{\|x\|=1}\|M(V^\top x)\|=\|M\|_2$ .

**Rank invariance.**  $\operatorname{rank}(UMV^\top)=\operatorname{rank}(M)$ .

### 9.2 Reduce to approximating  $\Sigma$ 

Given any  $B$  with  $\operatorname{rank}(B)\le k$ , define

$$
\tilde B := U^\top B V.
$$

Then  $\operatorname{rank}(\tilde B)\le k$ , and

$$
\|A-B\| = \|U\Sigma V^\top - B\| = \|\Sigma - U^\top B V\| = \|\Sigma-\tilde B\|
$$

for both  $\|\cdot\|_2$  and  $\|\cdot\|_F$ .

So it suffices to solve:

$$
\min_{\operatorname{rank}(\tilde B)\le k}\|\Sigma-\tilde B\|.
$$

* * *

9.3 Frobenius norm proof (diagonal target  $\Rightarrow$  diagonal optimizer)
-----------------------------------------------------------------------------

Write  $\Sigma$  as a rectangular diagonal matrix with diagonal entries  $\sigma_1,\dots,\sigma_r$ .

**Key observation:** For any  $\tilde B$ ,

$$
\|\Sigma-\tilde B\|_F^2 =\sum_{i=1}^m\sum_{j=1}^n (\Sigma_{ij}-\tilde B_{ij})^2 =\sum_{i=1}^{p}(\sigma_i-\tilde B_{ii})^2 + \sum_{(i,j)\neq (i,i)} \tilde B_{ij}^2,
$$

because  $\Sigma_{ij}=0$  off the diagonal.

So:

*   Any off-diagonal entry  $\tilde B_{ij}$  with  $i\neq j$  **only increases** the objective (it contributes  $+\tilde B_{ij}^2$ ).
*   Therefore there is always an optimal solution among **diagonal** matrices  $\tilde B$  (set off-diagonals to zero; rank cannot increase).

Now constrain  $\operatorname{rank}(\tilde B)\le k$ . For diagonal matrices, rank equals the number of nonzero diagonal entries, so  $\tilde B$  can match at most  $k$  diagonal positions.

To minimize  $\sum_{i=1}^{p}(\sigma_i-\tilde B_{ii})^2$ , the optimal strategy is:

*   choose  $\tilde B_{ii}=\sigma_i$  for the  $k$  largest  $\sigma_i$  (i.e.  $i=1,\dots,k$ ),
*   set the rest  $\tilde B_{ii}=0$ .

That is exactly  $\tilde B=\Sigma_k$ , yielding error

$$
\|\Sigma-\Sigma_k\|_F^2=\sum_{i=k+1}^r \sigma_i^2.
$$

Therefore, returning to original coordinates,  $A_k$  is optimal and achieves the stated minimum. ∎

* * *

9.4 Spectral norm proof (a rank- $k$  matrix can’t kill the  $(k+1)$ \-th axis)
-------------------------------------------------------------------------------

We show:

$$
\min_{\operatorname{rank}(\tilde B)\le k}\|\Sigma-\tilde B\|_2=\sigma_{k+1}.
$$

**Upper bound (constructive):** take  $\tilde B=\Sigma_k$ . Then  $\Sigma-\Sigma_k$  has diagonal  $(0,\dots,0,\sigma_{k+1},\dots)$ , so its operator norm is the largest remaining diagonal entry:

$$
\|\Sigma-\Sigma_k\|_2=\sigma_{k+1}.
$$

So the minimum is  $\le \sigma_{k+1}$ .

**Lower bound (works for every rank- $k$   $\tilde B$ ):**

Let  $S:=\operatorname{span}\{e_1,\dots,e_{k+1}\}\subseteq\mathbb R^n$ . Then  $\dim(S)=k+1$ .

Consider the linear map  $\tilde B|_S:S\to\mathbb R^m$ . Its rank is  $\le \operatorname{rank}(\tilde B)\le k$ . By rank–nullity on the  $(k+1)$ \-dimensional domain  $S$ ,

$$
\dim(\ker(\tilde B|_S)) \ge 1,
$$

so there exists  $x\in S\setminus\{0\}$  with  $\tilde Bx=0$ . Normalize so  $\|x\|_2=1$ .

Then

$$
\|(\Sigma-\tilde B)x\|_2 = \|\Sigma x\|_2,
$$

since  $\tilde Bx=0$ .

Because  $x\in S$ , it has the form  $x=(x_1,\dots,x_{k+1},0,\dots,0)$ . Hence

$$
\|\Sigma x\|_2^2 =\sum_{i=1}^{k+1} \sigma_i^2 x_i^2 \ge \sigma_{k+1}^2 \sum_{i=1}^{k+1} x_i^2 = \sigma_{k+1}^2\|x\|_2^2 =\sigma_{k+1}^2,
$$

since  $\sigma_i\ge\sigma_{k+1}$  for  $i\le k+1$ .

Therefore  $\|\Sigma x\|_2\ge \sigma_{k+1}$ , and so

$$
\|\Sigma-\tilde B\|_2 \ge \|(\Sigma-\tilde B)x\|_2 \ge \sigma_{k+1}.
$$

This holds for every rank- $k$   $\tilde B$ . Thus the minimum is  $\ge \sigma_{k+1}$ .

Combine lower + upper bounds: the minimum equals  $\sigma_{k+1}$ , achieved by  $\Sigma_k$ , hence by  $A_k$ . ∎

* * *

10) Conditioning via SVD (now it’s trivial)
===========================================

If  $A$  is square invertible, then  $r=n$  and all  $\sigma_i>0$ . Then

$$
\|A\|_2=\sigma_1,\qquad \|A^{-1}\|_2=\frac{1}{\sigma_n},
$$

so

 $$
\boxed{\ \kappa_2(A)=\frac{\sigma_1}{\sigma_n}. }
$$

Geometrically: how elongated  $A$  makes the unit sphere.

* * *

11) End-of-Module 10 checklist (you’re not allowed to handwave these)
=====================================================================

You should be able to do, cold:

1.  Construct SVD from the eigendecomposition of  $A^\top A$ , including the orthonormality proof for  $u_i$ .
2.  Read off  $\mathcal C(A),\mathcal N(A),\mathcal C(A^\top),\mathcal N(A^\top)$  from  $U,V,r$ .
3.  Prove  $\|A\|_2=\sigma_1$  and  $\|A\|_F^2=\sum\sigma_i^2$ .
4.  Define  $A^+=V\Sigma^+U^\top$  and verify the Moore–Penrose equations.
5.  Solve least squares completely and show the minimum-norm solution is  $A^+b$ .
6.  Prove Eckart–Young–Mirsky in both  $\|\cdot\|_2$  and  $\|\cdot\|_F$  with the diagonal reduction + lower-bound argument.

* * *

Next module (preview, not fluff)
--------------------------------

**Module 11 — Covariance is PSD, variance-in-a-direction is a quadratic form, PCA as an optimization problem, and PCA = truncated SVD of centered data.**  
After this module, PCA will stop being “stats folklore” and become “Rayleigh quotient + SVD machinery.”

## Prompt:
Now this:

# Module 11 — Probability basics: covariance is PSD (and variance is a quadratic form)

*(the “probability + geometry” bridge: random vectors become ellipsoids)*

## 0) What this module is secretly doing

PCA, least squares, ridge regression, Kalman filters, portfolio theory, and half of modern stats all run on one object:

[
\Sigma := \mathrm{Cov}(X).
]

This module builds from bedrock (random vectors → expectation → covariance) and proves the two facts you absolutely must own:

1. (\Sigma\succeq 0) (covariance is PSD).
2. Variance in direction (u) is a quadratic form:
   [
   \mathrm{Var}(u^\top X)=u^\top \Sigma u.
   ]

Once these are internal, PCA becomes “maximize a Rayleigh quotient” (Module 8) and “SVD of centered data” (Module 10).

---

# 1) Random vectors: what they are (no mystical fog)

## 1.1 Random variable

A real random variable (Z) is a measurable function from an underlying probability space ((\Omega,\mathcal F,\mathbb P)) into (\mathbb R).
You usually don’t need the (\Omega)-machinery operationally, but it matters conceptually: randomness is “unknown outcome (\omega\in\Omega)” passed through a function.

## 1.2 Random vector

A random vector (X\in\mathbb R^n) is simply (n) random variables stacked:
[
X=
\begin{bmatrix}
X_1\ \vdots\ X_n
\end{bmatrix}.
]
Each sample (X(\omega)) is an ordinary vector in (\mathbb R^n).

**Mental model:** a random vector is a distribution over points in (\mathbb R^n). If you draw many samples, you see a point cloud.

---

# 2) Expectation: scalar, vector, and matrix forms

We assume expectations exist (finite) when we write them. (This is domain honesty: heavy-tailed distributions can break second moments.)

## 2.1 Scalar expectation

For a real random variable (Z), (\mathbb E[Z]) is its average value (integral/sum). Basic properties we will use:

* Linearity:
  [
  \mathbb E[aZ+bW]=a\mathbb E[Z]+b\mathbb E[W].
  ]
* Nonnegativity: if (Z\ge 0) almost surely, then (\mathbb E[Z]\ge 0).

## 2.2 Vector expectation

For (X\in\mathbb R^n),
[
\boxed{\ \mu := \mathbb E[X]\in\mathbb R^n,\quad \mu_i=\mathbb E[X_i].\ }
]
Linearity holds componentwise:
[
\mathbb E[AX+b]=A\mathbb E[X]+b
]
for deterministic (A,b).

## 2.3 Matrix expectation

For a random matrix (M), (\mathbb E[M]) is entrywise expectation:
[
(\mathbb E[M])*{ij}=\mathbb E[M*{ij}].
]
Linearity still holds.

---

# 3) Covariance: definition, expansions, and symmetry

Let (X\in\mathbb R^n) with mean (\mu=\mathbb E[X]), and assume (\mathbb E[|X|_2^2]<\infty) (finite second moment).

## 3.1 Definition

[
\boxed{\ \Sigma := \mathrm{Cov}(X) := \mathbb E\big[(X-\mu)(X-\mu)^\top\big].\ }
]
This is an (n\times n) matrix.

### Why this definition?

* (X-\mu) is the “centered” random vector (deviation from mean).
* ((X-\mu)(X-\mu)^\top) is an outer product: a rank-1 PSD matrix capturing direction and magnitude of deviation.
* Expectation averages these outer products over the distribution.

## 3.2 Entrywise meaning

The ((i,j)) entry is:
[
\Sigma_{ij}=\mathbb E[(X_i-\mu_i)(X_j-\mu_j)].
]
So:

* diagonal entries (\Sigma_{ii}=\mathbb E[(X_i-\mu_i)^2]=\mathrm{Var}(X_i)),
* off-diagonals measure co-movement (covariance).

## 3.3 Symmetry

[
\Sigma^\top = \mathbb E\big[((X-\mu)(X-\mu)^\top)^\top\big]
=\mathbb E\big[(X-\mu)(X-\mu)^\top\big]
=\Sigma,
]
since outer products are symmetric after transpose. So
[
\boxed{\ \Sigma\in\mathbf S^n. }
]

---

# 4) Core theorem 1: covariance is PSD (full proof)

## Theorem

[
\boxed{\ \Sigma=\mathrm{Cov}(X)\succeq 0. }
]

### Proof (directional quadratic form test)

To prove PSD, we must show:
[
u^\top \Sigma u \ge 0\quad\forall u\in\mathbb R^n.
]

Compute:
[
u^\top \Sigma u
= u^\top \mathbb E[(X-\mu)(X-\mu)^\top] u.
]
Use linearity of expectation and the fact that (u) is deterministic, so we can pull it through:
[
u^\top \Sigma u
= \mathbb E\big[u^\top (X-\mu)(X-\mu)^\top u\big].
]
Now observe the scalar identity:
[
u^\top (X-\mu)(X-\mu)^\top u
= \big((X-\mu)^\top u\big)\big((X-\mu)^\top u\big)
= \big(u^\top (X-\mu)\big)^2.
]
So:
[
u^\top \Sigma u
= \mathbb E\big[(u^\top (X-\mu))^2\big].
]
But ((u^\top(X-\mu))^2\ge 0) almost surely, so its expectation is (\ge 0). Hence (u^\top\Sigma u\ge 0) for all (u). Therefore (\Sigma\succeq 0). ∎

**Commentary (what’s really going on):**
Covariance is an average of outer products (yy^\top), and every outer product is PSD. “Average of PSD matrices is PSD,” because PSD is defined by a set of linear inequalities (u^\top(\cdot)u\ge 0) preserved under expectation.

---

# 5) Core theorem 2: variance in a direction is (u^\top\Sigma u)

This is the single formula that makes PCA an optimization problem.

## Theorem

For any deterministic vector (u\in\mathbb R^n),
[
\boxed{\ \mathrm{Var}(u^\top X)=u^\top \Sigma u. }
]

### Proof (expand the definition carefully)

Let (Z:=u^\top X) (a scalar random variable). Then
[
\mathrm{Var}(Z)=\mathbb E[(Z-\mathbb E[Z])^2].
]
Compute (\mathbb E[Z]):
[
\mathbb E[Z]=\mathbb E[u^\top X]=u^\top \mathbb E[X]=u^\top\mu.
]
So:
[
Z-\mathbb E[Z]=u^\top X - u^\top\mu = u^\top(X-\mu).
]
Therefore:
[
\mathrm{Var}(u^\top X)
=\mathbb E\big[(u^\top(X-\mu))^2\big].
]
But from the PSD proof,
[
\mathbb E\big[(u^\top(X-\mu))^2\big]=u^\top\Sigma u.
]
Hence (\mathrm{Var}(u^\top X)=u^\top\Sigma u). ∎

**Interpretation:**
(\Sigma) is the matrix that encodes how variance changes with direction. It is literally a quadratic form on directions (u).

---

# 6) Useful covariance identities (with proofs)

## 6.1 Expansion: (\Sigma=\mathbb E[XX^\top]-\mu\mu^\top)

This form is used constantly in algebra.

### Proposition

[
\boxed{\ \mathrm{Cov}(X)=\mathbb E[XX^\top]-\mu\mu^\top. }
]

### Proof

Start from definition:
[
\Sigma=\mathbb E[(X-\mu)(X-\mu)^\top].
]
Expand the product:
[
(X-\mu)(X-\mu)^\top
=XX^\top - X\mu^\top - \mu X^\top + \mu\mu^\top.
]
Take expectation term-by-term:
[
\Sigma=\mathbb E[XX^\top]-\mathbb E[X]\mu^\top-\mu\mathbb E[X]^\top+\mu\mu^\top.
]
But (\mathbb E[X]=\mu), so:
[
\Sigma=\mathbb E[XX^\top]-\mu\mu^\top-\mu\mu^\top+\mu\mu^\top
=\mathbb E[XX^\top]-\mu\mu^\top.
]
∎

---

## 6.2 Affine transformation rule

If (Y=AX+b) for deterministic (A\in\mathbb R^{m\times n}), (b\in\mathbb R^m), then
[
\boxed{\ \mathrm{Cov}(Y)=A,\mathrm{Cov}(X),A^\top. }
]

### Proof

Mean of (Y):
[
\mathbb E[Y]=\mathbb E[AX+b]=A\mathbb E[X]+b=A\mu+b.
]
Centered version:
[
Y-\mathbb E[Y]=AX+b-(A\mu+b)=A(X-\mu).
]
Covariance:
[
\mathrm{Cov}(Y)=\mathbb E[(Y-\mathbb E[Y])(Y-\mathbb E[Y])^\top]
=\mathbb E[A(X-\mu)(X-\mu)^\top A^\top]
=A,\mathbb E[(X-\mu)(X-\mu)^\top],A^\top
=A\Sigma A^\top.
]
∎

**Commentary:**
Covariance transforms like a quadratic form, exactly as you’d expect from “variance in a direction is quadratic.”

---

# 7) Sample covariance (the computational object) and PSD

In data, you typically have samples (x^{(1)},\dots,x^{(N)}\in\mathbb R^n).

## 7.1 Sample mean

[
\bar x := \frac{1}{N}\sum_{k=1}^N x^{(k)}.
]

## 7.2 Two common sample covariance formulas

### (A) “Biased” (ML for Gaussian) version

[
S := \frac{1}{N}\sum_{k=1}^N (x^{(k)}-\bar x)(x^{(k)}-\bar x)^\top.
]

### (B) “Unbiased” version (for i.i.d. samples)

[
\hat S := \frac{1}{N-1}\sum_{k=1}^N (x^{(k)}-\bar x)(x^{(k)}-\bar x)^\top.
]
Both are PSD because they are sums of PSD outer products with positive weights.

### Proof of PSD for (S)

For any (u),
[
u^\top S u
=\frac{1}{N}\sum_{k=1}^N u^\top(x^{(k)}-\bar x)(x^{(k)}-\bar x)^\top u
=\frac{1}{N}\sum_{k=1}^N (u^\top(x^{(k)}-\bar x))^2\ge 0.
]
So (S\succeq 0). Same for (\hat S). ∎

---

# 8) Geometry: covariance ellipsoids (why PSD is not a technicality)

If (\Sigma\succ 0), consider the set
[
E := {x\in\mathbb R^n : (x-\mu)^\top \Sigma^{-1}(x-\mu)\le 1}.
]
That’s an ellipsoid centered at (\mu).

* Its principal axes are eigenvectors of (\Sigma).
* Its radii are proportional to (\sqrt{\lambda_i(\Sigma)}).

So covariance literally encodes the “shape” of the distribution’s spread.

**Edge case:** if (\Sigma\succeq 0) but singular, the ellipsoid is “flat” in some directions: the distribution lives in a lower-dimensional subspace (perfect linear relations).

---

# 9) End-of-Module 11 checklist (must be instant)

You can:

1. Define (\mu=\mathbb E[X]) and (\Sigma=\mathbb E[(X-\mu)(X-\mu)^\top]) with domain honesty (finite second moments).
2. Prove (\Sigma\succeq 0) by showing (u^\top\Sigma u=\mathbb E[(u^\top(X-\mu))^2]\ge0).
3. Prove (\mathrm{Var}(u^\top X)=u^\top\Sigma u).
4. Prove (\Sigma=\mathbb E[XX^\top]-\mu\mu^\top).
5. Prove (\mathrm{Cov}(AX+b)=A\Sigma A^\top).
6. Show sample covariance is PSD (sum of squares argument).

---

## Next module

**Module 12 — PCA: three equivalent lenses (max variance / min reconstruction / SVD equivalence).**
We’ll derive PCA as:

* a Rayleigh quotient problem ((\max_{|u|=1}u^\top\Sigma u)),
* a best rank-(k) approximation problem,
* and an SVD of the centered data matrix.

## Response:
Thought for 21s

Module 11 — Probability basics: covariance is PSD (and variance is a quadratic form)
====================================================================================

_(the “probability + geometry” bridge: random vectors become ellipsoids)_

0) What this module is secretly doing
-------------------------------------

A ridiculous amount of modern statistics + optimization is secretly linear algebra wearing a probability hat.

The central object is the covariance matrix

$$
\Sigma:=\mathrm{Cov}(X).
$$

This module builds from bedrock (random vector → expectation → covariance) and proves two facts you must own so hard they become reflexes:

1.  **Covariance is PSD**:
     $$
\boxed{\ \Sigma\succeq 0\ } 
$$2.  **Variance in direction  $u$ ** is a quadratic form:
     $$
\boxed{\ \mathrm{Var}(u^\top X)=u^\top \Sigma u\ }.
$$

Once these are internal, PCA becomes inevitable: “maximize variance    $\iff$  maximize a Rayleigh quotient” (Module 8) and “PCA = SVD of centered data” (Module 10 → Module 12).

* * *

1) Random vectors without mystical fog
======================================

1.1 Random variable (what it _is_)
----------------------------------

A real random variable  $Z$  is a function

$$
Z:\Omega\to\mathbb R
$$

from a probability space  $(\Omega,\mathcal F,\mathbb P)$  such that  $Z$  is measurable (so probabilities like  $\mathbb P(Z\le t)$  make sense).

Operationally: an “outcome”  $\omega\in\Omega$  happens; you observe  $Z(\omega)$ .

1.2 Random vector (what it _is_)
--------------------------------

A random vector  $X\in\mathbb R^n$  is just  $n$  random variables stacked:

$$
X(\omega)= \begin{bmatrix} X_1(\omega)\\ \vdots\\ X_n(\omega) \end{bmatrix}.
$$

A single draw is an ordinary vector in  $\mathbb R^n$ . Many draws form a point cloud.

* * *

2) Expectation: scalar, vector, matrix
======================================

2.1 Scalar expectation and two properties we’ll actually use
------------------------------------------------------------

We’ll assume expectations exist whenever we write them. (Domain honesty: heavy tails can make  $\mathbb E[Z]$  or  $\mathbb E[Z^2]$  diverge.)

Two facts:

**(E1) Linearity.** For integrable  $Z,W$  and scalars  $a,b$ ,

$$
\mathbb E[aZ+bW]=a\mathbb E[Z]+b\mathbb E[W].
$$

**(E2) Nonnegativity.** If  $Z\ge 0$  almost surely (a.s.), then

$$
\mathbb E[Z]\ge 0.
$$

_(“Almost surely” means “except on an event of probability 0.”)_

2.2 Vector expectation
----------------------

For  $X\in\mathbb R^n$  with integrable components,

 $$
\boxed{\ \mu:=\mathbb E[X]\in\mathbb R^n,\qquad \mu_i=\mathbb E[X_i].\ }
$$

**Linearity with deterministic affine maps.** If  $A\in\mathbb R^{m\times n}$ ,  $b\in\mathbb R^m$  are deterministic and expectations exist,

 $$
\boxed{\ \mathbb E[AX+b]=A\mathbb E[X]+b=A\mu+b.\ }
$$

**Why (no handwaving):** the  $i$ \-th component of  $AX+b$  is  $\sum_j A_{ij}X_j+b_i$ ; take expectation and use scalar linearity.

2.3 Matrix expectation
----------------------

For a random matrix  $M\in\mathbb R^{p\times q}$  with integrable entries,

$$
(\mathbb E[M])_{ij}:=\mathbb E[M_{ij}].
$$

Linearity holds entrywise.

* * *

3) Variance: the scalar warm-up you must be fluent with
=======================================================

For a scalar random variable  $Z$  with  $\mathbb E[Z^2]<\infty$ ,

 $$
\boxed{\ \mathrm{Var}(Z):=\mathbb E[(Z-\mathbb E[Z])^2].\ }
$$

A very useful algebraic identity:

 $$
\boxed{\ \mathrm{Var}(Z)=\mathbb E[Z^2]-(\mathbb E[Z])^2.\ }
$$

**Proof (expand carefully):**

$$
(Z-\mathbb E[Z])^2 = Z^2 -2Z\mathbb E[Z]+(\mathbb E[Z])^2.
$$

Take expectation:

$$
\mathbb E[(Z-\mathbb E[Z])^2]=\mathbb E[Z^2]-2\mathbb E[Z]\mathbb E[Z]+(\mathbb E[Z])^2 =\mathbb E[Z^2]-(\mathbb E[Z])^2.
$$

∎

Keep this identity in your pocket: we’ll mirror it in matrix form.

* * *

4) Covariance: definition, entrywise meaning, symmetry
======================================================

Assume  $X\in\mathbb R^n$  has finite second moment:

$$
\mathbb E[\|X\|_2^2]<\infty.
$$

(This guarantees the covariance entries are finite because each entry is an expectation of a product of square-integrable variables.)

4.1 Definition
--------------

Let  $\mu=\mathbb E[X]$ . Define the centered vector

$$
\tilde X:=X-\mu.
$$

Then the covariance matrix is

 $$
\boxed{\ \Sigma:=\mathrm{Cov}(X):=\mathbb E\big[\tilde X\tilde X^\top\big] =\mathbb E\big[(X-\mu)(X-\mu)^\top\big].\ }
$$

**Why this definition is natural:**

*    $\tilde X\tilde X^\top$  is an **outer product**, a rank-1 matrix encoding direction + magnitude of deviation.
*   Covariance is the **average** (expectation) of these deviation outer-products.

4.2 Entrywise interpretation
----------------------------

For  $i,j\in\{1,\dots,n\}$ ,

$$
\Sigma_{ij} = \mathbb E\big[(X_i-\mu_i)(X_j-\mu_j)\big].
$$

So:

*    $\Sigma_{ii}=\mathbb E[(X_i-\mu_i)^2]=\mathrm{Var}(X_i)$ .
*    $\Sigma_{ij}$  for  $i\neq j$  measures co-movement (“covariance” in the usual scalar sense).

4.3 Symmetry
------------

$$
\Sigma^\top =\Big(\mathbb E[\tilde X\tilde X^\top]\Big)^\top =\mathbb E[(\tilde X\tilde X^\top)^\top] =\mathbb E[\tilde X\tilde X^\top] =\Sigma,
$$

because  $(\tilde X\tilde X^\top)^\top=\tilde X\tilde X^\top$ . Hence

 $$
\boxed{\ \Sigma\in\mathbf S^n\ \text{(symmetric)}. }
$$

* * *

5) Core theorem 1: covariance is PSD
====================================

Theorem
-------

 $$
\boxed{\ \Sigma=\mathrm{Cov}(X)\succeq 0. }
$$

### Proof (the PSD test is a quadratic form)

To prove PSD, we must show:

$$
u^\top \Sigma u \ge 0 \quad \forall u\in\mathbb R^n.
$$

Start from the definition:

$$
u^\top\Sigma u = u^\top\,\mathbb E[\tilde X\tilde X^\top]\,u.
$$

Because expectation is entrywise linear and  $u$  is deterministic, we can pull the quadratic form inside:

$$
u^\top\Sigma u =\mathbb E\big[u^\top(\tilde X\tilde X^\top)u\big].
$$

Now simplify the scalar inside. Use associativity (and the fact scalars commute):

$$
u^\top(\tilde X\tilde X^\top)u =(u^\top\tilde X)(\tilde X^\top u) =(u^\top\tilde X)^2.
$$

So we get the key identity:

$$
u^\top\Sigma u =\mathbb E\big[(u^\top\tilde X)^2\big].
$$

But  $(u^\top\tilde X)^2\ge 0$  almost surely, so by nonnegativity of expectation,

$$
\mathbb E\big[(u^\top\tilde X)^2\big]\ge 0.
$$

Thus  $u^\top\Sigma u\ge 0$  for all  $u$ , hence  $\Sigma\succeq 0$ . ∎

### What’s really happening (important mental model)

Every outer product  $yy^\top$  is PSD because

$$
u^\top(yy^\top)u=(u^\top y)^2\ge 0.
$$

Covariance is an **average of PSD matrices**, and “PSD” is preserved under averaging because it’s defined by inequalities that are linear in the matrix:

$$
u^\top(\mathbb E[M])u=\mathbb E[u^\top M u].
$$

* * *

6) Core theorem 2: variance in direction  $u$  is  $u^\top\Sigma u$ 
====================================================================

Theorem
-------

For any deterministic  $u\in\mathbb R^n$ ,

 $$
\boxed{\ \mathrm{Var}(u^\top X)=u^\top \Sigma u. }
$$

### Proof (expand the definition, no shortcuts)

Let  $Z:=u^\top X$  (a scalar random variable).

First compute its mean:

$$
\mathbb E[Z] =\mathbb E[u^\top X] =u^\top\mathbb E[X] =u^\top\mu.
$$

So the centered version is

$$
Z-\mathbb E[Z] = u^\top X - u^\top\mu = u^\top(X-\mu)=u^\top\tilde X.
$$

Now variance:

$$
\mathrm{Var}(u^\top X) =\mathbb E[(Z-\mathbb E[Z])^2] =\mathbb E[(u^\top\tilde X)^2].
$$

But from the PSD proof we already showed

$$
\mathbb E[(u^\top\tilde X)^2]=u^\top\Sigma u.
$$

So  $\mathrm{Var}(u^\top X)=u^\top\Sigma u$ . ∎

### Interpretation (this is the PCA seed)

The function

$$
u\mapsto \mathrm{Var}(u^\top X)
$$

is exactly the quadratic form

$$
u\mapsto u^\top\Sigma u.
$$

So “find direction of maximum variance” becomes

$$
\max_{\|u\|_2=1} u^\top\Sigma u,
$$

which is **Rayleigh quotient maximization** (Module 8), whose maximizer is the top eigenvector of  $\Sigma$ .

* * *

7) Algebraic identities you will use constantly (proved)
========================================================

7.1 Expansion identity:  $\Sigma=\mathbb E[XX^\top]-\mu\mu^\top$ 
-----------------------------------------------------------------

### Proposition

 $$
\boxed{\ \mathrm{Cov}(X)=\mathbb E[XX^\top]-\mu\mu^\top. }
$$

### Proof

Start from definition:

$$
\Sigma=\mathbb E[(X-\mu)(X-\mu)^\top].
$$

Expand:

$$
(X-\mu)(X-\mu)^\top =XX^\top -X\mu^\top-\mu X^\top+\mu\mu^\top.
$$

Take expectation termwise:

$$
\Sigma=\mathbb E[XX^\top]-\mathbb E[X]\mu^\top-\mu\mathbb E[X]^\top+\mu\mu^\top.
$$

Since  $\mathbb E[X]=\mu$ ,

$$
\Sigma=\mathbb E[XX^\top]-\mu\mu^\top-\mu\mu^\top+\mu\mu^\top =\mathbb E[XX^\top]-\mu\mu^\top.
$$

∎

This is the matrix analogue of  $\mathrm{Var}(Z)=\mathbb E[Z^2]-(\mathbb E[Z])^2$ .

* * *

7.2 Affine transform rule:  $\mathrm{Cov}(AX+b)=A\Sigma A^\top$ 
----------------------------------------------------------------

### Proposition

If  $Y=AX+b$  with deterministic  $A\in\mathbb R^{m\times n}$ ,  $b\in\mathbb R^m$ , then

 $$
\boxed{\ \mathrm{Cov}(Y)=A\,\mathrm{Cov}(X)\,A^\top = A\Sigma A^\top. }
$$

### Proof

Mean:

$$
\mathbb E[Y]=\mathbb E[AX+b]=A\mu+b.
$$

Center:

$$
Y-\mathbb E[Y]=AX+b-(A\mu+b)=A(X-\mu)=A\tilde X.
$$

Covariance:

$$
\mathrm{Cov}(Y)=\mathbb E[(A\tilde X)(A\tilde X)^\top] =\mathbb E[A\tilde X\tilde X^\top A^\top] =A\,\mathbb E[\tilde X\tilde X^\top]\,A^\top =A\Sigma A^\top.
$$

∎

* * *

8) When is covariance positive definite? (kernel = zero-variance directions)
============================================================================

We already know  $\Sigma\succeq 0$ . Sometimes  $\Sigma\succ 0$  (strictly PD), sometimes not.

Key characterization
--------------------

 $$
\boxed{\ u^\top\Sigma u=0 \iff \mathrm{Var}(u^\top X)=0 \iff u^\top X \text{ is a.s. constant}. }
$$

So:

*    $\Sigma\succ 0$  iff _no nonzero direction has zero variance_.
*    $\Sigma$  singular iff the distribution lies in some lower-dimensional affine subspace (there is a nontrivial linear constraint holding a.s.).

In linear algebra terms:

 $$
\boxed{\ \ker(\Sigma)=\{u:\mathrm{Var}(u^\top X)=0\}. }
$$

This is the “support on a subspace” phenomenon that shows up in degenerate Gaussians, perfectly collinear data, etc.

* * *

9) Sample covariance (the computational object) and PSD as a Gram matrix
========================================================================

Suppose you have data points  $x^{(1)},\dots,x^{(N)}\in\mathbb R^n$ .

9.1 Sample mean
---------------

$$
\bar x := \frac{1}{N}\sum_{k=1}^N x^{(k)}.
$$

9.2 Centered data matrix and the Gram form (connect to Modules 5–6)
-------------------------------------------------------------------

Build the centered data matrix  $X_c\in\mathbb R^{n\times N}$  whose columns are centered samples:

$$
X_c := \begin{bmatrix}x^{(1)}-\bar x & \cdots & x^{(N)}-\bar x\end{bmatrix}.
$$

Then the “biased” sample covariance is

 $$
\boxed{\ S:=\frac{1}{N}X_c X_c^\top. }
$$

and the “unbiased” version is

 $$
\boxed{\ \hat S:=\frac{1}{N-1}X_c X_c^\top. }
$$

### PSD proof (one line now that you see the structure)

For any  $u$ ,

$$
u^\top S u=\frac{1}{N}u^\top X_c X_c^\top u=\frac{1}{N}\|X_c^\top u\|_2^2\ge 0.
$$

So  $S\succeq 0$  (and same for  $\hat S$ ).  
This is exactly the “ $X^\top X$  is PSD” Gram-matrix fact (Module 5), appearing in stats clothing.

* * *

10) Geometry: covariance ellipsoids (why PSD isn’t a technicality)
==================================================================

If  $\Sigma\succ 0$ , consider the set

$$
E:=\{x\in\mathbb R^n : (x-\mu)^\top \Sigma^{-1}(x-\mu)\le 1\}.
$$

That’s an ellipsoid centered at  $\mu$ .

Diagonalize  $\Sigma=Q\Lambda Q^\top$  (Module 8). In coordinates  $z=Q^\top(x-\mu)$ ,

$$
(x-\mu)^\top\Sigma^{-1}(x-\mu)=z^\top\Lambda^{-1}z=\sum_{i=1}^n \frac{z_i^2}{\lambda_i}.
$$

So principal axes are eigenvectors of  $\Sigma$ , and axis lengths scale like  $\sqrt{\lambda_i}$ .

If  $\Sigma$  is singular, the “ellipsoid” is flat in some directions (infinite  $\Sigma^{-1}$  not defined; geometrically: distribution has zero spread in those directions).

* * *

11) End-of-Module 11 checklist (no mercy)
=========================================

You’re ready for PCA only if you can do these instantly and cleanly:

1.  State the definition  $\Sigma=\mathbb E[(X-\mu)(X-\mu)^\top]$  with correct moment assumptions.
2.  Prove  $\Sigma\succeq 0$  via  $u^\top\Sigma u=\mathbb E[(u^\top(X-\mu))^2]\ge 0$ .
3.  Prove  $\mathrm{Var}(u^\top X)=u^\top\Sigma u$ .
4.  Derive  $\Sigma=\mathbb E[XX^\top]-\mu\mu^\top$ .
5.  Prove  $\mathrm{Cov}(AX+b)=A\Sigma A^\top$ .
6.  Show sample covariance is PSD by writing it as  $(1/N)X_cX_c^\top$ .
7.  Explain  $\ker(\Sigma)$  as “zero-variance directions.”

* * *

Next module
-----------

**Module 12 — PCA from three angles (max variance / min reconstruction / SVD equivalence).**  
We’ll show the top principal component is the top eigenvector of  $\Sigma$  (Rayleigh quotient), and that computing PCA from data is exactly “take the SVD of centered data and read off the right singular vectors.”

## Prompt:
Now this:

# Module 13 — Multivariable calculus objects (optimization-ready)

*(gradient, directional derivative, Hessian, Taylor, and “convex ⇔ Hessian PSD” done properly)*

## 0) What this module is secretly doing

Optimization theory is basically:

* turn a function into **local linear predictions** (gradients),
* quantify **curvature** (Hessians),
* then use those two objects to certify **global shape** (convexity), rates, and stability.

If you truly own this module, later statements like “(\nabla f) is (L)-Lipschitz” or “(f) is convex because (\nabla^2 f\succeq 0)” stop being magic incantations and become inevitable.

Throughout, we are brutally honest about **domains**: derivatives live where the function is defined on a neighborhood (or at least on lines through the point).

---

## 1) Warm-up: the scalar derivative as a limit (because everything generalizes from here)

For (g:\mathbb R\to\mathbb R), the derivative at (t_0) is
[
g'(t_0)=\lim_{h\to 0}\frac{g(t_0+h)-g(t_0)}{h},
]
if the limit exists.

**Interpretation:** the best linear approximation near (t_0) is
[
g(t_0+h)\approx g(t_0)+g'(t_0)h.
]

Multivariable derivatives are the same idea, but the “(h)” becomes a **vector direction**, and the “slope” becomes a **linear functional** (which we represent by a gradient vector).

---

## 2) The correct multivariable derivative: Fréchet differentiability

Let (f:\mathrm{dom}(f)\subseteq\mathbb R^n\to\mathbb R).
Pick (x\in\mathrm{dom}(f)).

### Definition (Fréchet derivative)

We say (f) is **(Fréchet) differentiable** at (x) if there exists a linear map (L:\mathbb R^n\to\mathbb R) such that
[
\boxed{\ f(x+h)=f(x)+L(h)+o(|h|_2)\quad\text{as }h\to 0,\ }
]
where
[
\frac{o(|h|_2)}{|h|_2}\to 0.
]

**Domain honesty:** This implicitly requires that for small enough (h), (x+h\in\mathrm{dom}(f)). So this is naturally a definition on the **interior** of the domain (or relative interior if you work on affine sets).

### Why this definition is the right one

* It says: “there exists a linear function of (h) that predicts (f(x+h)-f(x)) up to a smaller-than-linear error.”
* That “linear predictor” is exactly what optimization methods use.

---

## 3) Directional derivative: derivative along a line

Even when full differentiability fails, you can often talk about change along a direction.

### Definition (directional derivative)

For a direction (d\in\mathbb R^n), define
[
\boxed{\ Df(x;d)=\lim_{t\downarrow 0}\frac{f(x+td)-f(x)}{t},\ }
]
if the limit exists. (This is the **one-sided** directional derivative, standard in convex analysis.)

If you take (t\to 0) from both sides, that’s a two-sided version.

**Domain honesty:** you need (x+td\in\mathrm{dom}(f)) for small (t>0). This works even on boundaries if you stay feasible.

---

## 4) Gradient: why a linear functional becomes a vector

Assume (f) is differentiable at (x). Then the derivative (L(h)) is a linear functional. In Euclidean space with dot product, every linear functional can be written uniquely as a dot product with some vector.

### Proposition (Riesz representation in (\mathbb R^n))

There exists a unique vector (g\in\mathbb R^n) such that
[
L(h)=g^\top h\quad\forall h.
]
We call (g) the **gradient** and write (g=\nabla f(x)).

So differentiability means:
[
\boxed{\ f(x+h)=f(x)+\nabla f(x)^\top h+o(|h|). }
]

### Proof (constructive and explicit)

Let (e_i) be the standard basis vectors. Define (g_i:=L(e_i)). For any (h=\sum_i h_i e_i),
[
L(h)=L\Big(\sum_i h_i e_i\Big)=\sum_i h_i L(e_i)=\sum_i h_i g_i = g^\top h.
]
Uniqueness: if (g^\top h=\tilde g^\top h) for all (h), then ((g-\tilde g)^\top h=0) for all (h), so (g-\tilde g=0). ∎

### Crucial link: gradient gives directional derivatives

If (f) is differentiable at (x), then for every direction (d),
[
\boxed{\ Df(x;d)=\nabla f(x)^\top d. }
]
**Proof:** set (h=td). Then
[
f(x+td)=f(x)+\nabla f(x)^\top (td)+o(|t||d|)
]
Divide by (t>0) and let (t\downarrow 0). The (o(\cdot)) term vanishes. ∎

**Interpretation:** (\nabla f(x)) is the object that turns “direction” into “instantaneous slope.”

---

## 5) Jacobian: derivatives of vector-valued maps (for constraints)

For (F:\mathbb R^n\to\mathbb R^m), write (F=(F_1,\dots,F_m)).

### Definition (Jacobian)

If each component (F_i) is differentiable, the **Jacobian** is
[
\boxed{\ J_F(x)\in\mathbb R^{m\times n},\quad (J_F(x))_{ij}=\frac{\partial F_i}{\partial x_j}(x). }
]
Then the first-order approximation is
[
\boxed{\ F(x+h)\approx F(x)+J_F(x),h. }
]

**Optimization relevance:** constraints (g(x)\le 0), (h(x)=0) use gradients/Jacobians in KKT stationarity and constraint qualifications.

---

## 6) Hessian: second derivatives and curvature as a quadratic form

Assume (f) is differentiable in a neighborhood and (\nabla f) is differentiable at (x). Then the derivative of (\nabla f) is a linear map (\mathbb R^n\to\mathbb R^n), hence representable by a matrix.

### Definition (Hessian)

[
\boxed{\ \nabla^2 f(x)\in\mathbb R^{n\times n},\quad (\nabla^2 f(x))_{ij}=\frac{\partial^2 f}{\partial x_i\partial x_j}(x). }
]

Then the second-order Taylor form will involve
[
h^\top \nabla^2 f(x) h.
]

### Second directional derivative (the curvature in direction (d))

Define (\varphi(t)=f(x+td)). If (f) is (C^2) (twice continuously differentiable), then
[
\varphi'(t)=\nabla f(x+td)^\top d,
]
and differentiating again:
[
\boxed{\ \varphi''(t)=d^\top \nabla^2 f(x+td),d. }
]
In particular at (t=0):
[
\boxed{\ \text{curvature along }d\text{ at }x;=;d^\top \nabla^2 f(x)d. }
]

### Symmetry of the Hessian (when smooth)

If (f\in C^2), then (\nabla^2 f(x)) is symmetric (Clairaut/Schwarz theorem: mixed partials commute). This matters because “PSD” is a symmetric-matrix notion.

---

## 7) Taylor’s theorem (first and second order) with domain clarity

Assume (f\in C^2) on an open set containing the segment ({x+th: t\in[0,1]}).

### First-order expansion

[
f(x+h)=f(x)+\nabla f(x)^\top h + o(|h|).
]

### Second-order expansion (standard remainder form)

There exists (\theta\in(0,1)) such that
[
\boxed{\ f(x+h)=f(x)+\nabla f(x)^\top h+\tfrac12, h^\top \nabla^2 f(x+\theta h),h. }
]
This is the multivariable version of the mean-value form of the remainder (proved by applying 1D Taylor to (\varphi(t)=f(x+th))).

**Interpretation:** near (x), (f) looks like a quadratic whose “curvature matrix” is the Hessian.

---

# 8) Convexity tests for smooth functions (the key theorems, fully proved)

Assume (\mathrm{dom}(f)) is **convex**. This is not optional: convexity is a statement about line segments staying inside the domain.

---

## 8.1 First-order characterization: supporting hyperplane inequality

### Theorem (convex + differentiable ⇔ first-order inequality)

Let (f) be differentiable on a convex domain. Then the following are equivalent:

1. (f) is convex on its domain.
2. For all (x,y) in the domain,
   [
   \boxed{\ f(y)\ge f(x)+\nabla f(x)^\top (y-x). }
   ]
   This says: the tangent plane at (x) lies **below** the graph everywhere.

#### Proof: (1 ⇒ 2)

Fix (x,y). Consider the 1D function along the segment:
[
\phi(t)=f(x+t(y-x)),\quad t\in[0,1].
]
Convexity of (f) implies (\phi) is convex as a scalar function: for (\theta\in[0,1]),
[
\phi(\theta)\le (1-\theta)\phi(0)+\theta \phi(1).
]
A standard property of convex differentiable 1D functions is: they lie above their tangents. We’ll derive it directly here.

For (t\in(0,1]), convexity gives:
[
\phi(t)\le (1-t)\phi(0)+t\phi(1)
\quad\Rightarrow\quad
\phi(1)\ge \phi(0)+\frac{\phi(t)-\phi(0)}{t}.
]
Now let (t\downarrow 0). Because (f) is differentiable, (\phi) is differentiable and
[
\lim_{t\downarrow 0}\frac{\phi(t)-\phi(0)}{t}=\phi'(0)=\nabla f(x)^\top (y-x).
]
So:
[
\phi(1)\ge \phi(0)+\phi'(0)
]
which is
[
f(y)\ge f(x)+\nabla f(x)^\top (y-x).
]
∎

#### Proof: (2 ⇒ 1)

Assume the inequality holds for all (x,y). Take any (x,y) and (\theta\in[0,1]). Let
[
z=(1-\theta)x+\theta y.
]
Apply (2) twice:

* With ((x,z)):
  [
  f(z)\ge f(x)+\nabla f(x)^\top(z-x).
  ]
* With ((y,z)):
  [
  f(z)\ge f(y)+\nabla f(y)^\top(z-y).
  ]

Now we need a clean convexity conclusion. A standard route is to show that (2) implies monotonicity of the gradient:
[
(\nabla f(x)-\nabla f(y))^\top (x-y)\ge 0,
]
and from that convexity follows; but that’s extra machinery.

Instead, use the classic “supporting hyperplane implies convex epigraph” argument, but in inequality form:

Define the affine function
[
\ell_x(w)=f(x)+\nabla f(x)^\top(w-x).
]
Condition (2) says (f(w)\ge \ell_x(w)) for every (w), i.e. (f) is the pointwise supremum of its affine supports:
[
f(w)\ge \sup_{x}\ell_x(w).
]
But actually for each (w), taking (x=w) gives equality (\ell_w(w)=f(w)), so
[
f(w)=\sup_x \ell_x(w).
]
A supremum of affine functions is convex (because each affine function is convex and supremum preserves convexity). Therefore (f) is convex. ∎

**Commentary:** This is the “geometry engine”: convex functions are exactly those that have global supporting hyperplanes everywhere.

---

## 8.2 Second-order characterization: (C^2) convex ⇔ Hessian PSD

Now the famous one.

### Theorem (Hessian test)

Let (f\in C^2) on a **convex open** set (D\subseteq\mathbb R^n). Then:
[
\boxed{\ f\ \text{is convex on }D\quad\Longleftrightarrow\quad \nabla^2 f(x)\succeq 0\ \forall x\in D. }
]

#### Proof: (⇒) convex ⇒ Hessian PSD

Assume (f) convex. Fix any (x\in D) and any direction (d\in\mathbb R^n). Because (D) is open, for small (t) the points (x+td) remain in (D).

Define (\phi(t)=f(x+td)). Since (f) is convex on (D), (\phi) is convex on an interval around 0. For a twice differentiable scalar convex function, (\phi''(t)\ge 0) everywhere.

Compute (\phi''(0)) using the chain rule result:
[
\phi''(0)=d^\top \nabla^2 f(x)d.
]
Since (\phi''(0)\ge 0) for all (d), we have
[
d^\top \nabla^2 f(x)d\ge 0\quad\forall d,
]
which is exactly (\nabla^2 f(x)\succeq 0). ∎

#### Proof: (⇐) Hessian PSD ⇒ convex

Assume (\nabla^2 f(x)\succeq 0) for all (x\in D). Take any (x,y\in D) and define the line function
[
\phi(t)=f(x+t(y-x)),\quad t\in[0,1].
]
Because (D) is convex, the whole segment lies in (D), so (\phi) is well-defined. Because (f\in C^2), (\phi\in C^2). Its second derivative is
[
\phi''(t)=(y-x)^\top \nabla^2 f(x+t(y-x))(y-x)\ge 0
]
since the Hessian is PSD and quadratic forms of PSD matrices are nonnegative.

So (\phi) is a convex scalar function on ([0,1]). Convexity of (\phi) means:
[
\phi(\theta)\le (1-\theta)\phi(0)+\theta\phi(1)\quad\forall\theta\in[0,1].
]
Translating back:
[
f((1-\theta)x+\theta y)\le (1-\theta)f(x)+\theta f(y).
]
That is exactly convexity of (f) on (D). ∎

**Commentary (why this is so powerful):**
Convexity is a global property (“below chords everywhere”). The Hessian test reduces it to a local condition (“curvature nonnegative in every direction”), because along every line, the second derivative controls whether the function bends upward.

---

# 9) Compute gradients and Hessians for core functions (with domain + edge cases)

I’ll do these in a way you can reuse as templates.

---

## 9.1 Quadratic: (f(x)=\tfrac12 x^\top P x + q^\top x + r)

Assume (P\in\mathbb R^{n\times n}) symmetric (if not, replace by (\tfrac12(P+P^\top)) since (x^\top P x = x^\top \tfrac12(P+P^\top)x)).

### Gradient

Use directional derivative: for (h),
[
f(x+h)-f(x)=\tfrac12[(x+h)^\top P(x+h)-x^\top Px]+q^\top h.
]
Expand:
[
(x+h)^\top P(x+h)=x^\top Px + 2h^\top Px + h^\top P h
]
(using symmetry to combine (x^\top Ph) and (h^\top Px)). Therefore
[
f(x+h)-f(x)=h^\top Px + \tfrac12 h^\top P h + q^\top h.
]
The linear-in-(h) part is ((Px+q)^\top h). Hence
[
\boxed{\ \nabla f(x)=Px+q. }
]

### Hessian

Differentiate (\nabla f(x)=Px+q):
[
\boxed{\ \nabla^2 f(x)=P. }
]

### Convexity

By Hessian test:
[
f\ \text{convex} \iff P\succeq 0,\qquad
f\ \text{strictly convex} \iff P\succ 0.
]

---

## 9.2 Exponential: (f(x)=\exp(a^\top x))

Domain: all (\mathbb R^n).

Let (g(x)=a^\top x). Then (f(x)=e^{g(x)}).

Gradient:
[
\nabla f(x)=e^{a^\top x},a.
]
Hessian:
[
\nabla^2 f(x)=e^{a^\top x},aa^\top.
]
Since (aa^\top\succeq 0) and scalar factor (e^{a^\top x}>0), we have (\nabla^2 f(x)\succeq 0): exponential-of-linear is convex.

---

## 9.3 Log: (f(x)=\log(a^\top x))

Domain: (a^\top x>0) (a half-space). Convex domain.

Gradient:
[
\nabla f(x)=\frac{1}{a^\top x}a.
]
Hessian:
[
\nabla^2 f(x)= -\frac{1}{(a^\top x)^2}aa^\top \preceq 0.
]
So (\log) of an affine positive argument is **concave** (negative semidefinite Hessian), not convex.

---

## 9.4 Euclidean norm: (f(x)=|x|_2)

Domain: all (\mathbb R^n). Differentiable for (x\neq 0), not differentiable at (0).

For (x\neq 0):
[
\boxed{\ \nabla |x|_2 = \frac{x}{|x|_2}. }
]
Hessian for (x\neq 0):
[
\boxed{\ \nabla^2 |x|_2 = \frac{1}{|x|_2}\left(I-\frac{xx^\top}{|x|_2^2}\right). }
]
This matrix is PSD (it’s a scaled projection onto the orthogonal complement of (x)). So (|x|_2) is convex; nonsmoothness at 0 is handled later via subgradients.

---

## 9.5 Squared norm: (f(x)=\tfrac12|x|_2^2=\tfrac12 x^\top x)

Everywhere smooth:
[
\nabla f(x)=x,\qquad \nabla^2 f(x)=I.
]
This is the canonical “strongly convex” quadratic.

---

# 10) Smoothness constants (bridge to Module 9 and algorithms)

If (\nabla^2 f(x)\preceq L I) for all (x) in a region, then (\nabla f) is (L)-Lipschitz there, meaning
[
|\nabla f(x)-\nabla f(y)|_2\le L|x-y|_2.
]
This is where operator norms re-enter optimization: (L) is a bound on the Hessian’s spectral norm.

(We’ll use this heavily when we talk about convergence rates.)

---

# 11) End-of-Module 13 checklist (don’t move on if any of these feel shaky)

You can:

1. State Fréchet differentiability and explain why it’s stronger than “all partial derivatives exist.”
2. Prove (Df(x;d)=\nabla f(x)^\top d) from the differentiability definition.
3. Define Jacobian and Hessian and interpret them as “best linear map” and “curvature matrix.”
4. Derive (\varphi''(t)=d^\top\nabla^2 f(x+td)d).
5. Prove:

   * differentiable convex ⇔ first-order supporting inequality,
   * (C^2) convex ⇔ Hessian PSD (with convex/open domain conditions stated).
6. Compute gradients/Hessians for quadratics, exp, log, norms (and know where norms fail to be differentiable).

---

## Next module

**Module 14 — Hulls and cones (affine/convex/conic) + dual cones.**
This is where “geometry of feasible sets” becomes algebra, and where duality starts showing up as “supporting hyperplanes of cones.”
# Module 12 — PCA: three equivalent lenses (max variance / min reconstruction / SVD equivalence)

*(PCA is not a ritual. It’s one theorem wearing three disguises.)*

## 0) What PCA is really trying to do

You have data in (\mathbb R^n). It’s a cloud of points. You want a **low-dimensional summary** (say (k\ll n)) that:

1. captures as much *spread/variation* as possible,
2. loses as little information as possible when you reconstruct,
3. can be computed stably and efficiently.

Those are the three “lenses.” The punchline is: **they all pick the same subspace**.

---

# 1) Setup: population version vs sample version

## 1.1 Population version (random vector)

Let (X\in\mathbb R^n) be a random vector with finite second moment: (\mathbb E|X|*2^2<\infty).
Mean:
[
\mu=\mathbb E[X].
]
Covariance:
[
\Sigma=\mathrm{Cov}(X)=\mathbb E[(X-\mu)(X-\mu)^\top]\in\mathbf S*+^n.
]
(PSD proof was Module 11.)

We will assume (\Sigma\neq 0) unless otherwise stated (if (\Sigma=0), the data has zero variance and PCA is trivial).

## 1.2 Sample version (finite dataset)

You observe (N) points (x^{(1)},\dots,x^{(N)}\in\mathbb R^n).

Stack them as rows in a data matrix:
[
X=\begin{bmatrix}
(x^{(1)})^\top\
\vdots\
(x^{(N)})^\top
\end{bmatrix}\in\mathbb R^{N\times n}.
]
Sample mean:
[
\bar x=\frac{1}{N}\sum_{i=1}^N x^{(i)}\in\mathbb R^n.
]
Centered data matrix:
[
Z := X - \mathbf 1,\bar x^\top\in\mathbb R^{N\times n},
]
where (\mathbf 1\in\mathbb R^N) is the all-ones vector (so (\mathbf 1,\bar x^\top) repeats the mean in each row).

Sample covariance (using (1/N); using (1/(N-1)) changes only scaling, not eigenvectors):
[
S:=\frac{1}{N}Z^\top Z\in\mathbf S_+^n.
]

From here on:

* “population PCA” uses (\Sigma),
* “sample PCA” uses (S).
  The geometry and proofs are identical.

---

# 2) Lens 1 — Max variance direction (the Rayleigh quotient view)

## 2.1 What is “variance along a direction”?

Pick a unit vector (u\in\mathbb R^n) with (|u|_2=1). Consider the 1D projection:
[
Y := u^\top (X-\mu).
]
This is a scalar random variable. It measures “coordinate of (X) along direction (u)” after centering.

From Module 11:
[
\mathrm{Var}(Y)=\mathrm{Var}(u^\top X)=u^\top \Sigma u.
]

So the “variance captured by direction (u)” equals the quadratic form (u^\top\Sigma u).

## 2.2 First principal component = maximize variance subject to unit length

Define the optimization problem:
[
\boxed{\ \max_{|u|_2=1}\ u^\top \Sigma u. \ }
]
This is exactly the Rayleigh quotient maximization from Module 8.

### Theorem (Rayleigh–Ritz, specialized)

Let (\Sigma\in\mathbf S^n) with eigenvalues (\lambda_1\ge\lambda_2\ge\cdots\ge\lambda_n\ge 0). Then:
[
\max_{|u|=1}u^\top\Sigma u=\lambda_1,
]
and any maximizer (u^\star) can be chosen as an eigenvector for (\lambda_1).

### Proof (completely explicit using the spectral theorem)

Diagonalize:
[
\Sigma = Q\Lambda Q^\top,\quad Q\ \text{orthogonal},\ \Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n).
]
Let (y:=Q^\top u). Since (Q) is orthogonal, (|y|*2=|u|*2=1). Then
[
u^\top\Sigma u
= u^\top Q\Lambda Q^\top u
= y^\top\Lambda y
= \sum*{i=1}^n \lambda_i y_i^2.
]
Constraint: (\sum*{i=1}^n y_i^2=1) and each (y_i^2\ge 0). So ({y_i^2}) are weights that sum to 1.

Because (\lambda_1\ge\lambda_i) for all (i),
[
\sum_{i=1}^n \lambda_i y_i^2 \le \sum_{i=1}^n \lambda_1 y_i^2 = \lambda_1\sum_{i=1}^n y_i^2=\lambda_1.
]
So the maximum is (\le\lambda_1). Achieve equality by choosing (y=e_1) (i.e. (y_1=1), others 0), which corresponds to (u=Qe_1=q_1), the top eigenvector. ∎

**Commentary (why this isn’t a trick):**
Variance in direction (u) is a weighted average of eigenvalues, with weights (y_i^2) telling you how much (u) points along eigenvector (q_i). You maximize by putting all weight on the biggest eigenvalue direction.

---

# 3) Lens 1b — Top (k) components (maximize total captured variance)

Now we want not one direction but a (k)-dimensional subspace.

Let (U\in\mathbb R^{n\times k}) have orthonormal columns:
[
U^\top U = I_k.
]
Think of columns (u_1,\dots,u_k) as (k) orthonormal directions. The projection of (X-\mu) onto this subspace is (U^\top(X-\mu)\in\mathbb R^k).

A natural “total variance captured” is the sum of variances along these orthonormal directions:
[
\sum_{j=1}^k \mathrm{Var}(u_j^\top X)
= \sum_{j=1}^k u_j^\top\Sigma u_j
= \mathrm{tr}(U^\top \Sigma U).
]
(Last equality because (\mathrm{tr}(U^\top\Sigma U)=\sum_{j=1}^k e_j^\top(U^\top\Sigma U)e_j=\sum_{j=1}^k u_j^\top\Sigma u_j).)

So the (k)-PC problem is:
[
\boxed{\ \max_{U^\top U=I_k}\ \mathrm{tr}(U^\top\Sigma U). \ }
]

### Theorem (Ky Fan variational principle, proved from scratch in eigen-coordinates)

Let (\lambda_1\ge\cdots\ge\lambda_n) be eigenvalues of (\Sigma). Then:
[
\max_{U^\top U=I_k}\mathrm{tr}(U^\top\Sigma U)=\sum_{i=1}^k \lambda_i,
]
and an optimizer is (U^\star=[q_1\ \cdots\ q_k]), the top (k) eigenvectors.

#### Proof (granular, using only linear algebra)

Diagonalize (\Sigma=Q\Lambda Q^\top). Let (W:=Q^\top U\in\mathbb R^{n\times k}). Since (Q) is orthogonal:
[
W^\top W = U^\top Q Q^\top U = U^\top U = I_k,
]
so columns of (W) are also orthonormal.

Now:
[
\mathrm{tr}(U^\top\Sigma U)
=\mathrm{tr}(U^\top Q\Lambda Q^\top U)
=\mathrm{tr}(W^\top \Lambda W).
]
Expand that trace in a way that exposes “weights”:

Let (w_1,\dots,w_k) be the columns of (W). Then
[
\mathrm{tr}(W^\top\Lambda W)=\sum_{j=1}^k w_j^\top \Lambda w_j
=\sum_{j=1}^k \sum_{i=1}^n \lambda_i (w_{ij})^2
=\sum_{i=1}^n \lambda_i\left(\sum_{j=1}^k (w_{ij})^2\right).
]
Define for each row (i):
[
\alpha_i := \sum_{j=1}^k (w_{ij})^2 = | \text{row}_i(W)|_2^2.
]
Then:

* (\alpha_i\ge 0).
* Also (\alpha_i\le 1) because (W W^\top) is a projection matrix (its diagonal entries are between 0 and 1), and ((WW^\top)_{ii}=\alpha_i).
* And crucially:
  [
  \sum_{i=1}^n \alpha_i = \sum_{i=1}^n \sum_{j=1}^k (w_{ij})^2 = \sum_{j=1}^k \sum_{i=1}^n (w_{ij})^2 = \sum_{j=1}^k |w_j|_2^2 = k,
  ]
  since each column (w_j) is unit norm.

So the objective becomes:
[
\mathrm{tr}(U^\top\Sigma U)=\sum_{i=1}^n \lambda_i \alpha_i
]
with constraints:
[
0\le \alpha_i \le 1,\qquad \sum_{i=1}^n \alpha_i = k.
]

Now comes a clean “greedy is optimal” argument: since (\lambda_1\ge\lambda_2\ge\cdots),
the maximum of (\sum \lambda_i\alpha_i) under those constraints is achieved by putting as much weight as possible ((\alpha_i=1)) on the largest eigenvalues first:
[
\alpha_1=\cdots=\alpha_k=1,\quad \alpha_{k+1}=\cdots=\alpha_n=0.
]
This yields value (\sum_{i=1}^k\lambda_i). No other feasible ({\alpha_i}) can do better, because any mass shifted from a larger (\lambda) to a smaller (\lambda) weakly decreases the sum.

Achievability: choose (W=[e_1\ \cdots\ e_k]). Then (U=QW=[q_1\ \cdots\ q_k]), and indeed (\alpha_1=\cdots=\alpha_k=1). ∎

**Non-uniqueness edge case:** If (\lambda_k=\lambda_{k+1}), the optimal subspace is not unique: any orthonormal basis inside the tied eigenspace is optimal.

---

# 4) Lens 2 — Minimum reconstruction error (projection view)

Now we phrase PCA as “best (k)-dimensional approximation.”

## 4.1 Projection onto a (k)-dimensional subspace

Let (U\in\mathbb R^{n\times k}) with (U^\top U=I). The orthogonal projector onto (\mathrm{span}(U)) is:
[
P := UU^\top.
]
Given a point (x), its projection is (Px).

For the random vector (X), the reconstruction using this subspace is:
[
\hat X := \mu + P(X-\mu) = \mu + UU^\top (X-\mu).
]
So:

* you center ((X-\mu)),
* project into the (k)-dim subspace,
* re-add the mean.

## 4.2 Define reconstruction error

The mean squared reconstruction error is:
[
\mathcal E(U) := \mathbb E\big[|X-\hat X|_2^2\big]
= \mathbb E\big[|(I-P)(X-\mu)|_2^2\big].
]

### Key identity: (\mathcal E(U)=\mathrm{tr}(\Sigma)-\mathrm{tr}(U^\top\Sigma U))

**Proof (step-by-step):**
Let (Y:=X-\mu) (centered). Then (\mathbb E[YY^\top]=\Sigma).

Compute the squared norm using trace:
[
|(I-P)Y|_2^2 = Y^\top (I-P)^\top (I-P) Y.
]
But (P) is symmetric and idempotent ((P^\top=P), (P^2=P)), so ((I-P)^\top(I-P)=(I-P)^2=I-P). Thus
[
|(I-P)Y|_2^2 = Y^\top (I-P) Y.
]
Take expectation:
[
\mathcal E(U)=\mathbb E[Y^\top(I-P)Y].
]
Use the identity (y^\top M y=\mathrm{tr}(y^\top M y)=\mathrm{tr}(M yy^\top)):
[
Y^\top(I-P)Y = \mathrm{tr}((I-P)YY^\top).
]
So
[
\mathcal E(U) = \mathbb E[\mathrm{tr}((I-P)YY^\top)]
= \mathrm{tr}\big((I-P)\mathbb E[YY^\top]\big)
= \mathrm{tr}((I-P)\Sigma).
]
Now expand trace:
[
\mathrm{tr}((I-P)\Sigma)=\mathrm{tr}(\Sigma)-\mathrm{tr}(P\Sigma).
]
And (\mathrm{tr}(P\Sigma)=\mathrm{tr}(UU^\top\Sigma)=\mathrm{tr}(U^\top\Sigma U)) (cyclic trace property). Hence:
[
\boxed{\ \mathcal E(U)=\mathrm{tr}(\Sigma)-\mathrm{tr}(U^\top\Sigma U). \ }
]
∎

### Conclusion: minimizing reconstruction error = maximizing captured variance

Since (\mathrm{tr}(\Sigma)) is constant in (U),
[
\min_{U^\top U=I}\mathcal E(U)
\quad\Longleftrightarrow\quad
\max_{U^\top U=I}\mathrm{tr}(U^\top\Sigma U).
]
But we already solved the max problem: the optimizer is top (k) eigenvectors.

So PCA’s “best reconstruction subspace” is exactly the same as PCA’s “max variance subspace.”

**Interpretation:**
Total variance (\mathrm{tr}(\Sigma)) splits into:

* explained variance (inside subspace),
* leftover variance (orthogonal complement).
  PCA chooses the subspace that makes leftover variance as small as possible.

---

# 5) Lens 3 — SVD of centered data (computational/algorithmic view)

Now do the sample version. Let centered data matrix be (Z\in\mathbb R^{N\times n}), and sample covariance (S=\frac1N Z^\top Z).

Compute the SVD:
[
\boxed{\ Z = \tilde U,\Sigma_z,V^\top, }
]
where:

* (\tilde U\in\mathbb R^{N\times N}) orthogonal,
* (V\in\mathbb R^{n\times n}) orthogonal,
* (\Sigma_z\in\mathbb R^{N\times n}) has singular values (\sigma_1\ge\cdots\ge\sigma_r>0).

## 5.1 Covariance eigenvectors = right singular vectors

Compute:
[
Z^\top Z = V,\Sigma_z^\top \tilde U^\top \tilde U,\Sigma_z,V^\top
= V(\Sigma_z^\top\Sigma_z)V^\top.
]
Divide by (N):
[
S=\frac1N Z^\top Z = V\left(\frac1N\Sigma_z^\top\Sigma_z\right)V^\top.
]
So (V) diagonalizes (S). Therefore:
[
\boxed{\ \text{Eigenvectors of }S\text{ are columns of }V. }
]
And eigenvalues are:
[
\boxed{\ \lambda_i(S)=\frac{\sigma_i^2}{N}\quad(\text{or } \frac{\sigma_i^2}{N-1}\text{ if you use }1/(N-1)). }
]

## 5.2 PC scores = projected coordinates = (ZV)

The (i)-th principal direction (loading vector) is (v_i). The corresponding **scores** (coordinates of each sample along that PC) are:
[
t_i := Z v_i \in \mathbb R^N.
]
But using SVD:
[
Zv_i = \tilde U,\Sigma_z,V^\top v_i
= \tilde U,\Sigma_z e_i
= \sigma_i \tilde u_i,
]
where (\tilde u_i) is the (i)-th left singular vector. So:
[
\boxed{\ Z v_i = \sigma_i \tilde u_i. }
]
That’s a very clean computational identity.

## 5.3 Reconstruction and truncated SVD

The best rank-(k) approximation of (Z) in Frobenius norm is the truncated SVD:
[
Z_k=\tilde U_k \Sigma_{z,k} V_k^\top,
]
and (from Eckart–Young–Mirsky, Module 10):
[
|Z-Z_k|*F^2=\sum*{i=k+1}^r \sigma_i^2.
]
But (\frac1N|Z-Z_k|_F^2) is exactly the average squared reconstruction error of data points using the top (k) PCs. So the SVD lens is literally “PCA = best low-rank approximation of the centered data matrix.”

---

# 6) What PCA outputs (and what is ambiguous)

Given covariance (S) (or (\Sigma)) eigen-decomposition:
[
S = V\Lambda V^\top,\quad \Lambda=\mathrm{diag}(\lambda_1\ge\cdots\ge\lambda_n\ge 0),
]
PCA gives:

* **principal directions / loadings:** (v_1,\dots,v_k),
* **explained variances:** (\lambda_1,\dots,\lambda_k),
* **scores:** (T = Z V_k\in\mathbb R^{N\times k}),
* **reconstruction:** (\hat Z = T V_k^\top = Z V_k V_k^\top), and (\hat X = \mathbf 1\bar x^\top + \hat Z).

### Two unavoidable ambiguities

1. **Sign flips:** if (v) is an eigenvector, so is (-v). Scores flip sign accordingly. Nothing changes geometrically.
2. **Eigenvalue ties:** if (\lambda_k=\lambda_{k+1}), the top-(k) subspace can be non-unique; any orthonormal basis in that eigenspace is valid.

---

# 7) Practical sanity checks (to stop dumb mistakes)

* Always center. PCA without centering is usually analyzing “direction to the mean,” not variation about the mean.
* Scaling matters: if coordinates are in wildly different units, PCA will be dominated by the largest-scale feature. Standardization (z-scoring) changes the question to PCA on correlation rather than covariance.
* Explained variance ratio:
  [
  \text{EVR}*i=\frac{\lambda_i}{\sum*{j=1}^n \lambda_j}=\frac{\lambda_i}{\mathrm{tr}(S)}.
  ]
* Total reconstruction error for top (k):
  [
  \mathrm{tr}(S)-\sum_{i=1}^k\lambda_i=\sum_{i=k+1}^n \lambda_i.
  ]

---

# 8) End-of-Module 12 checklist (no mercy)

You’re ready to move on only if you can prove, cleanly:

1. ( \max_{|u|=1} u^\top\Sigma u = \lambda_1) and optimizer is top eigenvector.
2. ( \max_{U^\top U=I_k}\mathrm{tr}(U^\top\Sigma U)=\sum_{i=1}^k\lambda_i) (Ky Fan) via the (\alpha_i) weights argument.
3. Reconstruction error identity:
   [
   \mathbb E|(I-UU^\top)(X-\mu)|^2=\mathrm{tr}(\Sigma)-\mathrm{tr}(U^\top\Sigma U).
   ]
4. SVD equivalence: if (Z=\tilde U\Sigma_z V^\top), then (S=\frac1N Z^\top Z = V(\Sigma_z^\top\Sigma_z/N)V^\top), so eigenvectors of (S) are (V).

---

## Next module

**Module 13 — Multivariable calculus and matrix calculus objects (optimization-ready):** gradients, Hessians, directional derivatives, Taylor expansion, and the theorem “(C^2) convex ⇔ Hessian PSD (on convex domains).”

## Response:
Thought for 22s

Module 13 — Multivariable calculus objects (optimization-ready)
===============================================================

_(gradient, directional derivative, Hessian, Taylor, and “convex ⇔ Hessian PSD” done properly)_

0) What this module is secretly doing
-------------------------------------

Optimization is built out of two local objects:

1.  **First-order behavior**: “what linear function best predicts  $f$  near  $x$ ?” → the **derivative / gradient**.
2.  **Second-order behavior**: “how does that linear predictor change as you move?” → the **Hessian**.

Then you use these _local_ objects to certify _global_ shape:

*   convexity,
*   strong convexity,
*   smoothness (Lipschitz gradient),
*   stability/conditioning of algorithms.

The non-negotiable meta-rule throughout:

**Domain honesty.**  
Derivatives require that the function is defined on (at least) the points you approach. Full differentiability at  $x$  implicitly needs a whole neighborhood around  $x$  inside  $\mathrm{dom}(f)$ . Directional derivatives only need feasible movement along a ray.

* * *

1) Scalar derivative as the template
====================================

For  $g:\mathbb R\to\mathbb R$ , derivative at  $t_0$ :

$$
g'(t_0)=\lim_{h\to 0}\frac{g(t_0+h)-g(t_0)}{h},
$$

if the limit exists.

This is equivalent to: there exists a number  $a$  such that

$$
g(t_0+h)=g(t_0)+a h + o(|h|)\quad (h\to 0),
$$

and that  $a=g'(t_0)$ .

That second form (“linear predictor + smaller-than-linear error”) is exactly what we generalize.

* * *

2) The correct multivariable derivative: Fréchet differentiability
==================================================================

Let  $f:\mathrm{dom}(f)\subseteq\mathbb R^n\to\mathbb R$ . Fix  $x\in\mathrm{dom}(f)$ .

2.1 Definition (Fréchet derivative)
-----------------------------------

We say  $f$  is **Fréchet differentiable** at  $x$  if there exists a linear map  $L:\mathbb R^n\to\mathbb R$  such that

 $$
\boxed{\ f(x+h)=f(x)+L(h)+o(\|h\|_2)\quad\text{as }h\to 0, \ }
$$

meaning

$$
\frac{o(\|h\|_2)}{\|h\|_2}\to 0.
$$

### Domain honesty

This definition only makes sense if  $x+h\in\mathrm{dom}(f)$  for all sufficiently small  $h$ . So it’s naturally a notion on **interior points** of  $\mathrm{dom}(f)$  (or **relative interior** if your domain lies in an affine subspace).

2.2 Why this is the “right” differentiability notion
----------------------------------------------------

It captures the strongest useful statement:

*   There is a **single linear map**  $L$  that approximates  $f(x+h)-f(x)$  uniformly across _all directions_, with an error that’s negligible compared to  $\|h\|$ .

That “one linear object works in every direction” is what gradient-based methods exploit.

* * *

3) Directional derivatives (one-sided): moving along a feasible ray
===================================================================

Even if Fréchet differentiability fails (corners, kinks, boundary points), you can still study change along a direction.

3.1 Definition (one-sided directional derivative)
-------------------------------------------------

For  $d\in\mathbb R^n$ ,

 $$
\boxed{\ Df(x;d)=\lim_{t\downarrow 0}\frac{f(x+td)-f(x)}{t},\ }
$$

if the limit exists.

### Domain honesty

You only need  $x+td\in\mathrm{dom}(f)$  for small  $t>0$ . This works on boundaries as long as  $d$  points into the domain.

3.2 Immediate properties (when the limit exists)
------------------------------------------------

*   **Positive homogeneity in  $d$ **:
    $$
    Df(x;\alpha d)=\alpha Df(x;d)\quad(\alpha\ge 0).
    $$
    (Proof: substitute  $s=\alpha t$ .)
*   **Not necessarily linear** in  $d$ . (That’s the whole point: kinks break linearity.)

For convex  $f$ , directional derivatives exist everywhere on the relative interior in every direction that stays feasible (we’ll use this later in convex analysis), but in this module we keep it calculus-first.

* * *

4) From linear functionals to vectors: gradient via finite-dimensional Riesz
============================================================================

Assume  $f$  is Fréchet differentiable at  $x$  with derivative  $L$ .

4.1 Proposition (finite-dimensional Riesz representation)
---------------------------------------------------------

There exists a **unique** vector  $g\in\mathbb R^n$  such that

$$
L(h)=g^\top h\quad\forall h\in\mathbb R^n.
$$

We define

 $$
\boxed{\ \nabla f(x):=g. \ }
$$

### Proof (constructive)

Let  $e_1,\dots,e_n$  be the standard basis. Define components:

$$
g_i := L(e_i).
$$

For any  $h=\sum_{i=1}^n h_i e_i$ , linearity gives

$$
L(h)=\sum_{i=1}^n h_i L(e_i)=\sum_{i=1}^n h_i g_i=g^\top h.
$$

Uniqueness: if  $g^\top h=\tilde g^\top h$  for all  $h$ , then  $(g-\tilde g)^\top h=0$  for all  $h$ . Taking  $h=g-\tilde g$  yields  $\|g-\tilde g\|_2^2=0$ , hence  $g=\tilde g$ . ∎

4.2 Differentiability in gradient form
--------------------------------------

Fréchet differentiability at  $x$  is equivalent to:

 $$
\boxed{\ f(x+h)=f(x)+\nabla f(x)^\top h+o(\|h\|_2). }
$$

4.3 Crucial link: gradient gives directional derivatives
--------------------------------------------------------

If  $f$  is differentiable at  $x$ , then for every direction  $d$ ,

 $$
\boxed{\ Df(x;d)=\nabla f(x)^\top d. }
$$

### Proof

Set  $h=td$  in the differentiability expansion:

$$
f(x+td)=f(x)+\nabla f(x)^\top (td)+o(\|td\|).
$$

Subtract  $f(x)$ , divide by  $t>0$ :

$$
\frac{f(x+td)-f(x)}{t}=\nabla f(x)^\top d + \frac{o(t\|d\|)}{t}.
$$

As  $t\downarrow 0$ , the remainder term  $\frac{o(t\|d\|)}{t}\to 0$ . ∎

**Meaning:** the gradient is the machine that turns a direction into the instantaneous slope.

* * *

5) Jacobian: derivatives of vector-valued maps (constraints-ready)
==================================================================

Let  $F:\mathbb R^n\to\mathbb R^m$ . Fréchet differentiability at  $x$  means:

$$
F(x+h)=F(x)+L(h)+o(\|h\|)
$$

where now  $L:\mathbb R^n\to\mathbb R^m$  is a linear map.

In finite dimensions every linear map is multiplication by a matrix, so there exists a unique  $J_F(x)\in\mathbb R^{m\times n}$  such that

$$
L(h)=J_F(x)\,h.
$$

We call it the **Jacobian**:

 $$
\boxed{\ (J_F(x))_{ij}=\frac{\partial F_i}{\partial x_j}(x). }
$$

So the first-order model is:

 $$
\boxed{\ F(x+h)=F(x)+J_F(x)h+o(\|h\|). }
$$

Optimization relevance: gradients/Jacobians appear in KKT stationarity and constraint qualifications.

* * *

6) Hessian: second derivatives as curvature (a quadratic form)
==============================================================

Assume  $f$  is differentiable in a neighborhood of  $x$ , and  $\nabla f$  is differentiable at  $x$ . Then  $\nabla f:\mathbb R^n\to\mathbb R^n$  has a Jacobian at  $x$ , which is an  $n\times n$  matrix.

6.1 Definition (Hessian)
------------------------

 $$
\boxed{\ \nabla^2 f(x):=J_{\nabla f}(x)\in\mathbb R^{n\times n}. }
$$

When second partial derivatives exist, this matches

$$
(\nabla^2 f(x))_{ij}=\frac{\partial^2 f}{\partial x_i\partial x_j}(x).
$$

6.2 Curvature along a direction is a quadratic form
---------------------------------------------------

Fix  $x$  and direction  $d$ . Define the 1D restriction along the line:

$$
\varphi(t):=f(x+td).
$$

If  $f\in C^2$ , then  $\varphi\in C^2$  and:

 $$
\boxed{\ \varphi'(t)=\nabla f(x+td)^\top d,\qquad \varphi''(t)=d^\top \nabla^2 f(x+td)\,d. }
$$

In particular at  $t=0$ :

 $$
\boxed{\ \text{curvature at }x\text{ along }d\;=\;d^\top \nabla^2 f(x)\,d. }
$$

### Proof of  $\varphi''(t)=d^\top \nabla^2 f(\cdot)d$ 

Differentiate  $\varphi'(t)=\nabla f(x+td)^\top d$  w.r.t.  $t$ . The derivative of  $\nabla f(x+td)$  is  $\nabla^2 f(x+td)\,d$  (Jacobian-times-direction). So:

$$
\varphi''(t)=\big(\nabla^2 f(x+td)\,d\big)^\top d = d^\top \nabla^2 f(x+td)\,d.
$$

∎

6.3 Symmetry of the Hessian (when smooth enough)
------------------------------------------------

If  $f\in C^2$  (mixed partials continuous), then Clairaut/Schwarz gives:

$$
\frac{\partial^2 f}{\partial x_i\partial x_j} = \frac{\partial^2 f}{\partial x_j\partial x_i},
$$

so

 $$
\boxed{\ \nabla^2 f(x)\in\mathbf S^n\ \text{(symmetric)}. }
$$

This matters because “PSD” is a symmetric-matrix concept.

* * *

7) Taylor’s theorem in multiple dimensions (via 1D reduction)
=============================================================

The cleanest, least-handwavy way: always reduce to 1D along a segment.

Assume  $f\in C^2$  on an open set containing the segment  $\{x+th:t\in[0,1]\}$ .

7.1 First-order Taylor (the differentiability statement)
--------------------------------------------------------

$$
f(x+h)=f(x)+\nabla f(x)^\top h+o(\|h\|).
$$

7.2 Second-order Taylor with remainder (mean-value form)
--------------------------------------------------------

There exists  $\theta\in(0,1)$  such that

 $$
\boxed{\ f(x+h)=f(x)+\nabla f(x)^\top h+\tfrac12\,h^\top\nabla^2 f(x+\theta h)\,h. }
$$

### Proof (apply 1D Taylor to  $\varphi(t)=f(x+th)$ )

Define  $\varphi(t)=f(x+th)$  for  $t\in[0,1]$ . Then

$$
\varphi'(t)=\nabla f(x+th)^\top h,\quad \varphi''(t)=h^\top\nabla^2 f(x+th)h.
$$

1D Taylor (mean-value remainder) says:

$$
\varphi(1)=\varphi(0)+\varphi'(0)+\tfrac12\varphi''(\theta)
$$

for some  $\theta\in(0,1)$ . Substitute back:

$$
f(x+h)=f(x)+\nabla f(x)^\top h+\tfrac12\,h^\top\nabla^2 f(x+\theta h)\,h.
$$

∎

This is the exact bridge between “Hessian PSD” and “function bends upward along every line.”

* * *

8) Convexity tests for smooth functions (proved cleanly, with domain requirements)
==================================================================================

Let  $\mathrm{dom}(f)$  be **convex** (mandatory: convexity is about line segments).

* * *

8.1 First-order characterization (supporting hyperplane inequality)
-------------------------------------------------------------------

### Theorem

Let  $f$  be differentiable on a convex set  $D$ . Then:

 $$
\boxed{\ f\ \text{convex on }D\quad\Longleftrightarrow\quad f(y)\ge f(x)+\nabla f(x)^\top (y-x)\ \ \forall x,y\in D. }
$$

### Proof: convex  $\Rightarrow$  inequality

Fix  $x,y\in D$ . Consider  $\phi(t)=f(x+t(y-x))$  on  $[0,1]$ . Convexity of  $f$  on  $D$  implies  $\phi$  is convex on  $[0,1]$ .

For any  $t\in(0,1]$ , convexity gives:

$$
\phi(t)\le (1-t)\phi(0)+t\phi(1) \ \Rightarrow\ \phi(1)\ge \phi(0)+\frac{\phi(t)-\phi(0)}{t}.
$$

Let  $t\downarrow 0$ . Differentiability gives:

$$
\lim_{t\downarrow 0}\frac{\phi(t)-\phi(0)}{t}=\phi'(0)=\nabla f(x)^\top (y-x).
$$

So:

$$
f(y)=\phi(1)\ge \phi(0)+\phi'(0)=f(x)+\nabla f(x)^\top(y-x).
$$

∎

### Proof: inequality  $\Rightarrow$  convex

Assume the inequality holds. Define for each  $x\in D$  the affine function:

$$
\ell_x(z):=f(x)+\nabla f(x)^\top(z-x).
$$

The assumption says  $f(z)\ge \ell_x(z)$  for all  $x,z\in D$ . Also  $\ell_z(z)=f(z)$ . Hence

$$
f(z)=\sup_{x\in D}\ell_x(z).
$$

A supremum of affine (hence convex) functions is convex. Therefore  $f$  is convex. ∎

**Geometric translation:** “convex + differentiable” means “every tangent hyperplane supports the graph globally.”

* * *

8.2 Second-order characterization:  $C^2$  convex  $\Longleftrightarrow$  Hessian PSD
-------------------------------------------------------------------------------------

### Theorem (Hessian test)

Let  $D\subset\mathbb R^n$  be **convex and open**, and  $f\in C^2(D)$ . Then:

 $$
\boxed{\ f\ \text{convex on }D\quad\Longleftrightarrow\quad \nabla^2 f(x)\succeq 0\ \ \forall x\in D. }
$$

### Proof: convex  $\Rightarrow$  Hessian PSD

Fix  $x\in D$  and  $d\in\mathbb R^n$ . Since  $D$  is open,  $x+td\in D$  for small  $t$ . Let  $\phi(t)=f(x+td)$ . Convexity of  $f$  implies  $\phi$  convex, hence  $\phi''(0)\ge 0$ . But

$$
\phi''(0)=d^\top\nabla^2 f(x)d.
$$

So  $d^\top\nabla^2 f(x)d\ge 0$  for all  $d$ , i.e.  $\nabla^2 f(x)\succeq 0$ . ∎

### Proof: Hessian PSD  $\Rightarrow$  convex

Take any  $x,y\in D$ . The segment  $x+t(y-x)\subset D$  because  $D$  is convex. Let  $\phi(t)=f(x+t(y-x))$ . Then

$$
\phi''(t)=(y-x)^\top\nabla^2 f(x+t(y-x))(y-x)\ge 0
$$

for all  $t$ , so  $\phi$  is convex on  $[0,1]$ . Therefore

$$
f((1-\theta)x+\theta y)=\phi(\theta)\le (1-\theta)\phi(0)+\theta\phi(1) =(1-\theta)f(x)+\theta f(y).
$$

So  $f$  is convex. ∎

**This is the core bridge:** “convex in  $\mathbb R^n$ ” is equivalent to “convex along every line,” and along a line, “convex” is “second derivative  $\ge 0$ .”

* * *

9) Two algorithm-critical refinements: strong convexity and smoothness
======================================================================

These show up everywhere in rates (GD, Newton, proximal methods).

9.1 Strong convexity (curvature bounded below)
----------------------------------------------

A  $C^2$  function is ** $m$ \-strongly convex** on  $D$  if

 $$
\boxed{\ \nabla^2 f(x)\succeq mI\quad\forall x\in D. }
$$

Equivalent “quadratic lower bound” form:

 $$
\boxed{\ f(y)\ge f(x)+\nabla f(x)^\top(y-x)+\tfrac m2\|y-x\|_2^2. }
$$

(Proof: apply second-order Taylor along the segment and lower bound the quadratic form by  $m\|y-x\|^2$ .)

9.2 Smoothness / Lipschitz gradient (curvature bounded above)
-------------------------------------------------------------

A  $C^2$  function is ** $L$ \-smooth** on  $D$  if

 $$
\boxed{\ \nabla^2 f(x)\preceq LI\quad\forall x\in D. }
$$

This implies the gradient is  $L$ \-Lipschitz:

 $$
\boxed{\ \|\nabla f(y)-\nabla f(x)\|_2\le L\|y-x\|_2. }
$$

### Proof (fundamental theorem of calculus along the segment)

Let  $\gamma(t)=x+t(y-x)$ . Consider  $g(t)=\nabla f(\gamma(t))$ . Then

$$
g'(t)=\nabla^2 f(\gamma(t))(y-x).
$$

So

$$
\nabla f(y)-\nabla f(x)=g(1)-g(0)=\int_0^1 \nabla^2 f(\gamma(t))(y-x)\,dt.
$$

Take norms and use  $\|\nabla^2 f(\gamma(t))\|_2\le L$  (operator norm bound is equivalent to  $\nabla^2 f\preceq LI$  for symmetric Hessian):

$$
\|\nabla f(y)-\nabla f(x)\| \le \int_0^1 \|\nabla^2 f(\gamma(t))\|_2\,\|y-x\|\,dt \le \int_0^1 L\|y-x\|\,dt = L\|y-x\|.
$$

∎

There’s also the standard _upper quadratic model_:

$$
f(y)\le f(x)+\nabla f(x)^\top(y-x)+\tfrac L2\|y-x\|^2,
$$

proved by applying Taylor and bounding the Hessian quadratic form above by  $L\|h\|^2$ .

* * *

10) Canonical derivatives you should be able to do cold
=======================================================

10.1 Quadratic
--------------

$$
f(x)=\tfrac12 x^\top Px + q^\top x + r,\quad P=P^\top.
$$
 
$$
\nabla f(x)=Px+q,\qquad \nabla^2 f(x)=P.
$$

Convex iff  $P\succeq 0$ ; strongly convex iff  $P\succ 0$ .

10.2 Least squares
------------------

$$
f(x)=\tfrac12\|Ax-b\|_2^2=\tfrac12(Ax-b)^\top(Ax-b).
$$
 
$$
\nabla f(x)=A^\top(Ax-b),\qquad \nabla^2 f(x)=A^\top A\succeq 0.
$$

So it’s convex; strongly convex iff  $A$  has full column rank.

10.3 Exponential of linear
--------------------------

$$
f(x)=e^{a^\top x}.
$$
 
$$
\nabla f(x)=e^{a^\top x}a,\qquad \nabla^2 f(x)=e^{a^\top x}aa^\top\succeq 0.
$$

10.4 Log of linear (domain!)
----------------------------

$$
f(x)=\log(a^\top x),\quad \text{domain } \{x:a^\top x>0\}.
$$
 
$$
\nabla f(x)=\frac{1}{a^\top x}a,\qquad \nabla^2 f(x)=-\frac{1}{(a^\top x)^2}aa^\top\preceq 0,
$$

so it’s concave on its domain.

10.5 Norms (where differentiability fails)
------------------------------------------

$$
f(x)=\|x\|_2
$$

is differentiable for  $x\neq 0$  with  $\nabla f(x)=x/\|x\|$ , but **not** differentiable at  $0$ . That’s where convex analysis switches from gradients to **subgradients**.

* * *

11) End-of-Module 13 checklist (don’t move on if any item is fuzzy)
===================================================================

You can:

*   State Fréchet differentiability and explain why it demands a neighborhood (domain honesty).
*   Prove that differentiability implies  $Df(x;d)=\nabla f(x)^\top d$ .
*   Define Jacobian and Hessian as Fréchet derivatives of vector maps and the gradient map.
*   Prove  $\varphi''(0)=d^\top\nabla^2 f(x)d$  for  $\varphi(t)=f(x+td)$ .
*   Prove:
    *   differentiable convex  $\Longleftrightarrow$  supporting hyperplane inequality,
    *    $C^2$  convex on convex open set  $\Longleftrightarrow$  Hessian PSD everywhere.
*   Derive smoothness:  $\nabla^2 f\preceq LI \Rightarrow \nabla f$  is  $L$ \-Lipschitz (via segment integral).
*   Compute gradients/Hessians for quadratics and least squares and know where norms break differentiability.

* * *

Next module
-----------

**Module 14 — Hulls and cones (affine/convex/conic) + dual cones.**  
This is where “geometry of feasible sets” becomes algebra, and duality starts showing up as “supporting hyperplanes of cones.”

## Prompt:
Now this:
# Module 12 — PCA: three equivalent lenses (max variance / min reconstruction / SVD equivalence)

*(PCA is not a ritual. It’s one theorem wearing three disguises.)*

## 0) What PCA is really trying to do

You have data in (\mathbb R^n). It’s a cloud of points. You want a **low-dimensional summary** (say (k\ll n)) that:

1. captures as much *spread/variation* as possible,
2. loses as little information as possible when you reconstruct,
3. can be computed stably and efficiently.

Those are the three “lenses.” The punchline is: **they all pick the same subspace**.

---

# 1) Setup: population version vs sample version

## 1.1 Population version (random vector)

Let (X\in\mathbb R^n) be a random vector with finite second moment: (\mathbb E|X|*2^2<\infty).
Mean:
[
\mu=\mathbb E[X].
]
Covariance:
[
\Sigma=\mathrm{Cov}(X)=\mathbb E[(X-\mu)(X-\mu)^\top]\in\mathbf S*+^n.
]
(PSD proof was Module 11.)

We will assume (\Sigma\neq 0) unless otherwise stated (if (\Sigma=0), the data has zero variance and PCA is trivial).

## 1.2 Sample version (finite dataset)

You observe (N) points (x^{(1)},\dots,x^{(N)}\in\mathbb R^n).

Stack them as rows in a data matrix:
[
X=\begin{bmatrix}
(x^{(1)})^\top\
\vdots\
(x^{(N)})^\top
\end{bmatrix}\in\mathbb R^{N\times n}.
]
Sample mean:
[
\bar x=\frac{1}{N}\sum_{i=1}^N x^{(i)}\in\mathbb R^n.
]
Centered data matrix:
[
Z := X - \mathbf 1,\bar x^\top\in\mathbb R^{N\times n},
]
where (\mathbf 1\in\mathbb R^N) is the all-ones vector (so (\mathbf 1,\bar x^\top) repeats the mean in each row).

Sample covariance (using (1/N); using (1/(N-1)) changes only scaling, not eigenvectors):
[
S:=\frac{1}{N}Z^\top Z\in\mathbf S_+^n.
]

From here on:

* “population PCA” uses (\Sigma),
* “sample PCA” uses (S).
  The geometry and proofs are identical.

---

# 2) Lens 1 — Max variance direction (the Rayleigh quotient view)

## 2.1 What is “variance along a direction”?

Pick a unit vector (u\in\mathbb R^n) with (|u|_2=1). Consider the 1D projection:
[
Y := u^\top (X-\mu).
]
This is a scalar random variable. It measures “coordinate of (X) along direction (u)” after centering.

From Module 11:
[
\mathrm{Var}(Y)=\mathrm{Var}(u^\top X)=u^\top \Sigma u.
]

So the “variance captured by direction (u)” equals the quadratic form (u^\top\Sigma u).

## 2.2 First principal component = maximize variance subject to unit length

Define the optimization problem:
[
\boxed{\ \max_{|u|_2=1}\ u^\top \Sigma u. \ }
]
This is exactly the Rayleigh quotient maximization from Module 8.

### Theorem (Rayleigh–Ritz, specialized)

Let (\Sigma\in\mathbf S^n) with eigenvalues (\lambda_1\ge\lambda_2\ge\cdots\ge\lambda_n\ge 0). Then:
[
\max_{|u|=1}u^\top\Sigma u=\lambda_1,
]
and any maximizer (u^\star) can be chosen as an eigenvector for (\lambda_1).

### Proof (completely explicit using the spectral theorem)

Diagonalize:
[
\Sigma = Q\Lambda Q^\top,\quad Q\ \text{orthogonal},\ \Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n).
]
Let (y:=Q^\top u). Since (Q) is orthogonal, (|y|*2=|u|*2=1). Then
[
u^\top\Sigma u
= u^\top Q\Lambda Q^\top u
= y^\top\Lambda y
= \sum*{i=1}^n \lambda_i y_i^2.
]
Constraint: (\sum*{i=1}^n y_i^2=1) and each (y_i^2\ge 0). So ({y_i^2}) are weights that sum to 1.

Because (\lambda_1\ge\lambda_i) for all (i),
[
\sum_{i=1}^n \lambda_i y_i^2 \le \sum_{i=1}^n \lambda_1 y_i^2 = \lambda_1\sum_{i=1}^n y_i^2=\lambda_1.
]
So the maximum is (\le\lambda_1). Achieve equality by choosing (y=e_1) (i.e. (y_1=1), others 0), which corresponds to (u=Qe_1=q_1), the top eigenvector. ∎

**Commentary (why this isn’t a trick):**
Variance in direction (u) is a weighted average of eigenvalues, with weights (y_i^2) telling you how much (u) points along eigenvector (q_i). You maximize by putting all weight on the biggest eigenvalue direction.

---

# 3) Lens 1b — Top (k) components (maximize total captured variance)

Now we want not one direction but a (k)-dimensional subspace.

Let (U\in\mathbb R^{n\times k}) have orthonormal columns:
[
U^\top U = I_k.
]
Think of columns (u_1,\dots,u_k) as (k) orthonormal directions. The projection of (X-\mu) onto this subspace is (U^\top(X-\mu)\in\mathbb R^k).

A natural “total variance captured” is the sum of variances along these orthonormal directions:
[
\sum_{j=1}^k \mathrm{Var}(u_j^\top X)
= \sum_{j=1}^k u_j^\top\Sigma u_j
= \mathrm{tr}(U^\top \Sigma U).
]
(Last equality because (\mathrm{tr}(U^\top\Sigma U)=\sum_{j=1}^k e_j^\top(U^\top\Sigma U)e_j=\sum_{j=1}^k u_j^\top\Sigma u_j).)

So the (k)-PC problem is:
[
\boxed{\ \max_{U^\top U=I_k}\ \mathrm{tr}(U^\top\Sigma U). \ }
]

### Theorem (Ky Fan variational principle, proved from scratch in eigen-coordinates)

Let (\lambda_1\ge\cdots\ge\lambda_n) be eigenvalues of (\Sigma). Then:
[
\max_{U^\top U=I_k}\mathrm{tr}(U^\top\Sigma U)=\sum_{i=1}^k \lambda_i,
]
and an optimizer is (U^\star=[q_1\ \cdots\ q_k]), the top (k) eigenvectors.

#### Proof (granular, using only linear algebra)

Diagonalize (\Sigma=Q\Lambda Q^\top). Let (W:=Q^\top U\in\mathbb R^{n\times k}). Since (Q) is orthogonal:
[
W^\top W = U^\top Q Q^\top U = U^\top U = I_k,
]
so columns of (W) are also orthonormal.

Now:
[
\mathrm{tr}(U^\top\Sigma U)
=\mathrm{tr}(U^\top Q\Lambda Q^\top U)
=\mathrm{tr}(W^\top \Lambda W).
]
Expand that trace in a way that exposes “weights”:

Let (w_1,\dots,w_k) be the columns of (W). Then
[
\mathrm{tr}(W^\top\Lambda W)=\sum_{j=1}^k w_j^\top \Lambda w_j
=\sum_{j=1}^k \sum_{i=1}^n \lambda_i (w_{ij})^2
=\sum_{i=1}^n \lambda_i\left(\sum_{j=1}^k (w_{ij})^2\right).
]
Define for each row (i):
[
\alpha_i := \sum_{j=1}^k (w_{ij})^2 = | \text{row}_i(W)|_2^2.
]
Then:

* (\alpha_i\ge 0).
* Also (\alpha_i\le 1) because (W W^\top) is a projection matrix (its diagonal entries are between 0 and 1), and ((WW^\top)_{ii}=\alpha_i).
* And crucially:
  [
  \sum_{i=1}^n \alpha_i = \sum_{i=1}^n \sum_{j=1}^k (w_{ij})^2 = \sum_{j=1}^k \sum_{i=1}^n (w_{ij})^2 = \sum_{j=1}^k |w_j|_2^2 = k,
  ]
  since each column (w_j) is unit norm.

So the objective becomes:
[
\mathrm{tr}(U^\top\Sigma U)=\sum_{i=1}^n \lambda_i \alpha_i
]
with constraints:
[
0\le \alpha_i \le 1,\qquad \sum_{i=1}^n \alpha_i = k.
]

Now comes a clean “greedy is optimal” argument: since (\lambda_1\ge\lambda_2\ge\cdots),
the maximum of (\sum \lambda_i\alpha_i) under those constraints is achieved by putting as much weight as possible ((\alpha_i=1)) on the largest eigenvalues first:
[
\alpha_1=\cdots=\alpha_k=1,\quad \alpha_{k+1}=\cdots=\alpha_n=0.
]
This yields value (\sum_{i=1}^k\lambda_i). No other feasible ({\alpha_i}) can do better, because any mass shifted from a larger (\lambda) to a smaller (\lambda) weakly decreases the sum.

Achievability: choose (W=[e_1\ \cdots\ e_k]). Then (U=QW=[q_1\ \cdots\ q_k]), and indeed (\alpha_1=\cdots=\alpha_k=1). ∎

**Non-uniqueness edge case:** If (\lambda_k=\lambda_{k+1}), the optimal subspace is not unique: any orthonormal basis inside the tied eigenspace is optimal.

---

# 4) Lens 2 — Minimum reconstruction error (projection view)

Now we phrase PCA as “best (k)-dimensional approximation.”

## 4.1 Projection onto a (k)-dimensional subspace

Let (U\in\mathbb R^{n\times k}) with (U^\top U=I). The orthogonal projector onto (\mathrm{span}(U)) is:
[
P := UU^\top.
]
Given a point (x), its projection is (Px).

For the random vector (X), the reconstruction using this subspace is:
[
\hat X := \mu + P(X-\mu) = \mu + UU^\top (X-\mu).
]
So:

* you center ((X-\mu)),
* project into the (k)-dim subspace,
* re-add the mean.

## 4.2 Define reconstruction error

The mean squared reconstruction error is:
[
\mathcal E(U) := \mathbb E\big[|X-\hat X|_2^2\big]
= \mathbb E\big[|(I-P)(X-\mu)|_2^2\big].
]

### Key identity: (\mathcal E(U)=\mathrm{tr}(\Sigma)-\mathrm{tr}(U^\top\Sigma U))

**Proof (step-by-step):**
Let (Y:=X-\mu) (centered). Then (\mathbb E[YY^\top]=\Sigma).

Compute the squared norm using trace:
[
|(I-P)Y|_2^2 = Y^\top (I-P)^\top (I-P) Y.
]
But (P) is symmetric and idempotent ((P^\top=P), (P^2=P)), so ((I-P)^\top(I-P)=(I-P)^2=I-P). Thus
[
|(I-P)Y|_2^2 = Y^\top (I-P) Y.
]
Take expectation:
[
\mathcal E(U)=\mathbb E[Y^\top(I-P)Y].
]
Use the identity (y^\top M y=\mathrm{tr}(y^\top M y)=\mathrm{tr}(M yy^\top)):
[
Y^\top(I-P)Y = \mathrm{tr}((I-P)YY^\top).
]
So
[
\mathcal E(U) = \mathbb E[\mathrm{tr}((I-P)YY^\top)]
= \mathrm{tr}\big((I-P)\mathbb E[YY^\top]\big)
= \mathrm{tr}((I-P)\Sigma).
]
Now expand trace:
[
\mathrm{tr}((I-P)\Sigma)=\mathrm{tr}(\Sigma)-\mathrm{tr}(P\Sigma).
]
And (\mathrm{tr}(P\Sigma)=\mathrm{tr}(UU^\top\Sigma)=\mathrm{tr}(U^\top\Sigma U)) (cyclic trace property). Hence:
[
\boxed{\ \mathcal E(U)=\mathrm{tr}(\Sigma)-\mathrm{tr}(U^\top\Sigma U). \ }
]
∎

### Conclusion: minimizing reconstruction error = maximizing captured variance

Since (\mathrm{tr}(\Sigma)) is constant in (U),
[
\min_{U^\top U=I}\mathcal E(U)
\quad\Longleftrightarrow\quad
\max_{U^\top U=I}\mathrm{tr}(U^\top\Sigma U).
]
But we already solved the max problem: the optimizer is top (k) eigenvectors.

So PCA’s “best reconstruction subspace” is exactly the same as PCA’s “max variance subspace.”

**Interpretation:**
Total variance (\mathrm{tr}(\Sigma)) splits into:

* explained variance (inside subspace),
* leftover variance (orthogonal complement).
  PCA chooses the subspace that makes leftover variance as small as possible.

---

# 5) Lens 3 — SVD of centered data (computational/algorithmic view)

Now do the sample version. Let centered data matrix be (Z\in\mathbb R^{N\times n}), and sample covariance (S=\frac1N Z^\top Z).

Compute the SVD:
[
\boxed{\ Z = \tilde U,\Sigma_z,V^\top, }
]
where:

* (\tilde U\in\mathbb R^{N\times N}) orthogonal,
* (V\in\mathbb R^{n\times n}) orthogonal,
* (\Sigma_z\in\mathbb R^{N\times n}) has singular values (\sigma_1\ge\cdots\ge\sigma_r>0).

## 5.1 Covariance eigenvectors = right singular vectors

Compute:
[
Z^\top Z = V,\Sigma_z^\top \tilde U^\top \tilde U,\Sigma_z,V^\top
= V(\Sigma_z^\top\Sigma_z)V^\top.
]
Divide by (N):
[
S=\frac1N Z^\top Z = V\left(\frac1N\Sigma_z^\top\Sigma_z\right)V^\top.
]
So (V) diagonalizes (S). Therefore:
[
\boxed{\ \text{Eigenvectors of }S\text{ are columns of }V. }
]
And eigenvalues are:
[
\boxed{\ \lambda_i(S)=\frac{\sigma_i^2}{N}\quad(\text{or } \frac{\sigma_i^2}{N-1}\text{ if you use }1/(N-1)). }
]

## 5.2 PC scores = projected coordinates = (ZV)

The (i)-th principal direction (loading vector) is (v_i). The corresponding **scores** (coordinates of each sample along that PC) are:
[
t_i := Z v_i \in \mathbb R^N.
]
But using SVD:
[
Zv_i = \tilde U,\Sigma_z,V^\top v_i
= \tilde U,\Sigma_z e_i
= \sigma_i \tilde u_i,
]
where (\tilde u_i) is the (i)-th left singular vector. So:
[
\boxed{\ Z v_i = \sigma_i \tilde u_i. }
]
That’s a very clean computational identity.

## 5.3 Reconstruction and truncated SVD

The best rank-(k) approximation of (Z) in Frobenius norm is the truncated SVD:
[
Z_k=\tilde U_k \Sigma_{z,k} V_k^\top,
]
and (from Eckart–Young–Mirsky, Module 10):
[
|Z-Z_k|*F^2=\sum*{i=k+1}^r \sigma_i^2.
]
But (\frac1N|Z-Z_k|_F^2) is exactly the average squared reconstruction error of data points using the top (k) PCs. So the SVD lens is literally “PCA = best low-rank approximation of the centered data matrix.”

---

# 6) What PCA outputs (and what is ambiguous)

Given covariance (S) (or (\Sigma)) eigen-decomposition:
[
S = V\Lambda V^\top,\quad \Lambda=\mathrm{diag}(\lambda_1\ge\cdots\ge\lambda_n\ge 0),
]
PCA gives:

* **principal directions / loadings:** (v_1,\dots,v_k),
* **explained variances:** (\lambda_1,\dots,\lambda_k),
* **scores:** (T = Z V_k\in\mathbb R^{N\times k}),
* **reconstruction:** (\hat Z = T V_k^\top = Z V_k V_k^\top), and (\hat X = \mathbf 1\bar x^\top + \hat Z).

### Two unavoidable ambiguities

1. **Sign flips:** if (v) is an eigenvector, so is (-v). Scores flip sign accordingly. Nothing changes geometrically.
2. **Eigenvalue ties:** if (\lambda_k=\lambda_{k+1}), the top-(k) subspace can be non-unique; any orthonormal basis in that eigenspace is valid.

---

# 7) Practical sanity checks (to stop dumb mistakes)

* Always center. PCA without centering is usually analyzing “direction to the mean,” not variation about the mean.
* Scaling matters: if coordinates are in wildly different units, PCA will be dominated by the largest-scale feature. Standardization (z-scoring) changes the question to PCA on correlation rather than covariance.
* Explained variance ratio:
  [
  \text{EVR}*i=\frac{\lambda_i}{\sum*{j=1}^n \lambda_j}=\frac{\lambda_i}{\mathrm{tr}(S)}.
  ]
* Total reconstruction error for top (k):
  [
  \mathrm{tr}(S)-\sum_{i=1}^k\lambda_i=\sum_{i=k+1}^n \lambda_i.
  ]

---

# 8) End-of-Module 12 checklist (no mercy)

You’re ready to move on only if you can prove, cleanly:

1. ( \max_{|u|=1} u^\top\Sigma u = \lambda_1) and optimizer is top eigenvector.
2. ( \max_{U^\top U=I_k}\mathrm{tr}(U^\top\Sigma U)=\sum_{i=1}^k\lambda_i) (Ky Fan) via the (\alpha_i) weights argument.
3. Reconstruction error identity:
   [
   \mathbb E|(I-UU^\top)(X-\mu)|^2=\mathrm{tr}(\Sigma)-\mathrm{tr}(U^\top\Sigma U).
   ]
4. SVD equivalence: if (Z=\tilde U\Sigma_z V^\top), then (S=\frac1N Z^\top Z = V(\Sigma_z^\top\Sigma_z/N)V^\top), so eigenvectors of (S) are (V).

---

## Next module

**Module 13 — Multivariable calculus and matrix calculus objects (optimization-ready):** gradients, Hessians, directional derivatives, Taylor expansion, and the theorem “(C^2) convex ⇔ Hessian PSD (on convex domains).”

## Response:
Module 12 — PCA: three equivalent lenses (max variance / min reconstruction / SVD equivalence)
==============================================================================================

_(PCA is not a ritual. It’s one theorem wearing three disguises.)_

0) What PCA is really trying to do (in one sentence)
----------------------------------------------------

Given a cloud of points in  $\mathbb R^n$ , PCA finds the **best  $k$ \-dimensional linear subspace** (with  $k\ll n$ ) in a very specific sense:  
**it is simultaneously the subspace that captures the most variance, minimizes mean squared reconstruction error, and corresponds to the top- $k$  singular directions of the centered data matrix.**

If those three statements don’t _feel_ like the same thing yet, this module is the glue.

* * *

1) Setup: population vs sample (and fix the notation collision)
===============================================================

I’ll use:

*    $X\in\mathbb R^n$  = **random vector** (population).
*   Data matrix  $D\in\mathbb R^{N\times n}$  = **observed samples** stacked as rows (sample).

This avoids the classic confusion where both are called  $X$ .

* * *

1.1 Population PCA (random vector)
----------------------------------

Assume  $X\in\mathbb R^n$  has finite second moment:

$$
\mathbb E\|X\|_2^2<\infty.
$$

Mean:

$$
\mu=\mathbb E[X].
$$

Covariance:

$$
\Sigma=\mathrm{Cov}(X)=\mathbb E[(X-\mu)(X-\mu)^\top]\in \mathbf S_+^n.
$$

(Module 11 proved  $\Sigma\succeq 0$ .)

Edge cases:

*   If  $\Sigma=0$ , there is literally no spread:  $X=\mu$  a.s. PCA is trivial.
*   If  $\Sigma$  is singular, the distribution lives in a lower-dimensional affine subspace; PCA will discover that.

* * *

1.2 Sample PCA (finite dataset)
-------------------------------

You observe samples  $x^{(1)},\dots,x^{(N)}\in\mathbb R^n$ . Stack:

$$
D= \begin{bmatrix} (x^{(1)})^\top\\ \vdots\\ (x^{(N)})^\top \end{bmatrix}\in\mathbb R^{N\times n}.
$$

Sample mean:

$$
\bar x=\frac1N\sum_{i=1}^N x^{(i)}\in\mathbb R^n.
$$

Centered data matrix:

$$
Z := D - \mathbf 1\,\bar x^\top\in\mathbb R^{N\times n},
$$

where  $\mathbf 1\in\mathbb R^N$  is the all-ones vector.

Sample covariance (two common scalings):

$$
S=\frac1N Z^\top Z \qquad\text{or}\qquad \hat S=\frac1{N-1}Z^\top Z.
$$

Important:  $S$  vs  $\hat S$  differ by a scalar factor  $\frac{N}{N-1}$ , so they have **the same eigenvectors** (principal directions). The scaling changes eigenvalues but not the PCA subspace.

From here on, proofs look identical if you replace  $\Sigma$  by  $S$ .

* * *

2) Lens 1 — Max variance direction (Rayleigh quotient view)
===========================================================

2.1 Variance along a direction is a quadratic form
--------------------------------------------------

Pick a unit vector  $u\in\mathbb R^n$  with  $\|u\|_2=1$ . Consider the 1D projection of centered data:

$$
Y := u^\top (X-\mu).
$$

From Module 11:

$$
\mathrm{Var}(Y)=\mathrm{Var}(u^\top X)=u^\top \Sigma u.
$$

So “variance captured by direction  $u$ ” is exactly  $u^\top\Sigma u$ .

* * *

2.2 First principal component = solve a constrained maximization
----------------------------------------------------------------

 $$
\boxed{\ \max_{\|u\|_2=1} u^\top \Sigma u.\ }
$$

This is the Rayleigh quotient maximization.

### Theorem (Rayleigh–Ritz, specialized to PSD covariance)

Let  $\Sigma\in\mathbf S_+^n$  have eigenvalues  $\lambda_1\ge\cdots\ge\lambda_n\ge 0$ . Then

$$
\max_{\|u\|=1}u^\top \Sigma u=\lambda_1,
$$

and any maximizer can be chosen as a top eigenvector  $q_1$ .

### Proof (no handwaving)

Diagonalize  $\Sigma$  (spectral theorem):

$$
\Sigma=Q\Lambda Q^\top,\qquad Q \text{ orthogonal},\ \Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n).
$$

Let  $y=Q^\top u$ . Because  $Q$  is orthogonal,  $\|y\|_2=\|u\|_2=1$ . Then

$$
u^\top\Sigma u = u^\top Q\Lambda Q^\top u = y^\top \Lambda y = \sum_{i=1}^n \lambda_i y_i^2.
$$

Constraints:  $y_i^2\ge 0$  and  $\sum_{i=1}^n y_i^2=1$ . So  $(y_i^2)$  are weights summing to 1. Since  $\lambda_1\ge \lambda_i$ ,

$$
\sum_{i=1}^n \lambda_i y_i^2 \le \sum_{i=1}^n \lambda_1 y_i^2 = \lambda_1\sum_{i=1}^n y_i^2 =\lambda_1.
$$

Achieve equality by  $y=e_1$ , i.e.  $u=Qe_1=q_1$ . ∎

**Interpretation:** variance along  $u$  is a weighted average of eigenvalues; you maximize by aligning with the biggest eigen-direction.

* * *

3) Lens 1b — Top  $k$  components (maximize total captured variance)
====================================================================

Now we want a ** $k$ \-dimensional subspace**, not one direction.

Represent a candidate subspace by an orthonormal basis  $U\in\mathbb R^{n\times k}$  with

$$
U^\top U=I_k.
$$

Columns  $u_1,\dots,u_k$  are orthonormal directions.

Total variance captured by projecting onto this subspace:

$$
\sum_{j=1}^k \mathrm{Var}(u_j^\top X) =\sum_{j=1}^k u_j^\top\Sigma u_j =\mathrm{tr}(U^\top \Sigma U).
$$

So PCA’s  $k$ \-subspace problem is:

 $$
\boxed{\ \max_{U^\top U=I_k}\ \mathrm{tr}(U^\top\Sigma U).\ }
$$

* * *

3.1 Ky Fan variational principle (proved in eigen-coordinates)
--------------------------------------------------------------

### Theorem

If  $\lambda_1\ge\cdots\ge\lambda_n$  are eigenvalues of  $\Sigma$ , then

$$
\max_{U^\top U=I_k}\mathrm{tr}(U^\top\Sigma U)=\sum_{i=1}^k \lambda_i,
$$

and one optimizer is  $U^\star=[q_1\ \cdots\ q_k]$  (top  $k$  eigenvectors).

### Proof (granular and fully explicit)

Diagonalize  $\Sigma=Q\Lambda Q^\top$ . Let

$$
W:=Q^\top U\in\mathbb R^{n\times k}.
$$

Then

$$
W^\top W = U^\top Q Q^\top U = U^\top U = I_k,
$$

so the columns of  $W$  are orthonormal too.

Compute the objective:

$$
\mathrm{tr}(U^\top\Sigma U) =\mathrm{tr}(U^\top Q\Lambda Q^\top U) =\mathrm{tr}(W^\top \Lambda W).
$$

Let  $w_1,\dots,w_k$  be columns of  $W$ . Then

$$
\mathrm{tr}(W^\top \Lambda W) =\sum_{j=1}^k w_j^\top \Lambda w_j =\sum_{j=1}^k \sum_{i=1}^n \lambda_i (w_{ij})^2 =\sum_{i=1}^n \lambda_i\underbrace{\left(\sum_{j=1}^k (w_{ij})^2\right)}_{\alpha_i}.
$$

Define

$$
\alpha_i := \sum_{j=1}^k (w_{ij})^2 = \| \text{row}_i(W)\|_2^2.
$$

Now prove the constraints on  $\alpha$ :

1.  ** $\alpha_i\ge 0$ ** obvious (sum of squares).
2.  ** $\alpha_i\le 1$ **:  
    Consider  $P:=WW^\top\in\mathbb R^{n\times n}$ . Since  $W^\top W=I_k$ ,
    
$$
P^2=WW^\top WW^\top = W(I_k)W^\top = WW^\top=P,
$$

and  $P^\top=P$ . So  $P$  is an orthogonal projector, hence  $0\preceq P\preceq I$ . In particular, its diagonal entries satisfy  $0\le P_{ii}\le 1$ . But

$$
P_{ii}=e_i^\top WW^\top e_i = \|W^\top e_i\|_2^2 = \sum_{j=1}^k (w_{ij})^2=\alpha_i.
$$
3.  ** $\sum_{i=1}^n \alpha_i = k$ **:
    
$$
\sum_{i=1}^n \alpha_i =\sum_{i=1}^n\sum_{j=1}^k (w_{ij})^2 =\sum_{j=1}^k \sum_{i=1}^n (w_{ij})^2 =\sum_{j=1}^k \|w_j\|_2^2 =\sum_{j=1}^k 1 = k.
$$

So the optimization becomes:

$$
\max_{\alpha}\ \sum_{i=1}^n \lambda_i \alpha_i \quad\text{s.t.}\quad 0\le \alpha_i\le 1,\ \sum_{i=1}^n \alpha_i = k.
$$

This is a linear objective over a convex polytope. A linear program achieves its maximum at an extreme point. The extreme points here are exactly vectors  $\alpha$  with  $k$  entries equal to 1 and the rest 0 (you can’t have fractional entries at an extreme point because you could perturb them while keeping the sum constraint).

Since  $\lambda$  is sorted descending, the best extreme point is

$$
\alpha_1=\cdots=\alpha_k=1,\qquad \alpha_{k+1}=\cdots=\alpha_n=0,
$$

giving value  $\sum_{i=1}^k \lambda_i$ .

Achievability: choose  $W=[e_1\ \cdots\ e_k]$ , which has orthonormal columns. Then  $U=QW=[q_1\ \cdots\ q_k]$  and indeed  $\alpha_1=\cdots=\alpha_k=1$ . ∎

**Non-uniqueness edge case:** if  $\lambda_k=\lambda_{k+1}$ , then many  $k$ \-dimensional subspaces tie for optimality (any basis spanning the “tied” eigenspace works).

* * *

4) Lens 2 — Minimum reconstruction error (projection view)
==========================================================

This lens answers: “What  $k$ \-dimensional subspace best approximates the data in mean squared distance?”

4.1 Orthogonal projection onto a  $k$ \-subspace
------------------------------------------------

Let  $U\in\mathbb R^{n\times k}$  with  $U^\top U=I$ . The projector onto  $\mathrm{span}(U)$  is:

$$
P:=UU^\top.
$$

For population PCA, reconstruct  $X$  by:

$$
\hat X := \mu + P(X-\mu).
$$

4.2 Define reconstruction error
-------------------------------

Let  $Y:=X-\mu$ . Then  $\mathbb E[YY^\top]=\Sigma$ . The mean squared reconstruction error is:

$$
\mathcal E(U) := \mathbb E\|X-\hat X\|_2^2 =\mathbb E\|(I-P)Y\|_2^2.
$$

### Key identity

 $$
\boxed{\ \mathcal E(U)=\mathrm{tr}(\Sigma)-\mathrm{tr}(U^\top\Sigma U). }
$$

#### Proof (step-by-step, no magic trace moves)

Start:

$$
\|(I-P)Y\|_2^2 = Y^\top (I-P)^\top (I-P)Y.
$$

Since  $P$  is symmetric and idempotent ( $P^\top=P$ ,  $P^2=P$ ):

$$
(I-P)^\top(I-P)=(I-P)(I-P)=I-2P+P^2=I-P.
$$

So

$$
\|(I-P)Y\|_2^2 = Y^\top (I-P)Y.
$$

Take expectation:

$$
\mathcal E(U)=\mathbb E\big[Y^\top(I-P)Y\big].
$$

Use the identity  $y^\top M y=\mathrm{tr}(y^\top M y)=\mathrm{tr}(M yy^\top)$ :

$$
Y^\top(I-P)Y=\mathrm{tr}\big((I-P)YY^\top\big).
$$

Then linearity of trace and expectation:

$$
\mathcal E(U)=\mathbb E\big[\mathrm{tr}((I-P)YY^\top)\big] =\mathrm{tr}\big((I-P)\mathbb E[YY^\top]\big) =\mathrm{tr}((I-P)\Sigma).
$$

Expand:

$$
\mathrm{tr}((I-P)\Sigma)=\mathrm{tr}(\Sigma)-\mathrm{tr}(P\Sigma).
$$

Now  $P=UU^\top$  and trace is cyclic:

$$
\mathrm{tr}(P\Sigma)=\mathrm{tr}(UU^\top\Sigma)=\mathrm{tr}(U^\top\Sigma U).
$$

Done. ∎

### Conclusion: Lens 2 collapses into Lens 1b

Since  $\mathrm{tr}(\Sigma)$  doesn’t depend on  $U$ ,

$$
\min_{U^\top U=I}\mathcal E(U) \quad\Longleftrightarrow\quad \max_{U^\top U=I}\mathrm{tr}(U^\top\Sigma U),
$$

so the minimizer is the top- $k$  eigen-subspace again.

**Interpretation:** total variance = explained variance + leftover variance. PCA minimizes leftover variance.

* * *

5) Lens 3 — SVD of centered data (computational view)
=====================================================

Now do the sample case with  $Z\in\mathbb R^{N\times n}$ .

Compute SVD:

 $$
\boxed{\ Z = \tilde U\,\Sigma_z\,V^\top, }
$$

where singular values  $\sigma_1\ge\cdots\ge\sigma_r>0$  sit on  $\Sigma_z$ .

5.1 Covariance eigenvectors = right singular vectors
----------------------------------------------------

Compute:

$$
Z^\top Z = V\Sigma_z^\top \tilde U^\top \tilde U \Sigma_z V^\top = V(\Sigma_z^\top\Sigma_z)V^\top.
$$

So

$$
S=\frac1N Z^\top Z = V\left(\frac1N \Sigma_z^\top\Sigma_z\right)V^\top.
$$

Therefore:

*   eigenvectors of  $S$  are columns of  $V$ ,
*   eigenvalues satisfy
    $$
    \lambda_i(S)=\frac{\sigma_i^2}{N} \quad\text{(or } \frac{\sigma_i^2}{N-1}\text{ with unbiased scaling).}
    $$

So **PCA directions are right singular vectors of centered data.**

5.2 Scores and a clean identity
-------------------------------

PC  $i$  loading vector is  $v_i$ . Scores (coordinates of each sample along that PC):

$$
t_i := Z v_i \in \mathbb R^N.
$$

Using SVD:

$$
Zv_i = \tilde U\Sigma_z V^\top v_i = \tilde U\Sigma_z e_i = \sigma_i \tilde u_i.
$$

So:

 $$
\boxed{\ Z v_i = \sigma_i \tilde u_i. }
$$

This is _the_ computational identity behind fast PCA.

5.3 Truncated SVD = PCA reconstruction
--------------------------------------

From Eckart–Young–Mirsky (Module 10), the best rank- $k$  approximation in Frobenius norm is:

$$
Z_k=\tilde U_k \Sigma_{z,k} V_k^\top,
$$

and the error is:

$$
\|Z-Z_k\|_F^2=\sum_{i=k+1}^r \sigma_i^2.
$$

But  $\frac1N\|Z-Z_k\|_F^2$  is exactly the **average squared reconstruction error** of samples after projecting onto the top  $k$  PCs. So Lens 3 is literally Lens 2 in matrix form.

* * *

6) What PCA outputs (and the unavoidable ambiguities)
=====================================================

Given  $S=V\Lambda V^\top$  with  $\lambda_1\ge\cdots\ge\lambda_n\ge 0$ :

*   **Loadings / principal directions:**  $V_k=[v_1,\dots,v_k]$ 
*   **Explained variances:**  $\lambda_1,\dots,\lambda_k$ 
*   **Scores:**  $T = ZV_k \in \mathbb R^{N\times k}$ 
*   **Reconstruction of centered data:**  $\hat Z = T V_k^\top = ZV_kV_k^\top$ 
*   **Reconstruction of raw data:**  $\hat D = \mathbf 1\bar x^\top + \hat Z$ 

Ambiguities:

1.  **Sign flips:** if  $v$  is an eigenvector, so is  $-v$ . Scores flip sign; geometry doesn’t care.
2.  **Eigenvalue ties:** if  $\lambda_k=\lambda_{k+1}$ , the optimal  $k$ \-subspace isn’t unique.

* * *

7) Practical sanity checks (ways PCA quietly goes wrong)
========================================================

*   **Centering is mandatory** unless you explicitly want “direction to the mean.”
*   **Scaling matters:** if features have different units/scales, PCA on covariance is dominated by large-scale features. Standardize (z-score) if the question is “correlation structure” rather than “absolute variance.”
*   **Outliers can hijack PCA:** it’s least-squares geometry. Robust PCA is a different beast.
*   **High-dimensional regime  $n\gg N$ :** computing  $S\in\mathbb R^{n\times n}$  can be expensive/ill-conditioned; SVD on  $Z\in\mathbb R^{N\times n}$  is usually the stable route.

Explained variance ratio:

$$
\mathrm{EVR}_i=\frac{\lambda_i}{\sum_{j=1}^n\lambda_j}=\frac{\lambda_i}{\mathrm{tr}(S)}.
$$

Total leftover variance after  $k$  PCs:

$$
\mathrm{tr}(S)-\sum_{i=1}^k\lambda_i=\sum_{i=k+1}^n \lambda_i.
$$

* * *

8) End-of-Module 12 checklist (no mercy)
========================================

You’re actually ready only if you can prove, cleanly:

1.   $\max_{\|u\|=1}u^\top\Sigma u=\lambda_1$  and optimizer is a top eigenvector.
2.   $\max_{U^\top U=I_k}\mathrm{tr}(U^\top\Sigma U)=\sum_{i=1}^k\lambda_i$  via the  $\alpha_i$ \-weights / projection argument.
3.  Reconstruction identity:
    
$$
\mathbb E\|(I-UU^\top)(X-\mu)\|_2^2=\mathrm{tr}(\Sigma)-\mathrm{tr}(U^\top\Sigma U).
$$
4.  SVD equivalence:
    
$$
S=\frac1N Z^\top Z=V\left(\frac1N\Sigma_z^\top\Sigma_z\right)V^\top,
$$

so PCA directions are right singular vectors of  $Z$ .

* * *

Next module
-----------

**Module 13 — Multivariable calculus objects (optimization-ready):** gradients, Hessians, directional derivatives, Taylor expansion, and “ $C^2$  convex  $\Longleftrightarrow$  Hessian PSD on convex open domains.”

## Prompt:
Now this:

# Module 14 — Hulls and cones: affine/convex/conic hulls + dual cones

*(how “take all mixtures” becomes the algebra of optimization and duality)*

## 0) What this module is secretly doing

Duality (LP/SOCP/SDP, KKT multipliers, certificates) is basically the study of **cones** and their **dual cones**.

This module builds the geometry atoms you’ll use later every day:

* **Affine hull**: “all affine combinations” (translation-invariant linear structure).
* **Convex hull**: “all convex combinations” (all weighted averages).
* **Conic hull**: “all nonnegative scalings of convex combinations” (cones).
* **Dual cone**: “all vectors that make nonnegative inner product with everything in the cone.”

And then the big structural facts:

1. (K^*) is always a **closed convex cone** (even if (K) is ugly).
2. For a closed convex cone (K), (K^{**}=K).
3. (\mathbb R_+^n) is self-dual (under standard dot product).
4. The PSD cone (S_+^n) is self-dual under the **trace inner product**.

That last one is the algebraic heart of SDP duality.

---

# 1) Sets and combinations (quick recap, because hulls *are* combinations)

Let (x^{(1)},\dots,x^{(k)}\in\mathbb R^n).

* Linear combination: (\sum_{i=1}^k \theta_i x^{(i)}), (\theta_i\in\mathbb R).
* Affine combination: (\sum_{i=1}^k \theta_i x^{(i)}) with (\sum_i\theta_i=1).
* Convex combination: (\sum_{i=1}^k \theta_i x^{(i)}) with (\theta_i\ge 0) and (\sum_i\theta_i=1).
* Conic combination: (\sum_{i=1}^k \alpha_i x^{(i)}) with (\alpha_i\ge 0) (no sum-to-1 constraint).

**Sanity:** convex = “average,” conic = “nonnegative mixture with arbitrary total mass.”

---

# 2) Hulls: definitions and “smallest set closed under X”

Let (C\subseteq\mathbb R^n). A “hull” is the **smallest** set containing (C) that satisfies some closure property.

## 2.1 Affine hull

### Definition

[
\boxed{\ \mathrm{aff}(C):=\left{\sum_{i=1}^k\theta_i x^{(i)}:\ x^{(i)}\in C,\ \sum_{i=1}^k\theta_i=1\right}. }
]
So (\mathrm{aff}(C)) is the set of all finite affine combinations of points in (C).

### Theorem (minimality)

(\mathrm{aff}(C)) is the **smallest affine set** containing (C).

#### Proof (two parts)

1. **(\mathrm{aff}(C)) is affine.**
   An affine set (A) is one closed under affine combinations of its points. Take any (z_1,z_2\in\mathrm{aff}(C)) and (t\in\mathbb R). Write
   [
   z_1=\sum_i \theta_i x^{(i)},\quad \sum_i\theta_i=1,
   \qquad
   z_2=\sum_j \phi_j y^{(j)},\quad \sum_j\phi_j=1.
   ]
   Then
   [
   (1-t)z_1+t z_2
   =\sum_i (1-t)\theta_i x^{(i)}+\sum_j t\phi_j y^{(j)}.
   ]
   The coefficients are ((1-t)\theta_i) and (t\phi_j), and their sum is
   [
   \sum_i (1-t)\theta_i + \sum_j t\phi_j = (1-t)\cdot 1 + t\cdot 1 = 1.
   ]
   So ((1-t)z_1+t z_2) is an affine combination of points from (C), hence in (\mathrm{aff}(C)). So (\mathrm{aff}(C)) is affine.

2. **Minimality.**
   Let (A) be any affine set containing (C). Because (A) is closed under affine combinations and contains all points of (C), it contains every affine combination of points of (C). Thus (\mathrm{aff}(C)\subseteq A).
   Therefore (\mathrm{aff}(C)) is the smallest affine set containing (C). ∎

**Interpretation:** (\mathrm{aff}(C)) is the “flat” (line/plane/hyperplane) that (C) lives in.

---

## 2.2 Convex hull

### Definition

[
\boxed{\ \mathrm{conv}(C):=\left{\sum_{i=1}^k\theta_i x^{(i)}:\ x^{(i)}\in C,\ \theta_i\ge 0,\ \sum_{i=1}^k\theta_i=1\right}. }
]

### Theorem (minimality)

(\mathrm{conv}(C)) is the **smallest convex set** containing (C).

#### Proof

Same structure as affine hull proof:

1. **(\mathrm{conv}(C)) is convex.**
   Take (z_1,z_2\in\mathrm{conv}(C)) and (t\in[0,1]). Represent them with convex combination coefficients ({\theta_i},{\phi_j}). Then
   [
   (1-t)z_1+t z_2
   ]
   becomes a convex combination of the union of the points, with coefficients ((1-t)\theta_i\ge 0) and (t\phi_j\ge 0) summing to 1. So it lies in (\mathrm{conv}(C)).

2. **Minimality.**
   Any convex set containing (C) must contain all convex combinations of points in (C) (by closure under convex combinations), hence must contain (\mathrm{conv}(C)). ∎

**Interpretation:** (\mathrm{conv}(C)) is the set of all “averages” you can form from (C). It’s exactly “fill in all missing line segments, triangles, etc.”

---

## 2.3 Conic hull

### Definition

There are two equivalent common definitions:

1. as all conic combinations:
   [
   \boxed{\ \mathrm{cone}(C):=\left{\sum_{i=1}^k\alpha_i x^{(i)}:\ x^{(i)}\in C,\ \alpha_i\ge 0\right}. }
   ]

2. as all nonnegative scalings of points in the convex hull (when (0\in\mathrm{cone}(C)) anyway):
   [
   \mathrm{cone}(C)={\tau z:\ \tau\ge 0,\ z\in\mathrm{conv}(C)}
   ]
   (with the convention (\tau=0\Rightarrow \tau z=0)).

### Theorem (minimality)

(\mathrm{cone}(C)) is the **smallest convex cone** containing (C\cup{0}).

#### Proof sketch (still rigorous)

* Any conic combination is closed under nonnegative scaling and addition, so (\mathrm{cone}(C)) is a cone and convex.
* Any convex cone (K) containing (C) must contain all conic combinations (closure under nonnegative scaling and addition), so (\mathrm{cone}(C)\subseteq K). ∎

**Interpretation:** (\mathrm{cone}(C)) is what you get by “pointing rays” from the origin through (C) and taking all nonnegative mixtures of those rays.

---

# 3) Cones: definitions and examples

## 3.1 Cone and convex cone

A set (K\subseteq\mathbb R^n) is a **cone** if
[
x\in K,\ \alpha\ge 0\ \Rightarrow\ \alpha x\in K.
]
It is a **convex cone** if also
[
x,y\in K\ \Rightarrow\ x+y\in K,
]
which equivalently means it is convex and a cone.

**Immediate:** any convex cone contains (0) (take (\alpha=0)).

---

## 3.2 Key example: the nonnegative orthant

[
\boxed{\ \mathbb R_+^n := {x\in\mathbb R^n:\ x_i\ge 0\ \forall i}. }
]
This is the cone behind LP.

---

## 3.3 Key example: PSD cone (matrices)

Let (\mathbf S^n) be symmetric (n\times n) matrices. Define
[
\boxed{\ S_+^n := {X\in\mathbf S^n:\ X\succeq 0}. }
]
This is a convex cone in the vector space (\mathbf S^n).

Convexity is from: (X\succeq 0) and (Y\succeq 0\Rightarrow X+Y\succeq 0), and (\alpha X\succeq 0) for (\alpha\ge 0).

This is the cone behind SDP.

---

# 4) Dual cones: definition and first properties

## 4.1 Definition (vector cones)

Let (K\subseteq\mathbb R^n) be a cone (not necessarily convex/closed). Define its **dual cone**
[
\boxed{\ K^* := {y\in\mathbb R^n:\ y^\top x\ge 0\ \forall x\in K}. }
]

**Interpretation:**
(y\in K^*) means: “the linear functional (x\mapsto y^\top x) is nonnegative on (K).”
This is exactly the shape of dual feasibility and KKT multipliers later.

---

## 4.2 (K^*) is always a closed convex cone (full proof)

### Theorem

For any (K\subseteq\mathbb R^n),
[
\boxed{\ K^*\ \text{is a closed convex cone}. }
]

#### Proof

**Cone:** Let (y\in K^*) and (\alpha\ge 0). For any (x\in K),
[
(\alpha y)^\top x = \alpha(y^\top x)\ge 0,
]
so (\alpha y\in K^*).

**Convex:** Let (y_1,y_2\in K^*) and (t\in[0,1]). For any (x\in K),
[
((1-t)y_1+ty_2)^\top x=(1-t)y_1^\top x + t y_2^\top x \ge 0.
]
So ((1-t)y_1+ty_2\in K^*).

**Closed:** For each fixed (x\in K), the set
[
H_x := {y:\ y^\top x\ge 0}
]
is a closed halfspace (preimage of ([0,\infty)) under continuous map (y\mapsto y^\top x)).
Now
[
K^* = \bigcap_{x\in K} H_x
]
is an intersection of closed sets, hence closed. ∎

**Commentary:**
Even if (K) is a chaotic nonconvex set, (K^*) is automatically nice. Duality often replaces a messy primal object by a clean dual object.

---

## 4.3 Basic inclusion relationships

If (K_1\subseteq K_2), then
[
K_2^* \subseteq K_1^*.
]
**Reason:** the larger the primal cone, the stricter the “(\ge0) for all (x)” requirement, so fewer (y) qualify.

Also, always:
[
K\subseteq K^{**}
]
because if (x\in K) and (y\in K^*), then (y^\top x\ge 0), which is exactly the condition “(x\in K^{**}).”

The big theorem is when equality holds (requires closed convex cones).

---

# 5) Bipolar theorem for cones: (K^{**}=K) (when (K) is closed convex)

### Theorem (bipolar for cones)

If (K\subseteq\mathbb R^n) is a **closed convex cone**, then
[
\boxed{\ K^{**}=K. }
]

#### Proof idea (what we need)

We already have (K\subseteq K^{**}).
We must show: if (x\notin K), then (x\notin K^{**}).
Equivalently: if (x\notin K), there exists (y\in K^*) such that (y^\top x<0).
That is exactly a **separation theorem** statement: separate a point from a closed convex cone by a hyperplane through the origin.

A full proof uses the separating hyperplane theorem (Module 15). So for now, treat this as a “flagged dependency”:

* **We can’t fully prove (K^{**}=K) without separation.**
* We *will* prove separation in Module 15, and then this becomes immediate.

What you *should* understand now: (K^{**}) is the “best closed convex conic approximation” of (K). Once you enforce closure and convexity, dualizing twice brings you back.

---

# 6) Dual cone of (\mathbb R_+^n) is itself (full proof)

### Theorem

[
\boxed{\ (\mathbb R_+^n)^* = \mathbb R_+^n. }
]

#### Proof

Let (y\in(\mathbb R_+^n)^*). Then (y^\top x\ge 0) for all (x\ge 0).

Take (x=e_i) (the (i)-th standard basis vector), which lies in (\mathbb R_+^n). Then
[
y^\top e_i = y_i \ge 0.
]
So (y\in\mathbb R_+^n). Hence ((\mathbb R_+^n)^*\subseteq \mathbb R_+^n).

Conversely, if (y\in\mathbb R_+^n) and (x\in\mathbb R_+^n), then each term (y_i x_i\ge 0), so
[
y^\top x = \sum_i y_i x_i \ge 0.
]
Thus (y\in(\mathbb R_+^n)^*). So (\mathbb R_+^n\subseteq(\mathbb R_+^n)^*).

Therefore equality holds. ∎

**Interpretation:** In LP, the dual cone constraint “(s\in K^*)” becomes “(s\ge 0)” again. That’s why LP dual variables are nonnegative.

---

# 7) Dual cone for PSD cone: self-duality under trace inner product (full proof)

Now we switch from vectors to symmetric matrices. The ambient space is (\mathbf S^n), with inner product
[
\boxed{\ \langle X,Y\rangle := \mathrm{tr}(XY)\ } \quad (\text{since }X,Y\in\mathbf S^n\Rightarrow X^\top=X).
]
(Equivalent to Frobenius: (\mathrm{tr}(X^\top Y)).)

### Definition (dual cone in (\mathbf S^n))

For (K\subseteq\mathbf S^n),
[
K^* := {Y\in\mathbf S^n:\ \mathrm{tr}(YX)\ge 0\ \forall X\in K}.
]

### Theorem (PSD cone is self-dual)

[
\boxed{\ (S_+^n)^* = S_+^n. }
]

#### Proof (two inclusions)

### (1) Show (S_+^n \subseteq (S_+^n)^*)

Take (Y\succeq 0). We must show (\mathrm{tr}(YX)\ge 0) for all (X\succeq 0).

Because (X\succeq 0), there exists (B) such that (X=B^\top B) (e.g. Cholesky if (X\succ0), or spectral factorization in general). Then
[
\mathrm{tr}(YX)=\mathrm{tr}(YB^\top B)=\mathrm{tr}(BYB^\top)
]
(cyclic trace: (\mathrm{tr}(ABC)=\mathrm{tr}(BCA)) when dimensions match).

Now (BYB^\top\succeq 0) because for any (v),
[
v^\top(BYB^\top)v=(B^\top v)^\top Y (B^\top v)\ge 0.
]
A PSD matrix has nonnegative trace (trace is sum of eigenvalues (\ge0), or sum of diagonal entries of a PSD matrix is (\ge0)). Hence (\mathrm{tr}(BYB^\top)\ge 0). Therefore (\mathrm{tr}(YX)\ge0). So (Y\in(S_+^n)^*).
Thus (S_+^n\subseteq(S_+^n)^*).

### (2) Show ((S_+^n)^* \subseteq S_+^n)

Take (Y\in(S_+^n)^*). We must show (Y\succeq 0), i.e.
[
v^\top Y v \ge 0\quad\forall v\in\mathbb R^n.
]
Fix any (v). Consider (X:=vv^\top). This is PSD (rank-1 outer product):
[
w^\top X w = w^\top vv^\top w = (v^\top w)^2\ge 0.
]
Since (Y\in(S_+^n)^*), we have (\mathrm{tr}(Y X)\ge 0). But
[
\mathrm{tr}(Y vv^\top)=\mathrm{tr}(v^\top Y v)=v^\top Y v
]
more explicitly:
[
\mathrm{tr}(Yvv^\top)=\mathrm{tr}(v^\top Y v)=v^\top Y v
]
(using (\mathrm{tr}(ab^\top)=b^\top a) or cyclicity: (\mathrm{tr}(Yvv^\top)=\mathrm{tr}(v^\top Y v)=v^\top Y v)).

Therefore (v^\top Y v\ge 0) for all (v), hence (Y\succeq 0). So ((S_+^n)^*\subseteq S_+^n).

Combine both inclusions: ((S_+^n)^*=S_+^n). ∎

**Commentary:**
This is why SDP dual feasibility looks “the same” as primal feasibility: both are PSD constraints. This symmetry is not an accident—it is self-duality of the cone under the trace inner product.

---

# 8) Why dual cones are “certificates” (preview of Farkas/KKT)

If (y\in K^*), then (y^\top x\ge 0) for all (x\in K).
So if you ever find (x\in K) but (y^\top x<0), contradiction. Conversely, if you want to prove some (x) is **not** in (K), you try to find a (y\in K^*) with (y^\top x<0). That (y) is a **certificate**.

This becomes:

* Farkas lemma: certificates of infeasibility in LP,
* KKT multipliers: certificates of optimality,
* duality: “either primal feasible or there is a dual separator.”

We’ll formalize this with separation in Module 15.

---

# 9) End-of-Module 14 checklist (must be automatic)

You can:

1. Define (\mathrm{aff}(C)), (\mathrm{conv}(C)), (\mathrm{cone}(C)) and prove minimality.
2. Define cone and convex cone; give examples (\mathbb R_+^n), (S_+^n).
3. Define dual cone (K^*) and prove (K^*) is a closed convex cone.
4. Prove ((\mathbb R_+^n)^*=\mathbb R_+^n).
5. Prove ((S_+^n)^*=S_+^n) under trace inner product.
6. Explain in words why (y\in K^*) is a “nonnegativity certificate” on (K).
7. Know that (K^{**}=K) needs separation (next module).

---

## Next module

**Module 15 — Convex sets + separation + Farkas (geometry of duality).**
This is where “certificates” become theorems: either a point is inside a convex set, or there exists a hyperplane proving it’s not.

## Response:
Thought for 1m 18s

Module 14 — Hulls and cones: affine/convex/conic hulls + dual cones
===================================================================

_(how “take all mixtures” becomes the algebra of optimization and duality)_

0) What this module is secretly doing
-------------------------------------

Most of duality is: **take a set of “allowed directions”**, turn it into a **cone**, then study all linear functionals that are **nonnegative on that cone**. Those functionals form the **dual cone**. Then everything—LP multipliers, KKT, SDP dual constraints—starts looking like the same movie in different costumes.

You want these to become _automatic_:

*    $\mathrm{aff}(C)$ : smallest affine set containing  $C$  (translation + linear structure).
*    $\mathrm{conv}(C)$ : smallest convex set containing  $C$  (all averages).
*    $\mathrm{cone}(C)$ : smallest convex cone containing  $C\cup\{0\}$  (all nonnegative mixtures / rays).
*    $K^*$ : all vectors that have nonnegative inner product with everything in  $K$  (certificates).

Big structural facts (proved carefully below):

1.   $K^*$  is always a **closed convex cone** (even if  $K$  is nasty).
2.  If  $K$  is a **closed convex cone**, then  $K^{**}=K$ . (I’ll actually prove this now, self-contained, using projections.)
3.   $(\mathbb R_+^n)^*=\mathbb R_+^n$ .
4.   $(\mathbb S_+^n)^*=\mathbb S_+^n$  under the **trace inner product**  $\langle X,Y\rangle=\mathrm{tr}(XY)$ .

* * *

1) Combinations (because hulls are “closure under combinations”)
================================================================

Given points  $x^{(1)},\dots,x^{(k)}\in\mathbb R^n$ :

*   **Linear combination:**  $\sum_{i=1}^k \theta_i x^{(i)}$ ,  $\theta_i\in\mathbb R$ .
*   **Affine combination:**  $\sum_{i=1}^k \theta_i x^{(i)}$  with  $\sum_i\theta_i=1$ .
*   **Convex combination:**  $\sum_{i=1}^k \theta_i x^{(i)}$  with  $\theta_i\ge 0$  and  $\sum_i\theta_i=1$ .
*   **Conic combination:**  $\sum_{i=1}^k \alpha_i x^{(i)}$  with  $\alpha_i\ge 0$  (no sum-to-1 constraint).

Sanity picture:

*   convex = “probability weights”
*   conic = “nonnegative weights with arbitrary total mass” (so you get rays)

* * *

2) Hulls as “smallest set containing  $C$  closed under X”
==========================================================

A useful meta-definition (that keeps proofs clean):

> The “smallest set containing  $C$ ” with property  $\mathcal P$  is the **intersection of all sets** that contain  $C$  and have property  $\mathcal P$ .

That intersection is still  $\mathcal P$ \-closed (for affine/convex/cone properties), and it’s automatically minimal.

We’ll also use an equivalent constructive description via combinations.

* * *

2.1 Affine hull
---------------

### Definition (finite affine combinations)

$$
\boxed{ \operatorname{aff}(C) :=\left\{\sum_{i=1}^k \theta_i x^{(i)}:\ x^{(i)}\in C,\ \sum_{i=1}^k \theta_i=1\right\}. }
$$

### Equivalent form (translate + span)

Pick any  $x_0\in C$  (if  $C\neq\emptyset$ ). Then

$$
\boxed{ \operatorname{aff}(C)=x_0+\operatorname{span}(C-x_0), \quad C-x_0:=\{x-x_0:x\in C\}. }
$$

**Proof (quick but exact):**  
If  $z=\sum_i\theta_i x^{(i)}$  with  $\sum_i\theta_i=1$ , then

$$
z=x_0+\sum_i\theta_i(x^{(i)}-x_0),
$$

and  $\sum_i\theta_i(x^{(i)}-x_0)\in\operatorname{span}(C-x_0)$ . So  $z\in x_0+\operatorname{span}(C-x_0)$ .  
Conversely, any  $x_0+\sum_i \beta_i(x^{(i)}-x_0)$  can be rewritten as an affine combination by expanding and collecting coefficients to make them sum to 1. ∎

### Minimality theorem

 $$
\boxed{\ \operatorname{aff}(C)\ \text{is the smallest affine set containing }C.\ }
$$

**Proof (two parts):**

1.  ** $\operatorname{aff}(C)$  is affine.**  
    Take  $z_1,z_2\in\operatorname{aff}(C)$  and  $t\in\mathbb R$ . Write
    
$$
z_1=\sum_i\theta_i x^{(i)},\ \sum_i\theta_i=1, \qquad z_2=\sum_j\phi_j y^{(j)},\ \sum_j\phi_j=1.
$$

Then

$$
(1-t)z_1+t z_2 =\sum_i (1-t)\theta_i x^{(i)}+\sum_j t\phi_j y^{(j)},
$$

and the coefficients sum to

$$
\sum_i(1-t)\theta_i+\sum_j t\phi_j=(1-t)\cdot 1+t\cdot 1=1.
$$

So it’s an affine combination of points in  $C$ , hence lies in  $\operatorname{aff}(C)$ .

2.  **Minimality.**  
    Let  $A$  be any affine set with  $C\subseteq A$ . Since  $A$  is closed under affine combinations and contains  $C$ , it contains every affine combination of points of  $C$ . Therefore  $\operatorname{aff}(C)\subseteq A$ . ∎

**Interpretation:**  $\operatorname{aff}(C)$  is the unique “flat” (translated subspace) that  $C$  lives in.

* * *

2.2 Convex hull
---------------

### Definition (finite convex combinations)

$$
\boxed{ \operatorname{conv}(C) :=\left\{\sum_{i=1}^k \theta_i x^{(i)}:\ x^{(i)}\in C,\ \theta_i\ge 0,\ \sum_{i=1}^k \theta_i=1\right\}. }
$$

### Minimality theorem

 $$
\boxed{\ \operatorname{conv}(C)\ \text{is the smallest convex set containing }C.\ }
$$

**Proof (same skeleton, but with  $t\in[0,1]$ ):**

1.  **Convexity.**  
    Take  $z_1,z_2\in\operatorname{conv}(C)$  and  $t\in[0,1]$ . Write them as convex combos with nonnegative coefficients summing to 1. Then
    
$$
(1-t)z_1+t z_2
$$

is a convex combination of the union of the points, with coefficients  $(1-t)\theta_i\ge0$  and  $t\phi_j\ge0$  summing to 1. So it’s in  $\operatorname{conv}(C)$ .

2.  **Minimality.**  
    Any convex set containing  $C$  must contain all convex combinations of points of  $C$ , so it must contain  $\operatorname{conv}(C)$ . ∎

**Interpretation:** “fill in all missing line segments / triangles / simplices” spanned by  $C$ .

* * *

2.3 Conic hull
--------------

### Definition (conic combinations)

$$
\boxed{ \operatorname{cone}(C) :=\left\{\sum_{i=1}^k \alpha_i x^{(i)}:\ x^{(i)}\in C,\ \alpha_i\ge 0\right\}. }
$$

### Equivalent definition (scaling convex hull)

$$
\boxed{ \operatorname{cone}(C)=\{\tau z:\ \tau\ge 0,\ z\in\operatorname{conv}(C)\}. }
$$

**Proof (both directions, including the  $\tau=0$  edge case):**

*   ( $\subseteq$ ) Take  $w=\sum_i \alpha_i x^{(i)}$  with  $\alpha_i\ge0$ . Let  $\tau:=\sum_i\alpha_i$ .
    *   If  $\tau=0$ , then all  $\alpha_i=0$  and  $w=0=\tau z$  for any  $z$ .
    *   If  $\tau>0$ , define  $\theta_i:=\alpha_i/\tau$ . Then  $\theta_i\ge0$  and  $\sum_i\theta_i=1$ , so  $z:=\sum_i\theta_i x^{(i)}\in\operatorname{conv}(C)$ . And  $w=\tau z$ .
*   ( $\supseteq$ ) Take  $\tau z$  with  $\tau\ge0$  and  $z=\sum_i\theta_i x^{(i)}$  a convex combination. Then
    
$$
\tau z=\sum_i (\tau\theta_i) x^{(i)},
$$

a conic combination since  $\tau\theta_i\ge0$ . ∎

### Minimality theorem

 $$
\boxed{\ \operatorname{cone}(C)\ \text{is the smallest convex cone containing }C\cup\{0\}. }
$$

**Proof (rigorous, short):**

*    $\operatorname{cone}(C)$  is a **cone**: scaling nonnegative coefficients keeps them nonnegative.
*   It is **convex**: if  $u=\sum_i\alpha_i x_i$ ,  $v=\sum_j\beta_j y_j$ , then for  $t\in[0,1]$ ,
    
$$
(1-t)u+t v=\sum_i((1-t)\alpha_i)x_i+\sum_j(t\beta_j)y_j
$$

is again a conic combination.

*   If  $K$  is any convex cone containing  $C$ , then by closure under nonnegative scaling and addition,  $K$  contains every conic combination of points in  $C$ . Hence  $\operatorname{cone}(C)\subseteq K$ . ∎

**Interpretation:** shoot rays from the origin through  $C$ , then take all nonnegative mixtures of those rays.

* * *

3) Cones: definitions and key examples
======================================

3.1 Cone vs convex cone
-----------------------

A set  $K\subseteq\mathbb R^n$  is a **cone** if

$$
x\in K,\ \alpha\ge0\ \Rightarrow\ \alpha x\in K.
$$

It is a **convex cone** if additionally

$$
x,y\in K\Rightarrow x+y\in K.
$$

Equivalent characterization (often the cleanest):

$$
\boxed{ K\ \text{is a convex cone} \iff \forall x_i\in K,\ \forall \alpha_i\ge0,\ \sum_i\alpha_i x_i\in K. }
$$

Immediate: every cone contains  $0$  (take  $\alpha=0$ ).

* * *

3.2 The nonnegative orthant (LP cone)
-------------------------------------

$$
\boxed{ \mathbb R_+^n := \{x\in\mathbb R^n: x_i\ge0\ \forall i\}. }
$$

* * *

3.3 The PSD cone (SDP cone)
---------------------------

Let  $\mathbb S^n$  be symmetric  $n\times n$  matrices. Define

$$
\boxed{ \mathbb S_+^n := \{X\in\mathbb S^n:\ X\succeq 0\}. }
$$

It’s a convex cone because:

*    $X\succeq0$ ,  $Y\succeq0 \Rightarrow X+Y\succeq0$ ,
*    $\alpha\ge0\Rightarrow \alpha X\succeq0$ .

* * *

4) Dual cones (and why they’re automatically nice)
==================================================

4.1 Definition (depends on inner product)
-----------------------------------------

In  $\mathbb R^n$  with the standard dot product  $\langle y,x\rangle=y^\top x$ ,

$$
\boxed{ K^* := \{y\in\mathbb R^n:\ y^\top x\ge0\ \forall x\in K\}. }
$$

**Interpretation:**  $y\in K^*$  means the linear functional  $x\mapsto y^\top x$  is nonnegative on  $K$ . That is exactly “dual feasibility” later.

(For matrices we’ll change inner product to trace; the _definition is the same_, only  $\langle\cdot,\cdot\rangle$  changes.)

* * *

4.2 Theorem:  $K^*$  is always a closed convex cone
---------------------------------------------------

For any  $K\subseteq\mathbb R^n$ ,

 $$
\boxed{\ K^*\ \text{is a closed convex cone}. }
$$

**Proof:**

*   **Cone:** if  $y\in K^*$ ,  $\alpha\ge0$ , then  $(\alpha y)^\top x=\alpha(y^\top x)\ge0$  for all  $x\in K$ .
*   **Convex:** if  $y_1,y_2\in K^*$  and  $t\in[0,1]$ , then
    
$$
((1-t)y_1+t y_2)^\top x=(1-t)y_1^\top x+t y_2^\top x\ge0
$$

for all  $x\in K$ .

*   **Closed:** for each fixed  $x\in K$ , the set  $H_x=\{y: y^\top x\ge0\}$  is a closed halfspace. And
    
$$
K^*=\bigcap_{x\in K} H_x
$$

is an intersection of closed sets, hence closed. ∎

**Punchline:** dualizing “regularizes”: even if  $K$  is wild,  $K^*$  is clean.

* * *

4.3 Monotonicity and the always-true inclusion
----------------------------------------------

If  $K_1\subseteq K_2$ , then

$$
\boxed{K_2^*\subseteq K_1^*.}
$$

(Bigger primal set → stricter requirement → smaller dual.)

Also always:

$$
\boxed{K\subseteq K^{**}.}
$$

Because if  $x\in K$  and  $y\in K^*$ , then by definition  $y^\top x\ge0$ , which is exactly the condition “ $x\in K^{**}$ ”.

The nontrivial part is: **when do we get equality?**

* * *

5) Bipolar theorem for cones: if  $K$  is closed convex cone, then  $K^{**}=K$ 
===============================================================================

You flagged “needs separation theorem.” True in spirit. But we can prove it _right now_ in finite-dimensional Euclidean space using the **projection onto a closed convex set** (which is basically separation in disguise, but fully constructive).

5.1 Projection lemma (the workhorse)
------------------------------------

Let  $C\subseteq\mathbb R^n$  be **nonempty, closed, convex**. For any  $x\in\mathbb R^n$ , there exists a **unique**

$$
z=\Pi_C(x)\in C
$$

minimizing distance:

$$
\|x-z\|_2=\min_{y\in C}\|x-y\|_2.
$$

Moreover, this minimizer satisfies the “first-order optimality inequality”:

$$
\boxed{(x-z)^\top (y-z)\le 0\quad\forall y\in C.}
$$

**Proof (existence, uniqueness, inequality):**

*   _Existence:_ minimize  $\varphi(y)=\|x-y\|_2^2$  over  $y\in C$ .  
     $\varphi$  is continuous and **coercive**:  $\|y\|\to\infty\Rightarrow \varphi(y)\to\infty$ .  
    So the minimizer lies in some large closed ball, and  $C\cap$  that ball is compact; by Weierstrass, a minimizer exists.
*   _Uniqueness:_  $\varphi$  is **strictly convex** in  $y$  (quadratic with positive definite Hessian  $2I$ ). Minimizing a strictly convex function over a convex set yields a unique minimizer.
*   _Optimality inequality:_ for any  $y\in C$  and any  $t\in[0,1]$ , the point
    
$$
y_t=(1-t)z+t y\in C
$$

(by convexity). Since  $z$  minimizes  $\varphi$ ,

$$
\varphi(z)\le \varphi(y_t).
$$

Compute the difference (pure algebra, no calculus):

$$
\|x-y_t\|^2=\|x-(z+t(y-z))\|^2 =\|x-z\|^2 -2t(x-z)^\top(y-z)+t^2\|y-z\|^2.
$$

Thus  $\|x-z\|^2\le \|x-y_t\|^2$  implies

$$
0\le -2t(x-z)^\top(y-z)+t^2\|y-z\|^2.
$$

Divide by  $t>0$  and let  $t\downarrow 0$ :

$$
0\le -2(x-z)^\top(y-z),
$$

i.e.  $(x-z)^\top(y-z)\le0$ . ∎

Keep this lemma; it’s a Swiss army knife.

* * *

5.2 Now prove  $K^{**}=K$  for closed convex cones
--------------------------------------------------

### Theorem

If  $K\subseteq\mathbb R^n$  is a **closed convex cone**, then

$$
\boxed{K^{**}=K.}
$$

**Proof:**

We already have  $K\subseteq K^{**}$ .  
It remains to show  $K^{**}\subseteq K$ .

Take any  $x\notin K$ . Let  $z=\Pi_K(x)$  be the projection of  $x$  onto  $K$ . Since  $x\notin K$ , we have  $z\neq x$ , so  $\|x-z\|>0$ .

From the projection inequality (with  $C=K$ ):

$$
(x-z)^\top (y-z)\le 0\quad\forall y\in K.
$$

Rearrange:

$$
(x-z)^\top y \le (x-z)^\top z\quad\forall y\in K.
$$

Now use the fact that  $K$  is a **cone**: if  $y\in K$ , then  $t y\in K$  for all  $t\ge0$ . Plug  $ty$  into the inequality:

$$
(x-z)^\top (t y) \le (x-z)^\top z\quad\forall t\ge0.
$$

If  $(x-z)^\top y>0$  for some  $y\in K$ , the left-hand side would go to  $+\infty$  as  $t\to\infty$ , impossible. Therefore

$$
(x-z)^\top y \le 0\quad\forall y\in K.
$$

That means

$$
-(x-z)\in K^*.
$$

Now evaluate this dual vector on  $x$ :

$$
(-(x-z))^\top x =-(x-z)^\top x =-(x-z)^\top(z+(x-z)) =-(x-z)^\top z-\|x-z\|^2.
$$

We also get  $(x-z)^\top z\ge0$  by taking  $y=0\in K$  in  $(x-z)^\top(y-z)\le0$ , which gives  $-(x-z)^\top z\le0$ . So:

$$
(-(x-z))^\top x \le 0-\|x-z\|^2 < 0.
$$

So we found a  $y:=-(x-z)\in K^*$  such that  $y^\top x<0$ .  
But if  $x\in K^{**}$ , we would need  $y^\top x\ge0$  for **all**  $y\in K^*$ . Contradiction.

Hence  $x\notin K^{**}$ . So every  $x\notin K$  lies outside  $K^{**}$ , i.e.  $K^{**}\subseteq K$ . ∎

**Interpretation:** for closed convex cones, the dual cone captures exactly the cone—no information loss after dualizing twice.

* * *

6) Dual cone of  $\mathbb R_+^n$  is itself
===========================================

$$
\boxed{(\mathbb R_+^n)^*=\mathbb R_+^n.}
$$

**Proof:**

*   If  $y\in(\mathbb R_+^n)^*$ , then  $y^\top x\ge0$  for all  $x\ge0$ . In particular for  $x=e_i$ , we get  $y_i\ge0$ . So  $y\in\mathbb R_+^n$ .
*   If  $y\in\mathbb R_+^n$  and  $x\in\mathbb R_+^n$ , then  $y^\top x=\sum_i y_i x_i\ge0$ . So  $y\in(\mathbb R_+^n)^*$ . ∎

* * *

7) PSD cone is self-dual (trace inner product)
==============================================

Now work in the vector space  $\mathbb S^n$  with inner product

$$
\boxed{\langle X,Y\rangle := \mathrm{tr}(XY).}
$$

(For symmetric matrices this equals the Frobenius inner product  $\sum_{ij}X_{ij}Y_{ij}$ .)

Define dual cone:

$$
(\mathbb S_+^n)^*:=\{Y\in\mathbb S^n:\ \mathrm{tr}(YX)\ge0\ \forall X\succeq0\}.
$$

### Theorem

$$
\boxed{(\mathbb S_+^n)^*=\mathbb S_+^n.}
$$

**Proof (two inclusions):**

**(i)  $\mathbb S_+^n\subseteq(\mathbb S_+^n)^*$ .**  
Take  $Y\succeq0$ . Need  $\mathrm{tr}(YX)\ge0$  for all  $X\succeq0$ .  
Factor  $X=B^\top B$  (exists since  $X\succeq0$ ). Then

$$
\mathrm{tr}(YX)=\mathrm{tr}(YB^\top B)=\mathrm{tr}(BYB^\top).
$$

Now  $BYB^\top\succeq0$  (quadratic form check), and any PSD matrix has nonnegative trace because its diagonal entries are nonnegative:

$$
(BYB^\top)_{ii}=e_i^\top(BYB^\top)e_i=(B^\top e_i)^\top Y (B^\top e_i)\ge0,
$$

so  $\mathrm{tr}(BYB^\top)=\sum_i(BYB^\top)_{ii}\ge0$ . Hence  $\mathrm{tr}(YX)\ge0$ .

**(ii)  $(\mathbb S_+^n)^*\subseteq\mathbb S_+^n$ .**  
Take  $Y\in(\mathbb S_+^n)^*$ . We must show  $Y\succeq0$ , i.e.  $v^\top Y v\ge0$  for all  $v$ .  
Let  $X:=vv^\top\succeq0$ . Then

$$
0\le \mathrm{tr}(Yvv^\top)=\mathrm{tr}(vv^\top Y)=v^\top Y v.
$$

So  $v^\top Y v\ge0$  for all  $v$ , hence  $Y\succeq0$ . ∎

**Meaning:** SDP dual feasibility uses the same PSD cone as primal feasibility because the cone is self-dual.

* * *

8) Dual cones as certificates (the intuition you’ll use in KKT/Farkas)
======================================================================

If  $y\in K^*$ , then  $y^\top x\ge0$  for every  $x\in K$ .  
So if you ever exhibit some  $y\in K^*$  with  $y^\top x<0$ , you have a **certificate that  $x\notin K$ **.

That is the geometry behind:

*   Farkas certificates (LP infeasibility),
*   KKT multipliers (optimality certificates),
*   “dual feasible + complementary slackness = proof”.

* * *

9) End-of-Module 14 checklist (no mercy)
========================================

You should be able to do, fast and clean:

1.  Define  $\operatorname{aff}(C)$ ,  $\operatorname{conv}(C)$ ,  $\operatorname{cone}(C)$  and prove minimality.
2.  Prove  $\operatorname{cone}(C)=\{\tau z:\tau\ge0,\ z\in\operatorname{conv}(C)\}$ .
3.  Define dual cone  $K^*$  (and remember it depends on the chosen inner product).
4.  Prove  $K^*$  is always a closed convex cone.
5.  Prove the bipolar theorem for closed convex cones:  $K^{**}=K$  (projection proof above).
6.  Prove  $(\mathbb R_+^n)^*=\mathbb R_+^n$ .
7.  Prove  $(\mathbb S_+^n)^*=\mathbb S_+^n$  under  $\langle X,Y\rangle=\mathrm{tr}(XY)$ .
8.  Explain “ $y\in K^*$ ” as a nonnegativity certificate in one sentence.

* * *

Next module
-----------

**Module 15 — Separation + Farkas + the geometry of duality.**  
You’ve already seen separation hiding inside the projection proof. Module 15 generalizes that trick into full-strength theorems you’ll use constantly.

## Prompt:
Now this:

# Module 15 — Convex sets, separation, and Farkas

*(why “dual variables are certificates” is not poetry but geometry)*

## 0) What this module is secretly doing

Everything in duality boils down to one primitive move:

> If a point is **not** in a closed convex set, you can prove it by exhibiting a **hyperplane** that separates them.

That hyperplane is the ancestor of:

* LP infeasibility certificates (Farkas),
* KKT multipliers,
* dual feasible solutions certifying bounds,
* complementary slackness as “tight contact” with a supporting hyperplane.

So we’re going to build, from bedrock, three pillars:

1. **Projection theorem** onto closed convex sets (existence + uniqueness + optimality condition).
2. **Separation theorem** (point vs closed convex set).
3. **Farkas’ lemma** as separation applied to **polyhedral cones** (LP feasibility certificates).

I’ll be domain-honest and assumption-honest at every step.

---

# 1) Geometry primitives: hyperplanes, halfspaces, supporting vs separating

## 1.1 Hyperplane and halfspaces

Fix a nonzero vector (a\in\mathbb R^n) and a scalar (\beta\in\mathbb R).

* The **hyperplane**
  [
  H(a,\beta):={x\in\mathbb R^n:\ a^\top x=\beta}.
  ]
* The associated **closed halfspaces**
  [
  H^-(a,\beta):={x:\ a^\top x\le \beta},\qquad
  H^+(a,\beta):={x:\ a^\top x\ge \beta}.
  ]

**Interpretation:** (a) is the normal direction; (a^\top x) is the “height” of (x) in direction (a).

---

## 1.2 Separating vs supporting

Let (C\subseteq\mathbb R^n) be a set.

* A hyperplane **separates** a point (x_0) from (C) if
  [
  a^\top x_0 < \beta \le a^\top x\quad\forall x\in C
  ]
  (strict on the point side), or the reversed inequality.

* A hyperplane **supports** (C) at a boundary point (x^\star\in C) if
  [
  a^\top x \ge a^\top x^\star\quad\forall x\in C
  ]
  (so (C) lies entirely in one halfspace and touches the plane at (x^\star)).

Supporting hyperplanes are “tangent planes” for sets. Separating hyperplanes are “certificates of exclusion.”

---

# 2) Projection onto a closed convex set (the workhorse)

This is the cleanest route to separation in finite-dimensional Euclidean space.

## 2.1 Setup

Let (C\subseteq\mathbb R^n) be **nonempty, closed, convex**.
Fix any point (x_0\in\mathbb R^n).

Define the **projection problem**
[
\boxed{\ \min_{x\in C} \ |x-x_0|_2^2. \ }
]
Call a minimizer (p) (if it exists). We’ll prove:

* existence,
* uniqueness,
* an optimality inequality that becomes a separating hyperplane.

---

## 2.2 Existence of a minimizer (closedness + coercivity)

Define (f(x)=|x-x_0|_2^2). This function is continuous and (f(x)\to\infty) as (|x|\to\infty) (“coercive”).

Let
[
m:=\inf_{x\in C} f(x).
]
Choose a minimizing sequence (x_k\in C) with (f(x_k)\downarrow m).

### Claim: ({x_k}) is bounded.

If it were unbounded, (|x_k|\to\infty) along a subsequence, hence (f(x_k)\to\infty), contradicting (f(x_k)\downarrow m<\infty). So bounded.

In (\mathbb R^n), every bounded sequence has a convergent subsequence (Bolzano–Weierstrass). So there exists a subsequence (x_{k_j}\to p).

Since (C) is **closed** and (x_{k_j}\in C), the limit (p\in C).

By continuity of (f),
[
f(p)=\lim_{j\to\infty} f(x_{k_j}) = m.
]
So (p) attains the infimum. ∎

**Why closed matters:** if (C) is not closed, the minimizing sequence can converge to a point outside (C) and the infimum is not attained.

---

## 2.3 Uniqueness (strict convexity)

### Claim: the minimizer is unique.

Suppose (p_1\neq p_2) are both minimizers. Consider their midpoint (p=\tfrac12(p_1+p_2)). By convexity, (p\in C).

Now use strict convexity of the squared norm:
[
|p-x_0|_2^2 = \left|\tfrac12(p_1-x_0)+\tfrac12(p_2-x_0)\right|_2^2
< \tfrac12|p_1-x_0|_2^2 + \tfrac12|p_2-x_0|_2^2
]
whenever (p_1\neq p_2). (This is a standard strict convexity fact; it can be proved by expanding norms and using that (|u+v|^2=|u|^2+|v|^2+2u^\top v) and that (u^\top v<|u||v|) when (u) and (v) aren’t collinear.)

But (|p_1-x_0|^2=|p_2-x_0|^2=m), so RHS equals (m), giving (|p-x_0|^2<m), contradicting minimality. ∎

So we can define the **projection map**
[
\boxed{\ \Pi_C(x_0):=\arg\min_{x\in C}|x-x_0|_2^2, }
]
well-defined for nonempty closed convex (C).

---

## 2.4 First-order optimality condition for projection (the key inequality)

Let (p=\Pi_C(x_0)). We derive:
[
\boxed{\ (x_0-p)^\top(x-p)\le 0\quad\forall x\in C. }
]
This is the algebraic form of “the residual is a normal vector.”

### Proof (one-dimensional perturbation)

Fix any (x\in C). Consider the segment inside (C):
[
z(t):=p+t(x-p),\quad t\in[0,1].
]
Convexity of (C) ensures (z(t)\in C).

Define the scalar function
[
\phi(t):=|x_0-z(t)|_2^2.
]
Since (p=z(0)) is the minimizer over all points in (C), in particular (t=0) minimizes (\phi(t)) over (t\in[0,1]). Hence the right derivative at 0 must be (\ge 0):
[
\phi'(0^+)\ge 0.
]

Now compute (\phi'(t)). Expand:
[
x_0-z(t)=x_0-p-t(x-p).
]
So
[
\phi(t)=|x_0-p-t(x-p)|^2
= (x_0-p-t(x-p))^\top(x_0-p-t(x-p)).
]
Differentiate w.r.t. (t):
[
\phi'(t) = -2(x-p)^\top(x_0-p-t(x-p)).
]
Thus
[
\phi'(0)= -2(x-p)^\top(x_0-p).
]
Condition (\phi'(0^+)\ge 0) gives
[
-2(x-p)^\top(x_0-p)\ge 0
\quad\Longleftrightarrow\quad
(x_0-p)^\top(x-p)\le 0.
]
Since (x\in C) was arbitrary, the inequality holds for all (x\in C). ∎

**Geometric meaning:**
(x_0-p) is orthogonal (in an inequality sense) to every feasible direction (x-p) inside the set. This is exactly the normal cone condition you’ll meet in Module 17.

---

# 3) Separation theorem (point vs closed convex set) via projection

Now separation becomes almost trivial.

## Theorem (strict separation of a point from a nonempty closed convex set)

Let (C\subseteq\mathbb R^n) be nonempty, closed, convex. Let (x_0\notin C).
Let (p=\Pi_C(x_0)). Define
[
a:=x_0-p \neq 0,\qquad \beta:=a^\top p.
]
Then
[
\boxed{\ a^\top x \le a^\top p < a^\top x_0\quad\forall x\in C. }
]
Equivalently, the hyperplane (H(a,\beta)) strictly separates (x_0) from (C).

### Proof

From the projection optimality inequality:
[
(x_0-p)^\top(x-p)\le 0\quad\forall x\in C.
]
Substitute (a=x_0-p):
[
a^\top x - a^\top p \le 0
\quad\Longleftrightarrow\quad
a^\top x \le a^\top p
\quad\forall x\in C.
]
So (C\subseteq H^-(a,a^\top p)).

Now check strictness for (x_0):
[
a^\top x_0 = a^\top(p+a)=a^\top p + a^\top a = a^\top p + |a|_2^2 > a^\top p,
]
since (a\neq 0) (because (x_0\notin C\Rightarrow p\neq x_0)). ∎

**Commentary:**
This is the cleanest “certificate machine”: to separate (x_0) from (C), find the nearest point (p) in (C). The separating normal vector is the residual (x_0-p).

---

# 4) Supporting hyperplanes as a corollary (tangent planes for sets)

A classic supporting hyperplane theorem drops out of separation by taking (x_0) approaching a boundary point from outside.

### Statement (informal but correct in finite dimensions)

If (C) is closed convex and (x^\star\in\partial C) (boundary), then there exists (a\neq 0) such that
[
a^\top x \le a^\top x^\star\quad\forall x\in C.
]
So (H(a,a^\top x^\star)) supports (C) at (x^\star).

**Why this is true:** pick a sequence (x_k\notin C) with (x_k\to x^\star), separate each (x_k) from (C) by normals (a_k=x_k-\Pi_C(x_k)), then extract a limit direction (a) (compactness on the unit sphere). The limit hyperplane supports at (x^\star).

We don’t need the full technical proof here; the point is: closed + convex gives you supporting hyperplanes everywhere on the boundary.

---

# 5) Separation between two convex sets (what assumptions you need)

Separation comes in strengths. The key is whether the sets can have distance zero without touching.

* If (C) and (D) are disjoint convex sets, you can often get **weak separation**:
  [
  a^\top x \le \beta \le a^\top y\quad \forall x\in C,\ \forall y\in D.
  ]
* To get **strict separation** (a positive gap), you need something like:

  * one set is compact and the other closed, or
  * the distance between them is positive, (\mathrm{dist}(C,D)>0).

This matters later because strong duality often needs a “strict feasibility” condition (Slater), which geometrically prevents the “distance zero but no intersection” pathology.

---

# 6) Farkas’ lemma (LP feasibility certificates) as separation of cones

This is the money theorem for LP feasibility.

## 6.1 Build the geometric object: a polyhedral cone

Let (A\in\mathbb R^{m\times n}) with columns (a_1,\dots,a_n). Define the cone generated by columns:
[
K := \mathrm{cone}(a_1,\dots,a_n)
= {Ax:\ x\ge 0}.
]
This is a convex cone (conic combinations). It is also **closed** because it’s polyhedral (finite generators). (If you want the proof: polyhedral cones are intersections of finitely many closed halfspaces; hence closed. Or equivalently, (K={Ax: x\ge0}) is the linear image of the closed set (\mathbb R_+^n); images of closed sets under linear maps aren’t always closed in general, but polyhedrality here guarantees closedness. In LP theory this is standard.)

We want to decide whether a given (b\in\mathbb R^m) lies in (K).

That is exactly: does there exist (x\ge 0) such that (Ax=b)?

If not, separation should provide a certificate.

---

## 6.2 Farkas (equality form)

### Theorem (Farkas’ lemma — equality form)

Exactly one of the following holds:

1. (**Primal feasibility**) There exists (x\in\mathbb R^n) such that
   [
   Ax=b,\qquad x\ge 0.
   ]
2. (**Certificate**) There exists (y\in\mathbb R^m) such that
   [
   A^\top y\ge 0,\qquad b^\top y<0.
   ]

They cannot both be true.

### Proof (step-by-step)

#### Step A: show they cannot both hold

Assume (1) and (2). Then
[
b^\top y = (Ax)^\top y = x^\top (A^\top y).
]
If (x\ge 0) and (A^\top y\ge 0), then (x^\top(A^\top y)\ge 0). Hence (b^\top y\ge 0), contradicting (b^\top y<0).
So (1) and (2) cannot both be true.

#### Step B: show if (1) fails, then (2) holds (separation)

If (1) fails, then (b\notin K={Ax:x\ge0}).

Now use separation for cones: since (K) is a closed convex set containing (0), and (b\notin K), there exists a separating hyperplane with normal (y\neq 0) such that
[
y^\top x \ge 0\ \forall x\in K,\qquad y^\top b < 0.
]
(You can get the “(\ge 0) on (K)” form because (K) is a cone: if a separating functional were positive somewhere on (K) but negative elsewhere, scaling would break separation. The clean way: separate (b) from (K) and note that (0\in K) forces the offset (\beta) to be (\ge 0); then rescale so the hyperplane passes through the origin. In polyhedral cones, the standard separation statement gives exactly this.)

The condition “(y^\top x\ge 0\ \forall x\in K)” means (y\in K^*) (Module 14 dual cone definition). But (K={Ax:x\ge0}), so:
[
y\in K^* \iff y^\top(Ax)\ge 0\ \forall x\ge 0.
]
Now (y^\top A x = (A^\top y)^\top x). The inequality
[
(A^\top y)^\top x \ge 0\quad\forall x\ge 0
]
holds **iff** (A^\top y\ge 0) componentwise (because testing (x=e_i) gives ((A^\top y)_i\ge 0)).

We already have (y^\top b<0), i.e. (b^\top y<0). Hence (2) holds.

So if (1) fails, (2) must hold. Combined with Step A, exactly one holds. ∎

**Interpretation:**
Either (b) is a nonnegative combination of columns of (A), or there is a vector (y) that has nonnegative dot product with every column-combination (Ax) (i.e. (A^\top y\ge 0)), yet has negative dot product with (b). That (y) is a **witness** that (b) lies outside the cone.

---

## 6.3 Farkas (inequality form)

A very common alternate form:

### Theorem (Farkas — inequality form)

Exactly one holds:

1. (\exists x\in\mathbb R^n) such that
   [
   Ax\le b.
   ]
2. (\exists y\in\mathbb R^m) such that
   [
   y\ge 0,\qquad y^\top A=0^\top,\qquad y^\top b<0.
   ]

**Meaning:** either the system (Ax\le b) is feasible, or there is a nonnegative multiplier (y) that annihilates (A) but makes (y^\top b<0), impossible if feasibility held.

(Proof is also separation, applied to the convex set ({Ax: x\in\mathbb R^n}+ \mathbb R_+^m) vs (b). We can do that proof explicitly when we reformulate LPs in conic form later; the equality form above is the cleanest core.)

---

# 7) How this becomes “duality = certificates” (conceptual bridge)

Look at the LP feasibility region:
[
{x:\ Ax=b,\ x\ge 0}.
]
Farkas says: if it’s empty, you can *prove* it’s empty by exhibiting (y) with
[
A^\top y\ge 0,\quad b^\top y<0.
]
That (y) is exactly the kind of object that will later be called a **dual variable**.

So:

* primal infeasible ⇒ there exists a dual certificate,
* primal feasible ⇒ no such certificate exists.

That “either/or” structure is the backbone of LP duality and, more generally, conic duality.

---

# 8) Micro-examples (so this isn’t abstract fog)

## Example 1: cone membership in (\mathbb R^2)

Let
[
a_1=\begin{bmatrix}1\0\end{bmatrix},\quad
a_2=\begin{bmatrix}0\1\end{bmatrix}.
]
Then (K=\mathrm{cone}(a_1,a_2)=\mathbb R_+^2).

Take (b=\begin{bmatrix}-1\1\end{bmatrix}). Clearly (b\notin \mathbb R_+^2). Farkas certificate: choose
[
y=\begin{bmatrix}1\0\end{bmatrix}.
]
Then (A=[a_1\ a_2]=I), so (A^\top y=y\ge 0). And
[
b^\top y = -1<0.
]
Certificate found: infeasible to represent (b) as (Ax) with (x\ge 0).

## Example 2: separation via projection

Let (C) be the closed Euclidean ball ({x:|x|\le 1}). Take (x_0) with (|x_0|>1). Then the projection is
[
p=\frac{x_0}{|x_0|}.
]
Normal vector (a=x_0-p) points radially outward, and the separating hyperplane is tangent to the ball at (p). This is exactly “tangent plane to a sphere.”

---

# 9) End-of-Module 15 checklist (you’re not done unless these are automatic)

You can:

1. Prove projection onto a nonempty closed convex set exists and is unique.
2. Derive the projection optimality inequality ((x_0-p)^\top(x-p)\le 0).
3. Turn that inequality into a strict separating hyperplane for (x_0\notin C).
4. State clearly what assumptions are needed (closed + convex; strict separation needs the point outside).
5. Prove Farkas (equality form) and interpret the certificate (y) geometrically as separation of (b) from the cone ({Ax:x\ge 0}).
6. Explain why this is the prototype of duality certificates.

---

## Next module

**Module 16 — Convex/concave functions via epigraphs + convex envelopes.**
We’ll unify inequalities, geometry of epigraphs, and the “tightest convex underestimator” construction (your BV Exercise 3.30 world).

## Response:
Thought for 1m 5s

Module 15 — Convex sets, separation, and Farkas
===============================================

_(why “dual variables are certificates” is not poetry but geometry)_

0) What this module is secretly doing
-------------------------------------

There is one move that powers an absurd fraction of optimization theory:

> If a point is **not** in a nice convex set, you can _prove it_ by producing a **hyperplane** that all feasible points lie on one side of, while the point lies strictly on the other.

That hyperplane’s normal vector becomes, later:

*   an LP infeasibility certificate (Farkas),
*   a KKT multiplier,
*   a dual feasible point certifying a lower bound,
*   complementary slackness as “the hyperplane touches the feasible region”.

We’ll build three pillars, with all assumptions explicit:

1.  **Projection theorem** onto a nonempty closed convex set (existence + uniqueness + variational inequality).
2.  **Strict separation** (point vs nonempty closed convex set) derived directly from projection.
3.  **Farkas’ lemma** as separation applied to the cone  $K=\{Ax:x\ge 0\}$ .

Everything here is Euclidean: inner product  $u^\top v$ , norm  $\|u\|_2=\sqrt{u^\top u}$ .

* * *

1) Geometry primitives: hyperplanes, halfspaces, supporting vs separating
=========================================================================

1.1 Hyperplane and halfspaces
-----------------------------

Fix  $a\in\mathbb R^n\setminus\{0\}$  and  $\beta\in\mathbb R$ .

*   Hyperplane:
    
$$
H(a,\beta):=\{x\in\mathbb R^n:\ a^\top x=\beta\}.
$$
*   Closed halfspaces:
    
$$
H^-(a,\beta):=\{x:\ a^\top x\le \beta\},\qquad H^+(a,\beta):=\{x:\ a^\top x\ge \beta\}.
$$

Interpretation:  $a$  is the normal direction;  $a^\top x$  is “height” along  $a$ .

* * *

1.2 Separating vs supporting
----------------------------

Let  $C\subseteq\mathbb R^n$ .

*   A hyperplane **strictly separates**  $x_0$  from  $C$  if for some  $a\neq 0,\beta$ ,
    
$$
a^\top x \le \beta < a^\top x_0\quad\forall x\in C
$$

(or the reversed inequality; it’s the same story with  $-a$ ).

*   A hyperplane **supports**  $C$  at  $x^\star\in C$  if
    
$$
a^\top x \le a^\top x^\star\quad\forall x\in C,
$$

so  $C$  lies in one halfspace and “touches” the plane at  $x^\star$ .

Separation = “certificate of exclusion”.  
Support = “tangent plane for sets”.

* * *

2) Projection onto a nonempty closed convex set (the workhorse)
===============================================================

Let  $C\subseteq\mathbb R^n$  be **nonempty, closed, convex**. Fix  $x_0\in\mathbb R^n$ .

Consider:

 $$
\boxed{\ \min_{x\in C}\ \|x-x_0\|_2^2\ } \tag{P}
$$

A minimizer (if it exists) is the **projection** of  $x_0$  onto  $C$ , written  $\Pi_C(x_0)$ .

We prove: existence, uniqueness, and the key inequality.

* * *

2.1 Existence (closedness + coercivity)
---------------------------------------

Define  $f(x)=\|x-x_0\|_2^2$ . Facts:

*    $f$  is continuous.
*    $f(x)\to\infty$  as  $\|x\|_2\to\infty$ . (Reason:  $\|x-x_0\|\ge \|x\|-\|x_0\|$ . So if  $\|x\|\to\infty$ , then  $\|x-x_0\|\to\infty$ .)

Let  $m:=\inf_{x\in C} f(x)$ . Choose a minimizing sequence  $x_k\in C$  with  $f(x_k)\downarrow m$ .

**Claim:  $(x_k)$  is bounded.**  
If unbounded, some subsequence has  $\|x_{k_j}\|\to\infty$ , then  $f(x_{k_j})\to\infty$ , contradicting  $f(x_k)\downarrow m<\infty$ .

In  $\mathbb R^n$ , bounded  $\Rightarrow$  has a convergent subsequence (Bolzano–Weierstrass). So  $x_{k_j}\to p$ .

Because  $C$  is **closed** and  $x_{k_j}\in C$ , the limit  $p\in C$ .

By continuity:

$$
f(p)=\lim_{j\to\infty} f(x_{k_j})=m.
$$

So  $p$  attains the infimum. ∎

**Why “closed” matters:** if  $C$  isn’t closed, you can have a minimizing sequence converging to a point outside  $C$ , so the infimum is never achieved.

* * *

2.2 Uniqueness (strict convexity of squared distance)
-----------------------------------------------------

Assume  $p_1\neq p_2$  are both minimizers. Let  $p=\tfrac12(p_1+p_2)$ . Convexity gives  $p\in C$ .

Now use the identity (this is the clean “no handwaving” strict convexity proof):

$$
\left\|\frac{u+v}{2}\right\|^2 =\frac{\|u\|^2+\|v\|^2}{2}-\frac{\|u-v\|^2}{4}.
$$

Apply with  $u=p_1-x_0$ ,  $v=p_2-x_0$ :

$$
\|p-x_0\|^2 =\frac{\|p_1-x_0\|^2+\|p_2-x_0\|^2}{2}-\frac{\|p_1-p_2\|^2}{4}.
$$

Since  $p_1\neq p_2$ , the last term is strictly positive, so

$$
\|p-x_0\|^2 < \frac{\|p_1-x_0\|^2+\|p_2-x_0\|^2}{2}.
$$

But  $\|p_1-x_0\|^2=\|p_2-x_0\|^2=m$ , so RHS  $=m$ . Thus  $\|p-x_0\|^2<m$ , contradicting minimality. ∎

So  $\Pi_C(x_0)$  is **well-defined** (single point).

* * *

2.3 The projection optimality inequality (the key geometric condition)
----------------------------------------------------------------------

Let  $p=\Pi_C(x_0)$ . Then:

 $$
\boxed{\ (x_0-p)^\top(x-p)\le 0\quad \forall x\in C.\ } \tag{VI}
$$

**Proof (pure algebra, one-dimensional perturbation):**

Fix any  $x\in C$ . For  $t\in[0,1]$ , define  $z(t)=p+t(x-p)$ . By convexity,  $z(t)\in C$ .

Define  $\phi(t)=\|x_0-z(t)\|^2$ . Since  $p=z(0)$  minimizes distance over all of  $C$ , in particular

$$
\phi(0)\le \phi(t)\quad\forall t\in[0,1].
$$

Compute the difference:

$$
x_0-z(t)=x_0-p-t(x-p).
$$

So

$$
\phi(t)=\|x_0-p-t(x-p)\|^2 =\|x_0-p\|^2 -2t(x-p)^\top(x_0-p)+t^2\|x-p\|^2.
$$

Thus

$$
\phi(t)-\phi(0)= -2t(x-p)^\top(x_0-p)+t^2\|x-p\|^2 \ge 0.
$$

Divide by  $t>0$  and let  $t\downarrow 0$ :

$$
-2(x-p)^\top(x_0-p)\ge 0 \iff (x_0-p)^\top(x-p)\le 0.
$$

Since  $x\in C$  was arbitrary, (VI) holds for all  $x\in C$ . ∎

**Meaning:** the residual vector  $x_0-p$  makes a **non-acute angle** with every feasible direction  $x-p$ . It’s a “normal vector” to  $C$  at  $p$ .

* * *

3) Separation theorem (point vs closed convex set) via projection
=================================================================

Now separation is basically one line.

Theorem (strict separation)
---------------------------

Let  $C\subseteq\mathbb R^n$  be nonempty, closed, convex. If  $x_0\notin C$ , let  $p=\Pi_C(x_0)$  and define

$$
a:=x_0-p\neq 0,\qquad \beta:=a^\top p.
$$

Then

 $$
\boxed{\ a^\top x \le \beta < a^\top x_0\quad\forall x\in C.\ } \tag{Sep}
$$

**Proof:**

From (VI):

$$
(x_0-p)^\top(x-p)\le 0\quad\forall x\in C.
$$

Substitute  $a=x_0-p$ :

$$
a^\top x - a^\top p \le 0 \iff a^\top x \le \beta \quad\forall x\in C.
$$

So  $C\subseteq H^-(a,\beta)$ .

For  $x_0$ :

$$
a^\top x_0 = a^\top(p+a)=a^\top p + a^\top a=\beta+\|a\|^2 > \beta.
$$

So  $x_0$  lies strictly on the other side. ∎

**Important subtlety:** strictness requires  $x_0\notin C$  (so  $a\neq 0$ ) and  $C$  closed+convex (so projection exists and is unique).

* * *

4) Supporting hyperplanes (boundary tangency)
=============================================

If  $x^\star\in\partial C$  (boundary) for a closed convex set  $C$ , there exists a nonzero  $a$  such that

$$
a^\top x \le a^\top x^\star\quad\forall x\in C.
$$

That is:  $C$  has at least one supporting hyperplane at every boundary point.

One concrete way to see it: take a sequence  $x_k\notin C$  approaching  $x^\star$ , separate each  $x_k$  from  $C$  by (Sep), normalize normals  $a_k/\|a_k\|$ , extract a convergent subsequence (unit sphere is compact), and pass to the limit.

This is “tangent planes exist” for convex sets.

* * *

5) Farkas’ lemma: feasibility certificates from separating a cone
=================================================================

Now we turn separation into an LP-style “either there exists  $x$ , or there exists a certificate  $y$ ”.

5.1 The cone behind nonnegativity
---------------------------------

Let  $A\in\mathbb R^{m\times n}$ . Define the set

$$
K := \{Ax:\ x\in\mathbb R^n,\ x\ge 0\}.
$$

This is a **convex cone**:

*   cone: if  $z=Ax\in K$  and  $\alpha\ge0$ , then  $\alpha z = A(\alpha x)$  with  $\alpha x\ge0$ .
*   convex: if  $z_1=Ax_1$ ,  $z_2=Ax_2$ , then  $(1-t)z_1+t z_2=A((1-t)x_1+t x_2)$  and  $(1-t)x_1+t x_2\ge0$ .

Also  $0\in K$  (take  $x=0$ ).

**Geometric reading:**  $K$  is the cone generated by the columns of  $A$ : all nonnegative conic combinations of columns.

We want to test membership:  $b\in K$  is exactly “ $\exists x\ge0$  with  $Ax=b$ ”.

To use strict separation, we want  $K$  **closed**. A finitely generated cone is indeed closed; in LP this is standard. (If you want a full proof later: it’s a polyhedral cone, hence an intersection of finitely many closed halfspaces, hence closed. This relies on the Minkowski–Weyl theorem; we can unpack that when we do polyhedra formally.)

Assume from now on: ** $K$  is closed** (true for this  $K$ ).

* * *

5.2 Farkas lemma (equality form)
--------------------------------

### Theorem (Farkas, equality form)

Exactly one of the following holds:

1.  There exists  $x\in\mathbb R^n$  such that
    
$$
Ax=b,\qquad x\ge 0.
$$
2.  There exists  $y\in\mathbb R^m$  such that
    
$$
A^\top y\ge 0,\qquad b^\top y<0.
$$

They cannot both be true, and if (1) fails then (2) must hold.

* * *

### Proof

#### Step 1: they cannot both hold

If  $Ax=b$  with  $x\ge 0$  and also  $A^\top y\ge 0$ , then

$$
b^\top y = (Ax)^\top y = x^\top(A^\top y)\ge 0,
$$

contradicting  $b^\top y<0$ . So not both.

#### Step 2: if (1) fails, produce a certificate  $y$ 

If (1) fails, then  $b\notin K$ . Since  $K$  is nonempty, closed, convex, we can strictly separate  $b$  from  $K$ .

So there exist  $a\neq 0$  and  $\beta$  such that

$$
a^\top z \le \beta < a^\top b\quad\forall z\in K. \tag{*}
$$

Because  $0\in K$ , plugging  $z=0$  gives  $0\le \beta$ , so  $\beta\ge 0$ .

Now use the crucial “cone scaling” trick: if there existed some  $z\in K$  with  $a^\top z>0$ , then for  $t\to\infty$ ,  $tz\in K$  but  $a^\top(tz)=t(a^\top z)$  would exceed  $\beta$ , contradicting  $(*)$ . Therefore:

$$
a^\top z \le 0 \quad\forall z\in K. \tag{**}
$$

From  $(*)$  we also have  $a^\top b>\beta\ge0$ , hence  $a^\top b>0$ .

Define  $y:=-a$ . Then  $(**)$  becomes:

$$
y^\top z = (-a)^\top z \ge 0 \quad\forall z\in K,
$$

and also

$$
y^\top b = -a^\top b < 0.
$$

So  $y$  is **nonnegative on the cone  $K$ ** but **negative on  $b$ **.

Now rewrite “ $y^\top z\ge0\ \forall z\in K$ ” in terms of  $A$ . Every  $z\in K$  is  $z=Ax$  for some  $x\ge0$ . So:

$$
y^\top(Ax)\ge0\quad\forall x\ge0 \iff (A^\top y)^\top x\ge0\quad\forall x\ge0.
$$

A vector  $w$  satisfies  $w^\top x\ge0$  for all  $x\ge0$  **iff**  $w\ge0$  componentwise (test  $x=e_i$ ). Hence  $A^\top y\ge0$ .

We already have  $b^\top y<0$ . This is exactly statement (2). ∎

**Interpretation:** if  $b$  is not a nonnegative combination of columns of  $A$ , there is a linear functional  $y^\top(\cdot)$  that is nonnegative on _all_ such combinations, yet negative on  $b$ . That  $y$  is a certificate of non-membership.

* * *

5.3 Common inequality form (and how it relates)
-----------------------------------------------

A frequently used version is:

Exactly one holds:

1.   $\exists x$  such that  $Ax\le b$ .
2.   $\exists y\ge0$  such that  $y^\top A=0^\top$  and  $y^\top b<0$ .

This is the same geometry, but the cone/set changes: you encode inequalities using slack variables or consider the set  $Ax+\mathbb R_+^m$ . It’s still separation; the equality form above is the clean “core”.

* * *

6) What to mentally store (so you can summon it later inside KKT/duality)
=========================================================================

*   **Projection** gives a canonical normal vector:  $a=x_0-\Pi_C(x_0)$ .
*   That normal vector **separates**  $x_0\notin C$  from  $C$ .
*   **Farkas** is separation specialized to the cone  $K=\{Ax:x\ge0\}$ .
*   The certificate conditions  $A^\top y\ge0$  and  $b^\top y<0$  are exactly:  
    “ $y$  is nonnegative on the cone  $K$ , but negative on  $b$ .”

That is the prototype of “dual variables are certificates.”

* * *

7) End-of-Module 15 checklist (automatic or you’re not done)
============================================================

You can do, without looking anything up:

1.  Prove existence of projection on nonempty closed convex  $C$ .
2.  Prove uniqueness via the midpoint / strict convexity identity.
3.  Derive the variational inequality  $(x_0-p)^\top(x-p)\le0$ .
4.  Turn it into strict separation  $a^\top x\le \beta < a^\top x_0$ .
5.  Prove Farkas equality form using (i) separation of  $b$  from  $K$ , (ii) the cone scaling trick, (iii) the “test with  $e_i$ ” argument.

* * *

Next module
-----------

**Module 16 — Convex/concave functions via epigraphs + convex envelopes.**  
You’ll see the exact same geometry again, except now the convex sets live in  $\mathbb R^{n+1}$  (epigraphs), and “supporting hyperplane” becomes “first-order inequality for convex functions.”

## Prompt:
Now this:

# Module 16 — Convex/concave functions via epigraphs, and convex envelopes

*(how “shape of a function” becomes “shape of a set,” and why envelopes are convex hulls in disguise)*

## 0) What this module is secretly doing

There are two ways to talk about a function (f):

1. **As an inequality machine:** (f((1-t)x+ty)\le (1-t)f(x)+t f(y)).
2. **As a geometric object:** the set of points above its graph.

Module 16 is where you learn to **swap** between these views instantly, because:

* convexity proofs become set convexity proofs,
* duality uses supporting hyperplanes of epigraphs,
* convex envelopes are literally **convex hulls** of epigraphs (BV 3.30),
* first-order conditions become supporting hyperplanes to the epigraph (tangent planes).

We will be extremely explicit about domains.

---

# 1) Functions with domains: don’t lie to yourself

A function is (f:D\to\mathbb R\cup{+\infty}) where (D\subseteq\mathbb R^n) is the **effective domain**
[
\mathrm{dom}(f):={x:\ f(x)<+\infty}.
]

In convex analysis it’s standard to allow (+\infty) values because constraints can be encoded by making (f(x)=+\infty) outside the feasible set (Module 17 will formalize that).

**Important:** convexity is only meaningful on a **convex domain**. If (\mathrm{dom}(f)) is not convex, (f) cannot be convex in the usual sense (because the convexity inequality needs the segment to stay in the domain).

So throughout:
[
\text{Assume }\mathrm{dom}(f)\text{ is convex unless stated otherwise.}
]

---

# 2) Epigraph and hypograph: sets that encode functions

## 2.1 Epigraph

For (f:\mathbb R^n\to\mathbb R\cup{+\infty}), define the **epigraph**
[
\boxed{\ \mathrm{epi}(f):={(x,t)\in\mathbb R^{n+1}:\ t\ge f(x)}. }
]
Think “everything **above** the graph.”

If (f(x)=+\infty) at some (x), then there is no (t) with (t\ge+\infty), so ((x,t)) never appears. So epigraph automatically respects domain.

## 2.2 Hypograph

For concavity we use the **hypograph**
[
\boxed{\ \mathrm{hypo}(f):={(x,t):\ t\le f(x)}. }
]
Think “everything **below** the graph.”

---

# 3) The core theorem: convexity ⇔ convex epigraph

This is one of the most important equivalences in all of convex optimization.

## Theorem

Let (f:\mathbb R^n\to\mathbb R\cup{+\infty}) with convex domain. Then:
[
\boxed{\ f\ \text{is convex}\quad\Longleftrightarrow\quad \mathrm{epi}(f)\ \text{is convex}. }
]

### Proof (⇒): convex function ⇒ convex epigraph

Assume (f) is convex. Take any two points in the epigraph:
[
(x_1,t_1)\in\mathrm{epi}(f),\quad (x_2,t_2)\in\mathrm{epi}(f).
]
By definition:
[
t_1\ge f(x_1),\qquad t_2\ge f(x_2).
]
Take any (\theta\in[0,1]). Consider the convex combination
[
(x_\theta,t_\theta) := ((1-\theta)x_1+\theta x_2,\ (1-\theta)t_1+\theta t_2).
]
We need to show ((x_\theta,t_\theta)\in\mathrm{epi}(f)), i.e.
[
t_\theta \ge f(x_\theta).
]

Because (f) is convex and the domain is convex, (x_\theta\in\mathrm{dom}(f)) and:
[
f(x_\theta)=f((1-\theta)x_1+\theta x_2)\le (1-\theta)f(x_1)+\theta f(x_2).
]
Now use (t_i\ge f(x_i)):
[
(1-\theta)f(x_1)+\theta f(x_2)\le (1-\theta)t_1+\theta t_2 = t_\theta.
]
So (f(x_\theta)\le t_\theta), i.e. ((x_\theta,t_\theta)\in\mathrm{epi}(f)).
Thus (\mathrm{epi}(f)) is convex. ∎

### Proof (⇐): convex epigraph ⇒ convex function

Assume (\mathrm{epi}(f)) is convex. Take any (x_1,x_2\in\mathrm{dom}(f)) and (\theta\in[0,1]). Consider points:
[
(x_1,f(x_1)),\quad (x_2,f(x_2)).
]
These are in the epigraph because (f(x_i)\ge f(x_i)) holds with equality.

Convexity of (\mathrm{epi}(f)) implies their convex combination lies in (\mathrm{epi}(f)):
[
\big((1-\theta)x_1+\theta x_2,\ (1-\theta)f(x_1)+\theta f(x_2)\big)\in\mathrm{epi}(f).
]
Meaning:
[
(1-\theta)f(x_1)+\theta f(x_2)\ \ge\ f((1-\theta)x_1+\theta x_2).
]
Rearrange:
[
f((1-\theta)x_1+\theta x_2)\le (1-\theta)f(x_1)+\theta f(x_2),
]
which is exactly convexity. ∎

**Commentary:**
Convexity of a function is really a statement about a set in one higher dimension. That’s why supporting hyperplanes and separation theorems apply to functions.

---

# 4) Concavity as convexity of (-f), and hypographs

A function (f) is **concave** iff (-f) is convex.

Equivalently:
[
\boxed{\ f\ \text{concave}\quad\Longleftrightarrow\quad \mathrm{hypo}(f)\ \text{is convex}. }
]
(The proof is the same but “above” becomes “below.”)

---

# 5) First-order inequality revisited: supporting hyperplanes to the epigraph

This connects Module 13 (first-order condition) with Module 15 (supporting hyperplanes).

If (f) is convex and differentiable, then for any (x),
[
f(y)\ge f(x)+\nabla f(x)^\top(y-x).
]
Geometrically, the affine function
[
\ell_x(y)=f(x)+\nabla f(x)^\top(y-x)
]
defines a hyperplane in ((y,t))-space:
[
t=\ell_x(y),
]
and convexity says the epigraph lies above it. So (\ell_x) is a **supporting hyperplane** to (\mathrm{epi}(f)) at ((x,f(x))).

This is the deep reason why gradients and subgradients are “supporting hyperplanes.”

---

# 6) Convex envelope / convex hull of a function (BV 3.30) — exact construction

Now the “convex envelope” is the tightest convex function under (f).

## 6.1 What does “convex underestimator” mean?

A function (g) is a **convex underestimator** (minorant) of (f) if:

1. (g) is convex,
2. (g(x)\le f(x)) for all (x) where (f) is defined (or for all (x) in some target domain).

Among all such (g), there is a largest one pointwise:
[
g^\star(x) = \sup{g(x): g\ \text{convex},\ g\le f}.
]
That (g^\star) is the **convex envelope** of (f) on the domain.

BV’s geometric definition is equivalent and much more elegant.

---

## 6.2 BV definition via convex hull of the epigraph

Define
[
\boxed{\ \mathrm{epi}(g) := \mathrm{conv}(\mathrm{epi}(f)), }
]
and then define (g(x)) as the “lower boundary” of that epigraph:
[
\boxed{\ g(x):=\inf{t:\ (x,t)\in \mathrm{conv}(\mathrm{epi}(f))}. }
]
This is exactly the statement you quoted in BV 3.30.

We will prove three things:

1. (g) is convex.
2. (g\le f) (so it’s an underestimator).
3. (g) is the **largest** convex underestimator (tightest).

---

# 7) Proofs for convex envelope construction (full, no handwaving)

Throughout assume (\mathrm{epi}(f)\neq\emptyset) (i.e. (f) proper somewhere), otherwise everything is degenerate.

## 7.1 First show: (\mathrm{epi}(g)=\mathrm{conv}(\mathrm{epi}(f))) is a valid epigraph of some function

Let (E:=\mathrm{conv}(\mathrm{epi}(f))\subseteq\mathbb R^{n+1}).

We must check that (E) has the “upward closed” property required of an epigraph:

### Lemma (upward closed property)

If ((x,t)\in \mathrm{epi}(f)) and (s\ge t), then ((x,s)\in \mathrm{epi}(f)).
Also, if ((x,t)\in E) and (s\ge t), then ((x,s)\in E).

#### Proof

* For (\mathrm{epi}(f)): immediate from definition (t\ge f(x)\Rightarrow s\ge f(x)).
* For (E=\mathrm{conv}(\mathrm{epi}(f))): take ((x,t)\in E). By definition of convex hull, there exist points ((x_i,t_i)\in\mathrm{epi}(f)) and weights (\theta_i\ge0), (\sum\theta_i=1), such that
  [
  (x,t)=\sum_i \theta_i (x_i,t_i).
  ]
  Now for any (s\ge t), write (s=t+\delta) with (\delta\ge0). Note that ((0,\delta)) in (\mathbb R^{n+1}) corresponds to adding (\delta) only in the (t)-coordinate. But we can realize this inside the convex hull because epigraphs are upward closed: each ((x_i,t_i+\delta)\in\mathrm{epi}(f)). Then
  [
  (x,s)=\sum_i \theta_i (x_i,t_i+\delta),
  ]
  which is a convex combination of epigraph points, hence lies in (E). ∎

So (E) is upward closed in (t). Therefore we can define
[
g(x)=\inf{t:(x,t)\in E},
]
and indeed (E=\mathrm{epi}(g)). (This is standard: every nonempty convex, upward-closed set in the (t)-direction corresponds to an extended-real function.)

---

## 7.2 (g) is convex

Since (E=\mathrm{epi}(g)) and (E) is convex by construction (convex hull of a set is convex), by the epigraph theorem:
[
E\ \text{convex} \iff g\ \text{convex}.
]
So (g) is convex. ∎

*(That’s exactly why this construction is so clean: convexity becomes immediate.)*

---

## 7.3 (g\le f) (underestimator property)

Because (\mathrm{epi}(f)\subseteq \mathrm{conv}(\mathrm{epi}(f))= \mathrm{epi}(g)),
for any (x),
[
(x,f(x))\in \mathrm{epi}(f)\subseteq \mathrm{epi}(g).
]
So by definition of epigraph membership,
[
f(x)\ge g(x).
]
Thus (g\le f). ∎

---

## 7.4 (g) is the largest convex underestimator (tightness)

Let (h) be any convex function with (h\le f). We show (h\le g).

Because (h\le f), for every (x),
[
t\ge f(x)\ \Rightarrow\ t\ge h(x).
]
So every point ((x,t)\in\mathrm{epi}(f)) is also in (\mathrm{epi}(h)). Hence
[
\mathrm{epi}(f)\subseteq \mathrm{epi}(h).
]
Now (\mathrm{epi}(h)) is convex (since (h) is convex). Therefore it contains the convex hull of any subset it contains:
[
\mathrm{conv}(\mathrm{epi}(f))\subseteq \mathrm{epi}(h).
]
But (\mathrm{conv}(\mathrm{epi}(f))=\mathrm{epi}(g)). So
[
\mathrm{epi}(g)\subseteq \mathrm{epi}(h).
]
Now translate epigraph inclusion into pointwise inequality:
For any (x), the smallest (t) such that ((x,t)\in\mathrm{epi}(h)) is (h(x)), and similarly for (g). If (\mathrm{epi}(g)\subseteq\mathrm{epi}(h)), then the “lower boundary” of (\mathrm{epi}(h)) must lie below (or equal to) that of (\mathrm{epi}(g)):
[
h(x)\le g(x)\quad\forall x.
]
So any convex underestimator (h) is (\le g). Hence (g) is the **largest** convex underestimator. ∎

**Commentary:**
This is the precise meaning of “convex envelope.” It’s not a heuristic smoothing. It’s a **maximal** convex function that stays under (f).

---

# 8) A more “computational” formula for (g(x)) (very important intuition)

From the definition ((x,t)\in\mathrm{conv}(\mathrm{epi}(f))), we can explicitly parametrize convex combinations.

A point ((x,t)) is in the convex hull iff there exist (k), points (x_i), weights (\theta_i\ge0), (\sum\theta_i=1), and numbers (t_i\ge f(x_i)) such that
[
x=\sum_i \theta_i x_i,\qquad t=\sum_i \theta_i t_i.
]
To make (t) as small as possible, you would clearly choose (t_i=f(x_i)) (anything larger would only increase (t)). So:
[
g(x)=\inf\left{\sum_{i=1}^k \theta_i f(x_i)\ :\ \theta_i\ge0,\ \sum\theta_i=1,\ \sum\theta_i x_i=x\right}.
]
This is an extremely concrete formula:

[
\boxed{\ g(x)=\inf\Big{\sum_i \theta_i f(x_i)\ :\ x=\sum_i\theta_i x_i,\ \theta_i\ge0,\ \sum\theta_i=1\Big}. }
]

**Interpretation:**
To compute (g(x)), you’re allowed to write (x) as an average of some points (x_i). Then (g(x)) is the best (smallest) averaged value of (f(x_i)) consistent with that decomposition. Geometrically: you “support” the epigraph from below by taking convex combinations.

*(In (\mathbb R^n), Carathéodory’s theorem says you only need at most (n+2) points in (\mathbb R^{n+1}) to represent a point in the convex hull. That’s why envelopes are finite-mixture objects.)*

---

# 9) Edge cases and domain subtleties (don’t skip)

## 9.1 If (f) is already convex

Then (\mathrm{epi}(f)) is convex, so (\mathrm{conv}(\mathrm{epi}(f))=\mathrm{epi}(f)), hence (g=f).

## 9.2 If (f) is not lower semicontinuous

The convex hull of the epigraph is always closed? Not necessarily; convex hull need not be closed unless you take closure. BV’s “convex envelope” sometimes is defined as the **closed convex hull** of the epigraph, yielding the **closed convex envelope** (lower semicontinuous convex minorant).
In many optimization settings you want lsc convex functions, so closure matters.

## 9.3 If (f) takes (+\infty) outside a set

Then the envelope effectively becomes “convexification of constraints,” exactly how relaxations are built. This will become extremely relevant in conic reformulations and convex relaxations.

---

# 10) End-of-Module 16 checklist (hard requirements)

You can:

1. Define epigraph/hypograph and explain domain handling via (+\infty).
2. Prove (f) convex ⇔ (\mathrm{epi}(f)) convex (both directions).
3. Interpret the first-order inequality as a supporting hyperplane to (\mathrm{epi}(f)).
4. Define convex envelope (g) via (\mathrm{epi}(g)=\mathrm{conv}(\mathrm{epi}(f))).
5. Prove:

   * (g) is convex,
   * (g\le f),
   * (g) is the largest convex underestimator.
6. Derive the “mixture formula”:
   [
   g(x)=\inf{\sum_i \theta_i f(x_i): x=\sum_i \theta_i x_i,\ \theta_i\ge0,\ \sum\theta_i=1}.
   ]

---

## Next module

**Module 17 — Subgradients, indicator functions, normal cones (nonsmooth foundation for KKT).**
This is where “supporting hyperplanes” become algebra: (\partial f(x)), (I_C), and (N_C(x)), and where constrained problems become unconstrained in extended-value form.

## Response:
Module 16 — Convex/concave functions via epigraphs, and convex envelopes
========================================================================

_(how “shape of a function” becomes “shape of a set,” and why envelopes are convex hulls in disguise)_

0) What this module is secretly doing
-------------------------------------

There are two equivalent ways to understand a function  $f$ :

1.  **Inequality view:** convexity is the chord inequality
    $$
    f((1-\theta)x+\theta y)\le (1-\theta)f(x)+\theta f(y).
    $$
2.  **Geometry view:** convexity is the convexity of a set in one higher dimension.

Module 16 is the bridge that lets you swap views instantly. That swap is not “pretty”—it is _structural_:

*   convexity proofs become set convexity proofs,
*   supporting hyperplanes to sets become first-order inequalities for functions,
*   convex envelopes become literally **convex hulls of epigraphs** (BV 3.30).

We’ll be relentless about domains.

* * *

1) Functions with domains: don’t lie to yourself
================================================

In convex analysis we typically work with **extended-real-valued functions**

$$
f:\mathbb R^n\to\mathbb R\cup\{+\infty\}.
$$

The **effective domain** is

 $$
\boxed{\ \mathrm{dom}(f):=\{x\in\mathbb R^n:\ f(x)<+\infty\}. \ }
$$

### Why allow  $+\infty$ ?

Because constraints can be encoded as “infinite penalty.” If  $C\subseteq\mathbb R^n$  is a feasible set, define the **indicator function**

$$
I_C(x)=\begin{cases} 0,&x\in C\\ +\infty,&x\notin C. \end{cases}
$$

Then minimizing  $f$  over  $C$  is the same as minimizing  $f+I_C$  over all  $\mathbb R^n$ . (Module 17 will formalize this, but the idea starts here.)

### Domain honesty for convexity

Convexity is only meaningful on a set that contains line segments. The convexity inequality needs the point

$$
(1-\theta)x+\theta y
$$

to be in the domain whenever  $x,y$  are.

So the standard convention is:

*    $f$  is convex **on its domain** if  $\mathrm{dom}(f)$  is convex and the convexity inequality holds for all  $x,y\in\mathrm{dom}(f)$ ,  $\theta\in[0,1]$ .

If  $\mathrm{dom}(f)$  is not convex, “convex function” in the usual sense is dead on arrival.

* * *

2) Epigraph and hypograph: sets that encode functions
=====================================================

2.1 Epigraph
------------

For  $f:\mathbb R^n\to\mathbb R\cup\{+\infty\}$ , define

 $$
\boxed{\ \mathrm{epi}(f):=\{(x,t)\in\mathbb R^{n+1}:\ t\ge f(x)\}. \ }
$$

Think: **everything above the graph**.

**Key domain fact:** if  $f(x)=+\infty$ , then there is no real  $t$  with  $t\ge +\infty$ , so no point  $(x,t)$  appears. The epigraph automatically “removes” points outside the effective domain.

2.2 Hypograph
-------------

For concavity we use

 $$
\boxed{\ \mathrm{hypo}(f):=\{(x,t):\ t\le f(x)\}. \ }
$$

Think: **everything below the graph**.

* * *

3) The core equivalence: convexity  $\Longleftrightarrow$  convex epigraph
==========================================================================

This is one of the most important equivalences in convex optimization.

Theorem (epigraph characterization)
-----------------------------------

Let  $f:\mathbb R^n\to\mathbb R\cup\{+\infty\}$  and assume  $\mathrm{dom}(f)$  is convex. Then

 $$
\boxed{\ f\ \text{is convex}\quad\Longleftrightarrow\quad \mathrm{epi}(f)\ \text{is convex}. }
$$

* * *

Proof (⇒) convex  $f$  ⇒ convex  $\mathrm{epi}(f)$ 
---------------------------------------------------

Assume  $f$  is convex.

Take any two points  $(x_1,t_1),(x_2,t_2)\in\mathrm{epi}(f)$ . By definition:

$$
t_1\ge f(x_1),\qquad t_2\ge f(x_2).
$$

Fix  $\theta\in[0,1]$  and define the convex combination

$$
(x_\theta,t_\theta):=\big((1-\theta)x_1+\theta x_2,\ (1-\theta)t_1+\theta t_2\big).
$$

We must show  $(x_\theta,t_\theta)\in\mathrm{epi}(f)$ , i.e.

$$
t_\theta\ge f(x_\theta).
$$

Because  $\mathrm{dom}(f)$  is convex,  $x_\theta\in\mathrm{dom}(f)$ . By convexity of  $f$ ,

$$
f(x_\theta)=f((1-\theta)x_1+\theta x_2)\le (1-\theta)f(x_1)+\theta f(x_2).
$$

Now use  $t_i\ge f(x_i)$ :

$$
(1-\theta)f(x_1)+\theta f(x_2)\le (1-\theta)t_1+\theta t_2=t_\theta.
$$

So  $f(x_\theta)\le t_\theta$ , hence  $(x_\theta,t_\theta)\in\mathrm{epi}(f)$ .

Therefore  $\mathrm{epi}(f)$  is convex. ∎

* * *

Proof (⇐) convex  $\mathrm{epi}(f)$  ⇒ convex  $f$ 
---------------------------------------------------

Assume  $\mathrm{epi}(f)$  is convex.

Take any  $x_1,x_2\in\mathrm{dom}(f)$  and  $\theta\in[0,1]$ .

The points  $(x_1,f(x_1))$  and  $(x_2,f(x_2))$  are in  $\mathrm{epi}(f)$  because  $f(x_i)\ge f(x_i)$  holds with equality.

By convexity of  $\mathrm{epi}(f)$ , their convex combination is in  $\mathrm{epi}(f)$ :

$$
\big((1-\theta)x_1+\theta x_2,\ (1-\theta)f(x_1)+\theta f(x_2)\big)\in\mathrm{epi}(f).
$$

Unpacking membership in the epigraph means:

$$
(1-\theta)f(x_1)+\theta f(x_2)\ \ge\ f((1-\theta)x_1+\theta x_2).
$$

Rearrange:

$$
f((1-\theta)x_1+\theta x_2)\le (1-\theta)f(x_1)+\theta f(x_2),
$$

which is exactly convexity. ∎

* * *

### What to internalize

A convex function is just a function whose epigraph is a convex set in  $\mathbb R^{n+1}$ .  
So “function convexity” becomes “set convexity,” and all of Module 14–15 geometry becomes applicable to functions.

* * *

4) Concavity via hypographs
===========================

A function  $f$  is concave iff  $-f$  is convex.

Equivalently,

 $$
\boxed{\ f\ \text{concave}\quad\Longleftrightarrow\quad \mathrm{hypo}(f)\ \text{is convex}. }
$$

Same proof, with inequalities flipped.

* * *

5) First-order inequality = supporting hyperplane to the epigraph
=================================================================

This is where Module 13 (gradients) and Module 15 (supporting hyperplanes) collide.

If  $f$  is convex and differentiable, then for any  $x$  and all  $y$ ,

 $$
\boxed{\ f(y)\ge f(x)+\nabla f(x)^\top(y-x). } \tag{FO}
$$

Define the affine function (“tangent plane” in  $y$ \-space)

$$
\ell_x(y):=f(x)+\nabla f(x)^\top(y-x).
$$

Now interpret  $(FO)$  in  $(y,t)$ \-space:

$$
t\ge f(y)\ \Rightarrow\ t\ge \ell_x(y).
$$

So the hyperplane

$$
t=\ell_x(y)
$$

lies **below** the epigraph and touches it at  $(x,f(x))$ . That is literally a **supporting hyperplane** to  $\mathrm{epi}(f)$  at  $(x,f(x))$ .

This is the deep reason gradients/subgradients are “supporting hyperplanes.”

* * *

6) Convex envelope (BV 3.30): the tightest convex underestimator
================================================================

6.1 Convex underestimator (minorant)
------------------------------------

A function  $h$  is a convex underestimator of  $f$  if:

1.   $h$  is convex,
2.   $h(x)\le f(x)$  for all  $x$  (at least for all  $x\in\mathrm{dom}(f)$ , depending on the setup).

Among all such  $h$ , there is a pointwise largest one:

$$
h^\star(x)=\sup\{h(x):\ h\ \text{convex and }h\le f\}.
$$

That object is the **convex envelope** of  $f$ .

BV gives a geometric construction that produces exactly this  $h^\star$ .

* * *

6.2 BV construction: convex hull of the epigraph
------------------------------------------------

Let

$$
E := \mathrm{conv}(\mathrm{epi}(f))\subseteq\mathbb R^{n+1}.
$$

Define  $g$  by taking the “lower boundary” of  $E$ :

 $$
\boxed{\ g(x):=\inf\{t:\ (x,t)\in \mathrm{conv}(\mathrm{epi}(f))\}. } \tag{CE}
$$

Equivalently:

 $$
\boxed{\ \mathrm{epi}(g)=\mathrm{conv}(\mathrm{epi}(f)). }
$$

(This equivalence is not magic; we justify it below.)

Goal: prove

1.   $g$  is convex,
2.   $g\le f$ ,
3.   $g$  is the **largest** convex underestimator of  $f$ .

* * *

7) Proofs for the convex envelope construction (no handwaving)
==============================================================

Assume  $\mathrm{epi}(f)\neq\emptyset$  (i.e.,  $f$  is proper somewhere), otherwise everything degenerates.

Let

$$
E:=\mathrm{conv}(\mathrm{epi}(f)).
$$

* * *

7.1 First:  $E$  really is an epigraph of some function
-------------------------------------------------------

An epigraph has an “upward closed” property: if  $(x,t)$  is in it, then  $(x,s)$  is in it for all  $s\ge t$ .

### Lemma (upward closedness is preserved by convex hull)

1.  If  $(x,t)\in \mathrm{epi}(f)$  and  $s\ge t$ , then  $(x,s)\in \mathrm{epi}(f)$ .
2.  If  $(x,t)\in E$  and  $s\ge t$ , then  $(x,s)\in E$ .

**Proof.**

1.  Immediate:  $t\ge f(x)$  and  $s\ge t$  imply  $s\ge f(x)$ .
2.  Since  $(x,t)\in E$ , there exist points  $(x_i,t_i)\in\mathrm{epi}(f)$  and weights  $\theta_i\ge0$ ,  $\sum_i\theta_i=1$ , such that
    $$
    (x,t)=\sum_i \theta_i(x_i,t_i).
    $$
    Let  $s=t+\delta$  with  $\delta\ge0$ . By (1), each  $(x_i,t_i+\delta)\in\mathrm{epi}(f)$ . Then
    $$
    (x,s)=\sum_i \theta_i(x_i,t_i+\delta)
    $$
    is a convex combination of epigraph points, hence lies in  $E$ . ∎

Because  $E$  is upward closed, for each  $x$  the set  $\{t:(x,t)\in E\}$  is either empty or a ray  $[g(x),\infty)$  (possibly with  $g(x)=-\infty$  in pathological cases). Defining  $g$  by (CE) makes sense, and we indeed get:

$$
E=\mathrm{epi}(g).
$$

* * *

7.2  $g$  is convex
-------------------

 $E$  is convex by construction (it’s a convex hull). We proved  $E=\mathrm{epi}(g)$ . By the epigraph characterization (Section 3):

$$
\mathrm{epi}(g)\ \text{convex}\iff g\ \text{convex}.
$$

Therefore  $g$  is convex. ∎

* * *

7.3  $g\le f$ 
--------------

We have the set inclusion

$$
\mathrm{epi}(f)\subseteq \mathrm{conv}(\mathrm{epi}(f))= \mathrm{epi}(g).
$$

So for any  $x\in\mathrm{dom}(f)$ , the point  $(x,f(x))\in\mathrm{epi}(f)\subseteq\mathrm{epi}(g)$ . Membership in  $\mathrm{epi}(g)$  means  $f(x)\ge g(x)$ . Hence

 $$
\boxed{\ g(x)\le f(x)\quad\forall x\in\mathrm{dom}(f). }
$$

So  $g$  is an underestimator. ∎

* * *

7.4  $g$  is the largest convex underestimator
----------------------------------------------

Let  $h$  be any convex function with  $h\le f$ . We show  $h\le g$ .

Since  $h\le f$ , whenever  $t\ge f(x)$  we also have  $t\ge h(x)$ . So every epigraph point of  $f$  is also an epigraph point of  $h$ :

$$
\mathrm{epi}(f)\subseteq \mathrm{epi}(h).
$$

Because  $h$  is convex,  $\mathrm{epi}(h)$  is convex, so it contains the convex hull of any subset it contains:

$$
\mathrm{conv}(\mathrm{epi}(f))\subseteq \mathrm{epi}(h).
$$

But  $\mathrm{conv}(\mathrm{epi}(f))=\mathrm{epi}(g)$ . Hence

$$
\mathrm{epi}(g)\subseteq \mathrm{epi}(h).
$$

Epigraph inclusion reverses function inequality: if  $\mathrm{epi}(g)\subseteq\mathrm{epi}(h)$ , then  $h(x)\le g(x)$  for all  $x$ . (Reason: the set of admissible  $t$ ’s above  $h(x)$  starts lower or equal.)

Therefore  $h\le g$ . Since  $h$  was arbitrary among convex underestimators,  $g$  is the pointwise largest convex underestimator: the convex envelope. ∎

* * *

8) A very concrete formula for the envelope (the “mixture” view)
================================================================

Unpack what it means for  $(x,t)$  to lie in  $\mathrm{conv}(\mathrm{epi}(f))$ .

 $(x,t)\in\mathrm{conv}(\mathrm{epi}(f))$  iff there exist finitely many points  $(x_i,t_i)\in\mathrm{epi}(f)$  and weights  $\theta_i\ge0$ ,  $\sum\theta_i=1$ , such that

$$
x=\sum_i\theta_i x_i,\qquad t=\sum_i\theta_i t_i,\qquad t_i\ge f(x_i).
$$

To minimize  $t$  for a given  $x$ , you would choose  $t_i=f(x_i)$  (anything larger only increases  $t$ ). So:

 $$
\boxed{\ g(x)=\inf\left\{\sum_{i=1}^k \theta_i f(x_i)\ :\ \theta_i\ge 0,\ \sum_{i=1}^k\theta_i=1,\ \sum_{i=1}^k\theta_i x_i=x \right\}. }
$$

**Interpretation:** you’re allowed to represent  $x$  as an average of points  $x_i$ . Then you take the best possible averaged function value  $\sum \theta_i f(x_i)$ . The envelope is the “best convex interpolation from below.”

(Extra geometric fact: by Carathéodory, in  $\mathbb R^{n+1}$  you only need at most  $n+2$  points in such a convex combination. This explains why envelopes are finite-mixture objects.)

* * *

9) Subtleties you should actually care about
============================================

9.1 If  $f$  is already convex
------------------------------

Then  $\mathrm{epi}(f)$  is convex, so  $\mathrm{conv}(\mathrm{epi}(f))=\mathrm{epi}(f)$ , hence  $g=f$ .

9.2 Closedness / lower semicontinuity
-------------------------------------

Convex hulls are convex, but not automatically **closed**. Many texts define the **closed convex envelope** using  $\overline{\mathrm{conv}}(\mathrm{epi}(f))$ , giving the greatest **lower semicontinuous** convex minorant. BV’s context often implicitly leans toward closed convex epigraphs (important in duality).

9.3 Encoding constraints with  $+\infty$ 
-----------------------------------------

If  $f=f_0+I_C$ , the convex envelope is effectively “convexifying” both the objective and the feasible set—this is the conceptual engine behind convex relaxations.

* * *

10) End-of-Module 16 checklist (hard requirements)
==================================================

You can do these without looking anything up:

1.  Define  $\mathrm{epi}(f)$ ,  $\mathrm{hypo}(f)$ ,  $\mathrm{dom}(f)$  and explain why  $+\infty$  encodes constraints.
2.  Prove  $f$  convex ⇔  $\mathrm{epi}(f)$  convex (both directions).
3.  Explain  $f(y)\ge f(x)+\nabla f(x)^\top(y-x)$  as a supporting hyperplane to  $\mathrm{epi}(f)$  at  $(x,f(x))$ .
4.  Define  $g$  by  $\mathrm{epi}(g)=\mathrm{conv}(\mathrm{epi}(f))$  and prove:
    *    $g$  convex,
    *    $g\le f$ ,
    *    $g$  is the largest convex underestimator.
5.  Derive the mixture formula for  $g(x)$ .

* * *

Next module
-----------

**Module 17 — Subgradients, indicator functions, normal cones (nonsmooth foundation for KKT).**  
This is where supporting hyperplanes become algebra:  $\partial f(x)$ ,  $I_C$ , and  $N_C(x)$ , and where KKT becomes a statement about normals and cones.

## Prompt:
Now this:

# Module 17 — Subgradients, indicator functions, normal cones

*(nonsmooth convex analysis: the real language of KKT)*

## 0) What this module is secretly doing

Smooth optimization talks in gradients: (\nabla f(x^\star)=0).
Convex optimization in the real world is often **nonsmooth** and **constrained**, so gradients don’t exist or aren’t enough.

Module 17 replaces “gradient = 0” with one clean geometric statement:

[
\boxed{\ 0 \in \partial f(x^\star) + N_C(x^\star). \ }
]

Where:

* (\partial f(x^\star)) is the set of all **supporting hyperplane slopes** of (f) at (x^\star),
* (N_C(x^\star)) is the set of all **outward normals** to the constraint set at (x^\star).

This is the conceptual bridge to KKT: multipliers are just coordinates of a normal vector in a constraint-generated cone.

---

# 1) Subgradients: definition and meaning

## 1.1 Subgradient definition (convex functions)

Let (f:\mathbb R^n\to\mathbb R\cup{+\infty}) be convex with convex domain.
A vector (g\in\mathbb R^n) is a **subgradient** of (f) at (x\in\mathrm{dom}(f)) if
[
\boxed{\ f(y)\ \ge\ f(x) + g^\top (y-x)\quad \forall y\in\mathrm{dom}(f). }
]
The set of all subgradients is the **subdifferential**
[
\boxed{\ \partial f(x) := {g:\ f(y)\ge f(x)+g^\top(y-x)\ \forall y}. }
]

### Intuition

A subgradient is the slope of a **supporting hyperplane** to the epigraph at ((x,f(x))).
For smooth convex (f), there is exactly one supporting hyperplane slope: (\nabla f(x)).
For nonsmooth (f), there can be many.

---

## 1.2 Subgradient ⇒ supporting hyperplane (make it explicit)

Define the affine function
[
\ell(y)= f(x)+g^\top(y-x).
]
The subgradient inequality says (\ell(y)\le f(y)) for all (y): the affine function lies below (f) and touches at (x). That’s exactly “supporting.”

---

# 2) Key theorem: differentiable convex ⇒ subgradient set is singleton

### Theorem

If (f) is convex and differentiable at (x), then
[
\boxed{\ \partial f(x)={\nabla f(x)}. }
]

### Proof

From Module 13 (first-order characterization), convex + differentiable implies:
[
f(y)\ge f(x)+\nabla f(x)^\top(y-x)\quad\forall y.
]
So (\nabla f(x)\in\partial f(x)).

Now suppose (g\in\partial f(x)). Consider the directional derivative:
[
Df(x;d)=\lim_{t\downarrow 0}\frac{f(x+td)-f(x)}{t}.
]
From subgradient inequality with (y=x+td):
[
f(x+td)\ge f(x)+g^\top(td)\Rightarrow \frac{f(x+td)-f(x)}{t}\ge g^\top d.
]
Take (t\downarrow0): (Df(x;d)\ge g^\top d).

But differentiability gives (Df(x;d)=\nabla f(x)^\top d). So:
[
\nabla f(x)^\top d \ge g^\top d\quad\forall d.
]
Apply the same with (-d):
[
\nabla f(x)^\top(-d)\ge g^\top(-d)\Rightarrow \nabla f(x)^\top d \le g^\top d.
]
Hence equality for all (d), so (g=\nabla f(x)).
Thus (\partial f(x)) is exactly ({\nabla f(x)}). ∎

**Commentary:** subgradients generalize gradients without breaking convex geometry.

---

# 3) First optimality condition: (0\in\partial f(x^\star))

### Theorem (unconstrained convex minimization)

Let (f) be convex. Then (x^\star) minimizes (f) over (\mathbb R^n) (or over its domain) iff
[
\boxed{\ 0\in \partial f(x^\star). }
]

### Proof

**(⇒)** If (x^\star) is a minimizer, then for all (y),
[
f(y)\ge f(x^\star).
]
Rewrite as
[
f(y)\ge f(x^\star)+0^\top(y-x^\star),
]
so (0) satisfies the subgradient inequality, hence (0\in\partial f(x^\star)).

**(⇐)** If (0\in\partial f(x^\star)), then for all (y),
[
f(y)\ge f(x^\star)+0^\top(y-x^\star)=f(x^\star).
]
So (x^\star) is a global minimizer. ∎

**This is the nonsmooth replacement of** (\nabla f(x^\star)=0).

---

# 4) Canonical examples of subgradients (compute them exactly)

## 4.1 Absolute value (f(t)=|t|) on (\mathbb R)

Claim:
[
\boxed{\ \partial |t|=
\begin{cases}
{1}, & t>0\
[-1,1], & t=0\
{-1}, & t<0.
\end{cases}}
]

### Proof

* If (t>0), function is differentiable with derivative (1), so subdifferential is ({1}). Similarly for (t<0), it is ({-1}).

* At (t=0), we need (g) such that for all (y),
  [
  |y|\ge |0|+g(y-0)=gy.
  ]
  So we need (|y|\ge gy\ \forall y).

Take (y>0): inequality becomes (y\ge gy\Rightarrow g\le 1).
Take (y<0): inequality becomes (-y\ge gy\Rightarrow -y - gy \ge 0\Rightarrow (-1-g)y\ge0). Since (y<0), this requires (-1-g\le 0\Rightarrow g\ge -1).

So (-1\le g\le 1). Conversely, any (g\in[-1,1]) satisfies (|y|\ge gy) (check separately for (y\ge0) and (y\le0)). ∎

---

## 4.2 (\ell_1) norm (f(x)=|x|_1=\sum_i |x_i|)

Because sums of convex functions add subgradients coordinatewise:
[
\boxed{\ \partial |x|_1 = {g:\ g_i\in\partial|x_i|\ \forall i}. }
]
So:

* if (x_i>0), then (g_i=1);
* if (x_i<0), then (g_i=-1);
* if (x_i=0), then (g_i\in[-1,1]).

---

## 4.3 Max function (f(x)=\max_{i=1,\dots,m} a_i^\top x)

Let active set at (x):
[
I(x):={i:\ a_i^\top x = \max_j a_j^\top x}.
]
Then
[
\boxed{\ \partial f(x) = \mathrm{conv}{a_i:\ i\in I(x)}. }
]

### Proof sketch (core reasoning)

* Each affine function (a_i^\top x) is convex and has gradient (a_i).
* The max of convex functions is convex.
* At a point where a single index (i) strictly wins, locally (f) equals that affine function ⇒ subgradient is (a_i).
* At a tie, any convex combination of the active gradients supports the max (it gives a supporting hyperplane to the pointwise max). Full proof is standard and we can unpack further if needed, but this statement is a workhorse you’ll use constantly.

(We can also prove it by epigraph intersection: epi of max is intersection of epis; normals to intersection correspond to convex combinations of normals. Same geometric idea.)

---

# 5) Indicator functions: turning constraints into functions

## 5.1 Definition

For a set (C\subseteq\mathbb R^n), define the **indicator function**
[
\boxed{\ I_C(x)=
\begin{cases}
0, & x\in C\
+\infty, & x\notin C.
\end{cases}}
]

### Key fact

[
\boxed{\ I_C\ \text{is convex} \iff C\ \text{is convex}. }
]
Because (\mathrm{epi}(I_C)=C\times [0,\infty)) (check this: if (x\in C), then (t\ge0); if (x\notin C), no finite (t) works). Convexity of that epigraph is exactly convexity of (C).

---

## 5.2 Constraint as unconstrained problem (exact equivalence)

The constrained problem
[
\min_{x\in C} f(x)
]
is equivalent to the unconstrained extended-value problem
[
\boxed{\ \min_x \big(f(x)+I_C(x)\big). }
]
Because:

* if (x\notin C), objective is (+\infty), so never optimal;
* if (x\in C), objective equals (f(x)).

This is not a trick; it’s the clean language that makes KKT feel inevitable.

---

# 6) Normal cones: subgradients of indicator functions

## 6.1 Definition (normal cone)

Let (C) be a closed convex set and (x\in C). Define the **normal cone** at (x):
[
\boxed{\ N_C(x):={v:\ v^\top (y-x)\le 0\ \forall y\in C}. }
]
If (x\notin C), define (N_C(x)=\emptyset).

### Intuition

(v\in N_C(x)) means (v) points “outward”: every feasible direction (y-x) makes an obtuse angle with (v).

This matches the projection inequality from Module 15: if (p=\Pi_C(x_0)), then (x_0-p\in N_C(p)).

---

## 6.2 Key theorem: (\partial I_C(x)=N_C(x))

### Theorem

If (C) is closed convex and (x\in C), then
[
\boxed{\ \partial I_C(x)=N_C(x). }
]

### Proof

Take (g\in\partial I_C(x)). By definition:
[
I_C(y)\ge I_C(x)+g^\top(y-x)\quad\forall y.
]
Since (x\in C), (I_C(x)=0).

* If (y\in C), then (I_C(y)=0), so inequality becomes
  [
  0\ge 0 + g^\top(y-x)\Rightarrow g^\top(y-x)\le 0.
  ]
  So (g\in N_C(x)).

* If (y\notin C), then (I_C(y)=+\infty), inequality holds automatically.

Thus (\partial I_C(x)\subseteq N_C(x)).

Conversely, take (g\in N_C(x)). For any (y\in C), we have (g^\top(y-x)\le 0), so
[
I_C(y)=0 \ge 0 + g^\top(y-x) = I_C(x)+g^\top(y-x).
]
For (y\notin C), (I_C(y)=+\infty) so the inequality still holds. Therefore (g\in\partial I_C(x)). So (N_C(x)\subseteq\partial I_C(x)).

Hence equality. ∎

**Commentary:** This is the precise algebraic bridge from “constraints” to “normals,” i.e. to multipliers.

---

# 7) The master optimality condition for constrained convex problems

Consider:
[
\min_{x\in C} f(x)
]
with (f) convex and (C) closed convex.

Rewrite as (\min_x f(x)+I_C(x)). By unconstrained optimality (Section 3):
[
0\in \partial(f+I_C)(x^\star).
]
Now we need a sum rule. Under mild regularity (e.g. (x^\star\in \mathrm{ri}(\mathrm{dom}f)\cap \mathrm{ri}(C))), we have:
[
\partial(f+I_C)(x^\star)=\partial f(x^\star)+\partial I_C(x^\star)
=\partial f(x^\star)+N_C(x^\star).
]
So:
[
\boxed{\ 0\in \partial f(x^\star)+N_C(x^\star). }
]

### Interpretation (geometric)

There exists a subgradient (g\in\partial f(x^\star)) such that (-g\in N_C(x^\star)).
Meaning: a supporting hyperplane to (f) at (x^\star) is balanced by an outward normal of the feasible set. This is literally “tangent plane to objective + tangent plane to feasible set” equilibrium.

This is KKT in its cleanest convex-analytic form.

---

# 8) Concrete normal cones (so you can recognize them later)

## 8.1 Halfspace (C={x:\ a^\top x\le b})

* If (a^\top x<b) (interior), then (N_C(x)={0}).
* If (a^\top x=b) (boundary), then
  [
  \boxed{\ N_C(x)={\lambda a:\ \lambda\ge 0}. }
  ]
  Proof: (v^\top(y-x)\le 0) for all feasible (y) forces (v) to be a nonnegative multiple of the outward normal (a).

This is exactly where nonnegative multipliers come from.

## 8.2 Nonnegative orthant (C=\mathbb R_+^n)

For (x\ge0),
[
\boxed{\ N_C(x)={v:\ v_i=0\ \text{if }x_i>0,\ \ v_i\le 0\ \text{if }x_i=0}. }
]
Interpretation: if coordinate is strictly inside (positive), no outward force allowed there; if coordinate is at boundary (zero), the normal can push negative (outward).

This is complementary slackness geometry in embryo.

---

# 9) End-of-Module 17 checklist (no mercy)

You can:

1. Define subgradient and subdifferential and interpret them as supporting hyperplanes.
2. Prove differentiable convex ⇒ (\partial f(x)={\nabla f(x)}).
3. Prove unconstrained convex optimum ⇔ (0\in\partial f(x^\star)).
4. Compute (\partial|t|), (\partial|x|_1), and (\partial \max_i a_i^\top x).
5. Define indicator (I_C) and prove (I_C) convex ⇔ (C) convex.
6. Define normal cone (N_C(x)) and prove (\partial I_C(x)=N_C(x)).
7. Derive constrained optimality: (0\in\partial f(x^\star)+N_C(x^\star)).
8. Recognize normal cones for halfspaces and (\mathbb R_+^n).

---

## Next module

**Module 18 — Quasiconvex / quasiconcave via level sets.**
This is where you learn to stop trying Hessians on problems where the right tool is “sublevel sets are convex,” especially for fractional objectives and “ratio” constraints.

## Response:
Thought for 36s

Module 17 — Subgradients, indicator functions, normal cones
===========================================================

_(nonsmooth convex analysis: the real language of KKT)_

0) What this module is secretly doing
-------------------------------------

Smooth optimization lives in the fantasy world where “ $\nabla f(x^\star)=0$ ” makes sense everywhere.

Real convex optimization is usually:

*   **nonsmooth** (norms, max, hinge, absolute values, piecewise-linear penalties),
*   **constrained** (feasible sets with boundaries where gradients don’t tell the whole story).

So Module 17 replaces “gradient = 0” with one geometric statement that survives both nonsmoothness _and_ constraints:

 $$
\boxed{ \ 0 \in \partial f(x^\star) \;+\; N_C(x^\star). \ }
$$

Interpretation:

*    $\partial f(x^\star)$ : all slopes of supporting hyperplanes to  $f$  at  $x^\star$ .
*    $N_C(x^\star)$ : all outward normals to the feasible set  $C$  at  $x^\star$ .

This is the clean core of KKT: multipliers are just coordinates of a normal vector in a cone generated by active constraints.

We’ll be domain-honest the whole way: subgradients only make sense where the function is finite; normals only make sense where you’re inside the set.

* * *

1) Subgradients: definition, meaning, and the epigraph geometry
===============================================================

1.1 Definition (convex subgradient)
-----------------------------------

Let  $f:\mathbb R^n\to\mathbb R\cup\{+\infty\}$  be convex with convex effective domain  $\mathrm{dom}(f)$ .  
Fix  $x\in\mathrm{dom}(f)$ .

A vector  $g\in\mathbb R^n$  is a **subgradient** of  $f$  at  $x$  if

 $$
\boxed{\ f(y)\ \ge\ f(x) + g^\top (y-x)\quad \forall y\in\mathrm{dom}(f). \ }
$$

The set of all subgradients is the **subdifferential**

 $$
\boxed{\ \partial f(x) := \{g:\ f(y)\ge f(x)+g^\top(y-x)\ \forall y\in\mathrm{dom}(f)\}. \ }
$$

**Domain honesty:** if  $x\notin\mathrm{dom}(f)$  (i.e.  $f(x)=+\infty$ ), we define  $\partial f(x)=\emptyset$ . There is no meaningful “supporting hyperplane at an infinite height.”

* * *

1.2 Why this is “supporting hyperplanes” (make it concrete)
-----------------------------------------------------------

Define the affine function (a plane in  $\mathbb R^n$ ):

$$
\ell(y) := f(x)+g^\top(y-x).
$$

The inequality  $f(y)\ge \ell(y)$  says:  
**the graph of  $f$  lies above  $\ell$ , and touches it at  $x$ ** (since equality holds at  $y=x$ ).

So  $g$  is exactly “a slope of a supporting hyperplane” to the epigraph of  $f$  at  $(x,f(x))$ .

* * *

1.3 Epigraph normal-vector characterization (important bridge to normal cones)
------------------------------------------------------------------------------

The epigraph is

$$
\mathrm{epi}(f) = \{(y,t)\in\mathbb R^{n+1}:\ t\ge f(y)\}.
$$

A supporting hyperplane to  $\mathrm{epi}(f)$  at  $(x,f(x))$  can be written as

$$
\alpha^\top y + \beta t = \gamma,
$$

with  $(\alpha,\beta)\neq 0$ , such that

$$
\alpha^\top y + \beta t \ge \gamma\quad\forall (y,t)\in\mathrm{epi}(f), \quad\text{and equality at }(x,f(x)).
$$

For subgradients, the natural normalization is  $\beta=-1$ . Then the hyperplane is

$$
t = f(x)+g^\top(y-x).
$$

Its normal vector in  $\mathbb R^{n+1}$  is  $(g,-1)$ .

### The key equivalence

 $$
\boxed{\ g\in\partial f(x)\quad\Longleftrightarrow\quad (g,-1)\in N_{\mathrm{epi}(f)}\big((x,f(x))\big). }
$$

I’m not going to pretend this is “obvious,” so here’s the proof.

**Proof.**

*   “ $\Rightarrow$ ”  
    If  $g\in\partial f(x)$ , then for all  $y$ ,
    $$
    f(y)\ge f(x)+g^\top(y-x).
    $$
    Now take any  $(y,t)\in\mathrm{epi}(f)$ . Then  $t\ge f(y)$ , so
    $$
    t\ge f(y)\ge f(x)+g^\top(y-x)
    $$
    which rearranges to
    $$
    g^\top(y-x) - (t-f(x)) \le 0.
    $$
    That is exactly
    $$
    (g,-1)^\top\big((y,t)-(x,f(x))\big)\le 0\quad \forall (y,t)\in\mathrm{epi}(f),
    $$
    i.e.  $(g,-1)\in N_{\mathrm{epi}(f)}((x,f(x)))$ .
*   “ $\Leftarrow$ ”  
    If  $(g,-1)\in N_{\mathrm{epi}(f)}((x,f(x)))$ , then the inequality above holds for all  $(y,t)\in\mathrm{epi}(f)$ . Plug in  $t=f(y)$  (which is allowed whenever  $y\in\mathrm{dom}(f)$ , since  $(y,f(y))\in\mathrm{epi}(f)$ ). You get
    $$
    g^\top(y-x) - (f(y)-f(x)) \le 0,
    $$
    i.e.
    $$
    f(y)\ge f(x)+g^\top(y-x),
    $$
    so  $g\in\partial f(x)$ . ∎

This equivalence is _the_ reason subgradients and normal cones are really the same geometric object seen from different angles.

* * *

2) Differentiable convex ⇒ the subdifferential is a singleton
=============================================================

Theorem
-------

If  $f$  is convex and differentiable at  $x\in\mathrm{dom}(f)$ , then

 $$
\boxed{\ \partial f(x)=\{\nabla f(x)\}. }
$$

### Proof (fully explicit)

**Step 1: show  $\nabla f(x)\in\partial f(x)$ .**  
Convex + differentiable implies the first-order supporting inequality (Module 13):

$$
f(y)\ge f(x)+\nabla f(x)^\top(y-x)\quad\forall y\in\mathrm{dom}(f).
$$

So  $\nabla f(x)$  satisfies the subgradient inequality.

**Step 2: show no other subgradient exists.**  
Let  $g\in\partial f(x)$ . Fix any direction  $d\in\mathbb R^n$ . For small  $t>0$  with  $x+td\in\mathrm{dom}(f)$ ,  
apply the subgradient inequality to  $y=x+td$ :

$$
f(x+td)\ge f(x)+g^\top(td).
$$

Divide by  $t>0$ :

$$
\frac{f(x+td)-f(x)}{t}\ge g^\top d.
$$

Let  $t\downarrow 0$ . Because  $f$  is differentiable at  $x$ ,

$$
\lim_{t\downarrow 0}\frac{f(x+td)-f(x)}{t}=Df(x;d)=\nabla f(x)^\top d.
$$

So

$$
\nabla f(x)^\top d \ge g^\top d\quad\forall d.
$$

Apply the same reasoning with direction  $-d$ :

$$
\nabla f(x)^\top(-d)\ge g^\top(-d) \quad\Rightarrow\quad \nabla f(x)^\top d \le g^\top d.
$$

Therefore  $\nabla f(x)^\top d=g^\top d$  for all  $d$ , which forces  $g=\nabla f(x)$ . ∎

* * *

3) Unconstrained optimality:  $0\in\partial f(x^\star)$ 
========================================================

Theorem (global minimizer test)
-------------------------------

Let  $f$  be convex. For  $x^\star\in\mathrm{dom}(f)$ ,

 $$
\boxed{\ x^\star\text{ minimizes }f\quad\Longleftrightarrow\quad 0\in\partial f(x^\star). }
$$

### Proof

*   “ $\Rightarrow$ ” If  $x^\star$  is a minimizer, then  $f(y)\ge f(x^\star)$  for all  $y$ . Rewrite as
    $$
    f(y)\ge f(x^\star)+0^\top(y-x^\star),
    $$
    so  $0$  satisfies the subgradient inequality.
*   “ $\Leftarrow$ ” If  $0\in\partial f(x^\star)$ , then
    $$
    f(y)\ge f(x^\star)+0^\top(y-x^\star)=f(x^\star),
    $$
    so  $x^\star$  is globally optimal. ∎

This is the nonsmooth replacement of  $\nabla f(x^\star)=0$ .

* * *

4) Canonical subdifferentials you must be able to compute
=========================================================

4.1 Absolute value on  $\mathbb R$ :  $f(t)=|t|$ 
-------------------------------------------------

$$
\boxed{ \partial |t|= \begin{cases} \{1\}, & t>0,\\ [-1,1], & t=0,\\ \{-1\}, & t<0. \end{cases}}
$$

**Proof at  $t=0$ ** (the only nontrivial point):  
We need all  $g$  such that for all  $y\in\mathbb R$ ,

$$
|y|\ge 0 + g(y-0)=gy.
$$

For  $y>0$ :  $y\ge gy\Rightarrow g\le 1$ .  
For  $y<0$ :  $-y\ge gy\Rightarrow g\ge -1$ .  
So  $-1\le g\le 1$ . Conversely any  $g\in[-1,1]$  satisfies  $|y|\ge gy$  by checking  $y\ge0$  and  $y\le0$  separately. ∎

* * *

4.2  $\ell_1$  norm:  $f(x)=\|x\|_1=\sum_i |x_i|$ 
--------------------------------------------------

Because this is a sum of 1D convex functions in separable coordinates, the subdifferential is coordinatewise:

 $$
\boxed{\ \partial \|x\|_1 = \{g\in\mathbb R^n:\ g_i\in\partial |x_i|\ \forall i\}. }
$$

So:

*   if  $x_i>0$ ,  $g_i=1$ ;
*   if  $x_i<0$ ,  $g_i=-1$ ;
*   if  $x_i=0$ ,  $g_i\in[-1,1]$ .

(Why “sum splits” is true is a subdifferential calculus rule; the full general sum rule needs a regularity condition. For separable sums like  $\sum_i |x_i|$ , you can prove the formula directly by applying the 1D inequality coordinatewise and summing.)

* * *

4.3 Max of affine functions:  $f(x)=\max_{i=1,\dots,m} a_i^\top x$ 
-------------------------------------------------------------------

Define the **active set**

$$
I(x):=\{i:\ a_i^\top x = \max_j a_j^\top x\}.
$$

Then the workhorse formula is:

 $$
\boxed{\ \partial f(x) = \mathrm{conv}\{a_i:\ i\in I(x)\}. }
$$

This is so important that it deserves a real proof, not vibes.

### Proof (two inclusions)

#### Inclusion A:  $\mathrm{conv}\{a_i:i\in I(x)\}\subseteq \partial f(x)$ 

Pick any convex combination of active vectors:

$$
g=\sum_{i\in I(x)} \theta_i a_i,\qquad \theta_i\ge0,\ \sum_{i\in I(x)}\theta_i=1.
$$

For any  $y$ ,

$$
f(y)=\max_j a_j^\top y \ \ge\ \sum_{i\in I(x)}\theta_i a_i^\top y = g^\top y.
$$

Also, since each  $i\in I(x)$  is active,  $a_i^\top x=f(x)$ , so

$$
g^\top x = \sum_{i\in I(x)}\theta_i a_i^\top x = \sum_{i\in I(x)}\theta_i f(x) = f(x).
$$

Therefore for any  $y$ ,

$$
f(y)\ge g^\top y = g^\top x + g^\top(y-x)= f(x)+g^\top(y-x),
$$

which is exactly the subgradient inequality. Hence  $g\in\partial f(x)$ .

#### Inclusion B:  $\partial f(x)\subseteq \mathrm{conv}\{a_i:i\in I(x)\}$ 

This is the subtler direction.

Consider the epigraph:

$$
\mathrm{epi}(f)=\{(y,t): t\ge a_i^\top y\ \forall i\} =\bigcap_{i=1}^m \{(y,t): t-a_i^\top y\ge 0\}.
$$

So it’s an intersection of halfspaces in  $\mathbb R^{n+1}$ , hence a **polyhedron**.

At the point  $(x,f(x))$ , the active constraints are exactly those with  $i\in I(x)$ , because

$$
f(x)=a_i^\top x \iff t-a_i^\top y = 0 \text{ at }(x,f(x)).
$$

A standard (and provable) fact for polyhedra: the normal cone at a point is the **conic hull of active constraint normals**.  
Here each constraint  $t-a_i^\top y\ge0$  has normal vector  $(a_i,-1)$ . Thus

$$
N_{\mathrm{epi}(f)}((x,f(x))) = \mathrm{cone}\{(a_i,-1): i\in I(x)\}.
$$

Now use the epigraph-normal equivalence from §1.3:

$$
g\in\partial f(x) \iff (g,-1)\in N_{\mathrm{epi}(f)}((x,f(x))).
$$

So if  $g\in\partial f(x)$ , then

$$
(g,-1)=\sum_{i\in I(x)} \lambda_i (a_i,-1) \quad\text{with }\lambda_i\ge0.
$$

Compare last coordinates:  $-1=\sum_{i\in I(x)} \lambda_i(-1)$ , so

$$
\sum_{i\in I(x)}\lambda_i = 1.
$$

Therefore

$$
g=\sum_{i\in I(x)}\lambda_i a_i, \qquad \lambda_i\ge0,\ \sum\lambda_i=1,
$$

i.e.  $g\in\mathrm{conv}\{a_i: i\in I(x)\}$ .

Combine A and B: equality holds. ∎

* * *

5) Indicator functions: constraints as functions
================================================

5.1 Definition
--------------

For a set  $C\subseteq\mathbb R^n$ ,

$$
\boxed{ I_C(x)= \begin{cases} 0, & x\in C,\\ +\infty, & x\notin C. \end{cases}}
$$

5.2 Convexity equivalence
-------------------------

 $$
\boxed{\ I_C \text{ is convex}\quad\Longleftrightarrow\quad C\text{ is convex}. }
$$

Reason (epigraph view):

$$
\mathrm{epi}(I_C)=\{(x,t): x\in C,\ t\ge 0\}=C\times[0,\infty),
$$

and that set is convex iff  $C$  is convex.

5.3 Exact constrained↔unconstrained equivalence
-----------------------------------------------

$$
\min_{x\in C} f(x) \quad\Longleftrightarrow\quad \boxed{\ \min_x \big(f(x)+I_C(x)\big). }
$$

Points outside  $C$  get objective  $+\infty$ , so they can’t be optimal; points inside see the original  $f$ .

This “trick” is actually _the_ clean language that makes KKT inevitable.

* * *

6) Normal cones: the subgradients of indicator functions
========================================================

6.1 Definition (normal cone)
----------------------------

Let  $C\subseteq\mathbb R^n$  be **closed and convex**. For  $x\in C$ , define

 $$
\boxed{\ N_C(x):=\{v\in\mathbb R^n:\ v^\top(y-x)\le 0\ \forall y\in C\}. }
$$

If  $x\notin C$ , set  $N_C(x)=\emptyset$ .

**Meaning:**  $v\in N_C(x)$  is an outward normal: every feasible direction  $y-x$  makes a non-acute angle with  $v$ .

This matches Module 15’s projection inequality: if  $p=\Pi_C(x_0)$ , then  $x_0-p\in N_C(p)$ .

* * *

6.2 The key identity:  $\partial I_C(x)=N_C(x)$ 
------------------------------------------------

### Theorem

If  $C$  is closed convex and  $x\in C$ , then

 $$
\boxed{\ \partial I_C(x)=N_C(x). }
$$

### Proof

Let  $g\in\partial I_C(x)$ . By definition:

$$
I_C(y)\ge I_C(x)+g^\top(y-x)\quad\forall y.
$$

Since  $x\in C$ ,  $I_C(x)=0$ .

*   If  $y\in C$ , then  $I_C(y)=0$ , so
    $$
    0\ge g^\top(y-x)\quad\forall y\in C,
    $$
    i.e.  $g\in N_C(x)$ .
*   If  $y\notin C$ , then  $I_C(y)=+\infty$  and the inequality is automatic.

So  $\partial I_C(x)\subseteq N_C(x)$ .

Conversely, if  $g\in N_C(x)$ , then for  $y\in C$ ,

$$
I_C(y)=0\ge 0+g^\top(y-x)=I_C(x)+g^\top(y-x),
$$

and for  $y\notin C$  the inequality is again automatic. So  $g\in\partial I_C(x)$ .  
Hence  $N_C(x)\subseteq\partial I_C(x)$ . ∎

* * *

7) The master constrained optimality condition
==============================================

Consider the convex problem

$$
\min_{x\in C} f(x),
$$

with  $f$  convex and  $C$  closed convex.

Rewrite as  $\min_x (f(x)+I_C(x))$ . Unconstrained optimality gives

$$
0\in \partial(f+I_C)(x^\star).
$$

To turn this into  $0\in\partial f(x^\star)+N_C(x^\star)$ , you need a **subdifferential sum rule**. The full general theorem (Moreau–Rockafellar) has a real regularity condition (a constraint qualification), e.g.

$$
\mathrm{ri}(\mathrm{dom}f)\cap \mathrm{ri}(C)\neq\emptyset,
$$

or “one term is continuous at a point in the domain intersection.”

*   The **easy always-true inclusion** is:
    $$
    \partial f(x)+\partial I_C(x)\subseteq \partial(f+I_C)(x).
    $$
*   The **reverse inclusion** (equality) is what needs the regularity condition.

So, under standard convex-optimization regularity:

 $$
\boxed{\ 0\in \partial f(x^\star)+\partial I_C(x^\star) =\partial f(x^\star)+N_C(x^\star). }
$$

**Interpretation:** there exists a subgradient  $g\in\partial f(x^\star)$  such that  $-g$  is a normal to  $C$  at  $x^\star$ . That’s exactly “objective support + constraint boundary support balance.”

* * *

8) Normal cones you should recognize on sight
=============================================

8.1 Halfspace  $C=\{x:\ a^\top x\le b\}$ ,  $a\neq 0$ 
------------------------------------------------------

*   If  $a^\top x<b$  (interior), then  $N_C(x)=\{0\}$ .
*   If  $a^\top x=b$  (boundary), then
     $$
    \boxed{\ N_C(x)=\{\lambda a:\ \lambda\ge 0\}. }
    $$

This is where “ $\lambda\ge0$ ” multipliers come from: outward normals are nonnegative multiples of the constraint normal.

8.2 Affine set  $C=\{x:\ Ax=b\}$ 
---------------------------------

Then the “outward” concept becomes “orthogonal to all feasible directions.” The normal cone is the orthogonal complement of the tangent space:

 $$
\boxed{\ N_C(x)=\{A^\top \nu:\ \nu\in\mathbb R^m\}\quad\text{for }x\in C. }
$$

No sign restriction: equality constraints allow normals in both directions.

8.3 Nonnegative orthant  $C=\mathbb R_+^n$ 
-------------------------------------------

For  $x\ge0$ ,

$$
\boxed{ N_{\mathbb R_+^n}(x) = \{v:\ v_i=0\ \text{if }x_i>0,\ \ v_i\le 0\ \text{if }x_i=0\}. }
$$

This is complementary slackness geometry in embryo:

*   if  $x_i>0$ , you’re not on that boundary ⇒ no normal component allowed ⇒  $v_i=0$ ;
*   if  $x_i=0$ , you’re on the boundary ⇒ normal may point outward ⇒  $v_i\le0$ .

* * *

9) How KKT drops out of  $0\in\partial f(x^\star)+N_C(x^\star)$ 
================================================================

Take constraints

$$
g_i(x)\le 0,\ i=1,\dots,m,\qquad Ax=b,
$$

with each  $g_i$  convex and differentiable (for simplicity of the final form).

Let

$$
C=\{x:\ g_i(x)\le 0\ \forall i,\ Ax=b\}.
$$

At a point  $x^\star\in C$ , the normal cone  $N_C(x^\star)$  is generated by:

*   equality normals  $A^\top\nu$ ,
*   active inequality normals  $\lambda_i \nabla g_i(x^\star)$  with  $\lambda_i\ge0$ , and  $\lambda_i=0$  when  $g_i(x^\star)<0$ .

So the condition

$$
0\in\partial f(x^\star)+N_C(x^\star)
$$

becomes, when  $f$  is differentiable,

$$
\boxed{ \nabla f(x^\star) + A^\top \nu + \sum_{i=1}^m \lambda_i \nabla g_i(x^\star)=0, }
$$

with

 $$
\boxed{\ \lambda_i\ge 0,\quad g_i(x^\star)\le 0,\quad \lambda_i g_i(x^\star)=0,\quad Ax^\star=b. }
$$

That is exactly the KKT system.  
So the multipliers  $\lambda,\nu$  are nothing mystical: they are coordinates of a normal vector in a cone spanned by active constraint gradients.

* * *

10) End-of-Module 17 checklist (must be automatic)
==================================================

You can:

1.  Define  $\partial f(x)$  and interpret it as supporting hyperplanes to  $\mathrm{epi}(f)$ .
2.  Prove differentiable convex ⇒  $\partial f(x)=\{\nabla f(x)\}$ .
3.  Prove  $x^\star$  minimizes convex  $f$  ⇔  $0\in\partial f(x^\star)$ .
4.  Compute exactly:  $\partial|t|$ ,  $\partial\|x\|_1$ , and  $\partial(\max_i a_i^\top x)$  (with a real proof).
5.  Define indicator  $I_C$  and prove  $I_C$  convex ⇔  $C$  convex.
6.  Define normal cone  $N_C(x)$  and prove  $\partial I_C(x)=N_C(x)$ .
7.  Understand constrained optimality as  $0\in\partial f(x^\star)+N_C(x^\star)$  (and know a regularity condition is needed to turn  $\partial(f+I_C)$  into a clean sum).
8.  Recognize normal cones for halfspaces, affine sets, and  $\mathbb R_+^n$ , and see complementary slackness inside them.

* * *

Next module
-----------

**Module 18 — Quasiconvexity via sublevel sets + perspectives.**  
Where you stop forcing Hessians onto problems that want level-set geometry (fractions, ratios, mins/maxes, and BV 4.7–style transformations).

## Prompt:
Now  this:

# Module 18 — Quasiconvex / quasiconcave via level sets

*(when convexity is too strict, but the geometry is still nice enough to optimize)*

## 0) What this module is secretly doing

Convexity is a *function inequality*:
[
f((1-t)x+ty)\le (1-t)f(x)+t f(y).
]
That’s strong. Many useful objectives (ratios, maxima of ratios, norms in denominators, etc.) fail it.

Quasiconvexity is weaker and more geometric:

> (f) is quasiconvex iff all its **sublevel sets** ({x: f(x)\le \alpha}) are convex.

This matters because many optimization problems only need convexity of **feasible sets** (sublevel sets), not convexity of the function value itself.

And it’s exactly why fractional programs and “minimize a maximum” structures often become tractable: you solve them by **bisection** on (\alpha) with convex feasibility checks.

---

# 1) Definitions (precise, with domain honesty)

Let (f:\mathbb R^n\to\mathbb R\cup{+\infty}). Define for each (\alpha\in\mathbb R) the **sublevel set**
[
S_\alpha := {x\in\mathrm{dom}(f): f(x)\le \alpha}.
]
(We restrict to the domain; if you use extended values, (f(x)=+\infty) outside domain automatically excludes those points.)

## 1.1 Quasiconvex

[
\boxed{\ f\ \text{is quasiconvex}\quad\Longleftrightarrow\quad S_\alpha\ \text{is convex for every }\alpha\in\mathbb R. }
]

## 1.2 Quasiconcave

Similarly, define **superlevel sets**
[
T_\alpha := {x\in\mathrm{dom}(f): f(x)\ge \alpha}.
]
[
\boxed{\ f\ \text{is quasiconcave}\quad\Longleftrightarrow\quad T_\alpha\ \text{is convex for every }\alpha. }
]

## 1.3 Quasilinear

(f) is **quasilinear** if it is both quasiconvex and quasiconcave.
Equivalent: all level sets ({x: f(x)=\alpha}) are convex (and more strongly sub- and superlevel sets are convex).

---

# 2) Basic equivalence: “max inequality” characterization (the 2-point condition)

This is the analog of the convexity inequality, but with (\max) instead of linear interpolation.

## Theorem (quasiconvex 2-point characterization)

Assume (\mathrm{dom}(f)) is convex. Then (f) is quasiconvex iff for all (x,y\in\mathrm{dom}(f)) and all (t\in[0,1]),
[
\boxed{\ f((1-t)x+ty)\ \le\ \max{f(x),f(y)}. }
]

### Proof (⇒)

Assume quasiconvex: all sublevel sets (S_\alpha) are convex.

Fix (x,y) and let (\alpha=\max{f(x),f(y)}). Then (x\in S_\alpha) and (y\in S_\alpha). Convexity of (S_\alpha) implies ((1-t)x+ty\in S_\alpha). So
[
f((1-t)x+ty)\le \alpha=\max{f(x),f(y)}.
]

### Proof (⇐)

Assume the max-inequality holds. We show each (S_\alpha) is convex.

Take any (x,y\in S_\alpha). Then (f(x)\le\alpha) and (f(y)\le\alpha), so (\max{f(x),f(y)}\le\alpha). For any (t\in[0,1]),
[
f((1-t)x+ty)\le \max{f(x),f(y)}\le \alpha.
]
Thus ((1-t)x+ty\in S_\alpha). Hence (S_\alpha) is convex. ∎

**Commentary:**
Convexity says “value at midpoint ≤ average of values.”
Quasiconvexity says “value at midpoint ≤ worse endpoint.”
That’s exactly what you need for “upper contour sets” to be convex.

---

# 3) Convex ⇒ quasiconvex (and concave ⇒ quasiconcave)

## Proposition

If (f) is convex, then (f) is quasiconvex.

### Proof

Convexity gives
[
f((1-t)x+ty)\le (1-t)f(x)+t f(y)\le \max{f(x),f(y)},
]
since a convex combination of two numbers is always ≤ their maximum. Apply the 2-point characterization. ∎

Similarly, if (f) is concave then it is quasiconcave.

**So quasiconvexity is a strictly weaker property.** Many nonconvex functions are quasiconvex.

---

# 4) Why quasiconvex optimization is solvable: bisection + convex feasibility

Consider the problem:
[
\min_{x\in C} f(x)
]
where:

* (C) is convex,
* (f) is quasiconvex.

Define the value
[
p^\star := \inf_{x\in C} f(x).
]

Key observation:
[
{x\in C: f(x)\le \alpha} = C\cap S_\alpha
]
is convex (intersection of convex sets), and feasibility of this set tells you whether (p^\star\le \alpha).

So you solve by **bisection** on (\alpha):

* pick (\alpha),
* check if there exists (x\in C) with (f(x)\le\alpha) (convex feasibility),
* shrink interval.

**This is exactly how fractional programs are handled in practice.**

---

# 5) Fractional functions: the canonical quasiconvex pattern

## 5.1 The basic template

Let (a(x)) be convex, (b(x)) be concave and positive: (b(x)>0) on the domain. Consider
[
f(x)=\frac{a(x)}{b(x)}.
]
This is typically **not convex**. But it is often **quasiconvex** under these conditions.

### Theorem (standard sufficient condition)

If (a) is convex, (b) is concave, and (b(x)>0) on a convex domain, then
[
f(x)=\frac{a(x)}{b(x)}
]
is quasiconvex.

### Proof (via sublevel sets)

Take any (\alpha\in\mathbb R). Consider:
[
S_\alpha=\left{x:\frac{a(x)}{b(x)}\le\alpha\right}.
]
Because (b(x)>0), we can multiply without flipping inequality:
[
\frac{a(x)}{b(x)}\le\alpha
\iff a(x)\le \alpha b(x)
\iff a(x)-\alpha b(x)\le 0.
]
Define
[
h_\alpha(x):=a(x)-\alpha b(x).
]
Now:

* (a(x)) is convex.
* (b(x)) is concave, so (-b(x)) is convex.
* For (\alpha\ge 0), (-\alpha b(x)) is convex, so (h_\alpha) is convex as sum of convex functions.

Then
[
S_\alpha={x: h_\alpha(x)\le 0}
]
is a **sublevel set of a convex function**, hence convex.

So for all (\alpha\ge 0), (S_\alpha) is convex. That gives quasiconvexity on the relevant range of (\alpha) for minimization (typically optimum is ≥0 in common cases like norms/energies). ∎

**Important edge case:** if (\alpha<0), the sign flips convexity of (-\alpha b(x)). So the clean statement is: sublevel sets are convex for all (\alpha) in a certain range (often (\alpha\ge 0)), which is usually enough because you can bound the optimal value and bisection within that interval.

This “(\alpha)-dependent convexity” is one of the main subtleties in quasiconvex proofs.

---

# 6) Another huge pattern: maxima preserve quasiconvexity

## Proposition

If (f_i) are quasiconvex, then
[
f(x)=\max_i f_i(x)
]
is quasiconvex.

### Proof (sublevel sets)

[
{x: \max_i f_i(x)\le \alpha}
============================

\bigcap_i {x: f_i(x)\le \alpha}.
]
Intersection of convex sets is convex. ∎

**Why this matters:**
Many robust problems are “minimize the worst case,” i.e. minimize a maximum; quasiconvex structure survives.

---

# 7) Quasiconcavity and “utilities”

Quasiconcavity is the right property for “preferences / utilities”: superlevel sets ({x: f(x)\ge\alpha}) being convex means “mixing two bundles that are both at least (\alpha)-good yields a bundle that is also at least (\alpha)-good.”

Economics uses quasiconcavity constantly (convex upper contour sets). Convex optimization uses it when maximizing concave functions (which are automatically quasiconcave), but quasiconcavity alone can still give tractable feasible-set geometry in some formulations.

---

# 8) End-of-Module 18 checklist (if these aren’t automatic, don’t advance)

You can:

1. Define quasiconvex/quasiconcave in terms of sublevel/superlevel sets.
2. Prove the 2-point max-inequality characterization.
3. Prove convex ⇒ quasiconvex.
4. Explain why quasiconvex minimization is solvable by bisection + convex feasibility.
5. Prove quasiconvexity of the fractional form by transforming sublevel sets into convex inequalities (with correct attention to the sign of (\alpha) and positivity of denominator).
6. Prove that max of quasiconvex functions is quasiconvex.

---

## Next module

**Module 19 — Conjugates, support functions, Fenchel–Young (the missing engine).**
This is where duality stops being “Lagrangian symbol pushing” and becomes a systematic machine: conjugates turn constraints into support functions and produce duals almost automatically.

3/3

## Response:
Thought for 1m 1s

Module 18 — Quasiconvex / quasiconcave via level sets
=====================================================

_(when convexity is too strict, but the geometry is still nice enough to optimize)_

0) What this module is secretly doing
-------------------------------------

Convexity is a **value inequality**:

$$
f((1-t)x+ty)\le (1-t)f(x)+t f(y).
$$

That controls function values very tightly.

Quasiconvexity is weaker and more “feasible-set” flavored:

>  $f$  is quasiconvex iff every **sublevel set**  $\{x: f(x)\le \alpha\}$  is convex.

This is exactly what optimization often needs, because solving  
 $\min f(x)$  can be reduced to repeatedly asking a **yes/no question**:

$$
\text{“Is there an }x\text{ with } f(x)\le \alpha\text{?”}
$$

If that feasible set is convex for each  $\alpha$ , we can solve the problem by **bisection** on  $\alpha$  plus convex feasibility checks.

* * *

1) Definitions (precise, domain-honest, extended-value clean)
=============================================================

Let  $f:\mathbb R^n\to\mathbb R\cup\{+\infty\}$ . Define the **sublevel set** at level  $\alpha\in\mathbb R$ :

$$
S_\alpha \;:=\;\{x\in\mathbb R^n:\ f(x)\le \alpha\}.
$$

Because we allow  $+\infty$ , points outside the effective domain automatically satisfy  $f(x)\le\alpha$  **false**, so they are excluded without needing to manually intersect with  $\mathrm{dom}(f)$ .

Similarly define the **superlevel set**

$$
T_\alpha \;:=\;\{x\in\mathbb R^n:\ f(x)\ge \alpha\}.
$$

### 1.1 Quasiconvex

 $$
\boxed{\ f\ \text{is quasiconvex}\ \Longleftrightarrow\ S_\alpha\ \text{is convex for every }\alpha\in\mathbb R.\ }
$$

### 1.2 Quasiconcave

 $$
\boxed{\ f\ \text{is quasiconcave}\ \Longleftrightarrow\ T_\alpha\ \text{is convex for every }\alpha\in\mathbb R.\ }
$$

### 1.3 Quasilinear

 $f$  is **quasilinear** if it is both quasiconvex and quasiconcave. Equivalently: all level sets  $\{x: f(x)=\alpha\}$  are convex (and in fact all sub- and superlevel sets are convex).

* * *

1.4 A small but important lemma: quasiconvexity forces convex domain (when proper)
----------------------------------------------------------------------------------

People often assume  $\mathrm{dom}(f)$  is convex in statements. For quasiconvex functions, that’s basically automatic as soon as  $f$  is not degenerate.

**Lemma.** If  $f$  is quasiconvex and **proper** (i.e.  $\mathrm{dom}(f)\neq\emptyset$  and never  $-\infty$ ), then  $\mathrm{dom}(f)$  is convex.

**Proof.** Take any  $x,y\in\mathrm{dom}(f)$ . Then  $f(x),f(y)$  are finite. Let  $\alpha=\max\{f(x),f(y)\}$ . Then  $x,y\in S_\alpha$ . Since  $S_\alpha$  is convex,  $(1-t)x+ty\in S_\alpha$  for all  $t\in[0,1]$ , hence  $f((1-t)x+ty)\le \alpha<\infty$ . Therefore  $(1-t)x+ty\in\mathrm{dom}(f)$ . ∎

So you can treat “domain convexity” as a consequence (not an extra axiom) in most sane settings.

* * *

2) The 2-point “max” characterization
=====================================

This is the quasiconvex analog of the convexity inequality.

Theorem (2-point characterization)
----------------------------------

For a proper  $f$ , the following are equivalent:

1.   $f$  is quasiconvex.
2.  For all  $x,y\in\mathrm{dom}(f)$  and all  $t\in[0,1]$ ,
     $$
    \boxed{\ f((1-t)x+ty)\ \le\ \max\{f(x),f(y)\}. }
    $$

### Proof

**(1 ⇒ 2).**  
Assume quasiconvex. Fix  $x,y\in\mathrm{dom}(f)$ . Set  $\alpha=\max\{f(x),f(y)\}$ . Then  $x,y\in S_\alpha$ . Convexity of  $S_\alpha$  implies  $(1-t)x+ty\in S_\alpha$ , i.e.

$$
f((1-t)x+ty)\le \alpha=\max\{f(x),f(y)\}.
$$

**(2 ⇒ 1).**  
Assume the max inequality holds. Fix any  $\alpha\in\mathbb R$ . Take any  $x,y\in S_\alpha$ . Then  $f(x)\le\alpha$  and  $f(y)\le\alpha$ , so  $\max\{f(x),f(y)\}\le\alpha$ . For any  $t\in[0,1]$ ,

$$
f((1-t)x+ty)\le \max\{f(x),f(y)\}\le\alpha,
$$

so  $(1-t)x+ty\in S_\alpha$ . Thus  $S_\alpha$  is convex. ∎

**Interpretation.**  
Convexity: “midpoint ≤ average.”  
Quasiconvexity: “midpoint ≤ worse endpoint.”  
That’s exactly the geometry needed for convex sublevel sets.

* * *

3) Relations to convexity/concavity, and closure rules
======================================================

3.1 Convex ⇒ quasiconvex (and concave ⇒ quasiconcave)
-----------------------------------------------------

**Proposition.** If  $f$  is convex, then  $f$  is quasiconvex.

**Proof.** For  $t\in[0,1]$ ,

$$
f((1-t)x+ty)\le (1-t)f(x)+t f(y)\le \max\{f(x),f(y)\}.
$$

Apply the 2-point characterization. ∎

Similarly, concave ⇒ quasiconcave.

**Strictness:** quasiconvex is genuinely weaker. Example in 1D:  $f(t)=t^3$  is not convex on  $\mathbb R$  (second derivative changes sign), but it _is_ quasilinear (strictly increasing ⇒ all sub- and superlevel sets are intervals).

* * *

3.2 Max preserves quasiconvexity (min does not, in general)
-----------------------------------------------------------

**Proposition.** If each  $f_i$  is quasiconvex, then  $f(x)=\max_i f_i(x)$  is quasiconvex.

**Proof.**

$$
\{x:\ \max_i f_i(x)\le \alpha\}=\bigcap_i \{x:\ f_i(x)\le \alpha\}.
$$

Each set on the right is convex, and intersections of convex sets are convex. ∎

**Warning:**  $\min_i f_i$  need not be quasiconvex. (Sublevel sets of a minimum are unions, and unions of convex sets need not be convex.)

* * *

3.3 Monotone composition rule (very useful)
-------------------------------------------

If  $g$  is quasiconvex and  $\phi:\mathbb R\to\mathbb R$  is **nondecreasing**, then  $\phi\circ g$  is quasiconvex.

Reason:  $\{x:\phi(g(x))\le \alpha\}=\{x:\ g(x)\le \phi^{-1}(\alpha)\}$  (formally via preimages of intervals), so it’s a sublevel set of  $g$ .

Similarly: if  $g$  is quasiconcave and  $\phi$  is nondecreasing, then  $\phi\circ g$  is quasiconcave.

* * *

4) Why quasiconvex minimization is “solvable”: bisection + convex feasibility
=============================================================================

Consider

$$
\min_{x\in C} f(x),
$$

with  $C$  convex and  $f$  quasiconvex. Define the optimal value

$$
p^\star := \inf_{x\in C} f(x).
$$

For any scalar  $\alpha$ , define the feasibility set

$$
F(\alpha):=\{x\in C:\ f(x)\le \alpha\}=C\cap S_\alpha.
$$

Because  $C$  is convex and  $S_\alpha$  is convex (quasiconvexity),  $F(\alpha)$  is convex.

Now observe the monotonicity:

*   If  $F(\alpha)$  is nonempty, then  $p^\star\le \alpha$ .
*   If  $F(\alpha)$  is empty, then  $p^\star>\alpha$ .

So we can locate  $p^\star$  by bisection, as long as we have:

1.  **an interval**  $[L,U]$  with  $F(L)=\emptyset$  and  $F(U)\neq\emptyset$  (or at least  $L\le p^\star \le U$ ),
2.  **a convex feasibility oracle**: given  $\alpha$ , decide if  $F(\alpha)\neq\emptyset$  and (ideally) produce a feasible  $x$  if it exists.

### Bisection algorithm (conceptual)

*   Maintain  $[L,U]$ .
*   Set  $\alpha=(L+U)/2$ .
*   Solve the convex feasibility problem: find  $x\in C$  with  $f(x)\le \alpha$ .
    *   If feasible: update  $U\leftarrow \alpha$  (and store the  $x$  as current best).
    *   If infeasible: update  $L\leftarrow \alpha$ .
*   Stop when  $U-L\le \varepsilon$ .

**Iteration count:**  $O(\log_2((U-L)/\varepsilon))$ .

### Practical gotchas (these matter in real solvers)

*   You typically need level sets that are not just convex but also “nicely closed” to avoid numerical weirdness. Lower semicontinuity helps.
*   Feasibility solvers return “infeasible” with tolerances; you must treat the bisection stopping rule as approximate.
*   Getting an initial upper bound  $U$  is usually easy: pick any  $x\in C$  you can construct, then  $U=f(x)$ . Lower bounds can be harder; sometimes you just pick a crude  $L$  and expand until infeasible/feasible bracketing works.

* * *

5) Fractional functions: the canonical quasiconvex template
===========================================================

The most common reason you care about quasiconvexity is ratios.

Let  $a(x)$  and  $b(x)$  be real-valued on a convex set  $D$ , with  $b(x)>0$  on  $D$ . Consider

$$
f(x)=\frac{a(x)}{b(x)}.
$$

### 5.1 The sublevel-set trick (the core move)

For any  $\alpha$ ,

$$
\frac{a(x)}{b(x)}\le \alpha \quad\Longleftrightarrow\quad a(x)\le \alpha\, b(x) \quad(\text{because }b(x)>0) \quad\Longleftrightarrow\quad a(x)-\alpha b(x)\le 0.
$$

So

$$
S_\alpha = \{x:\ a(x)-\alpha b(x)\le 0\}.
$$

Now we ask: when is  $h_\alpha(x):=a(x)-\alpha b(x)$  convex so that its sublevel set is convex?

### 5.2 A clean sufficient condition (and the  $\alpha$ \-sign subtlety)

*   If  $a$  is convex, and  $b$  is **concave**, then  $-b$  is convex.
*   For  $\alpha\ge 0$ ,  $-\alpha b$  is convex (nonnegative scaling preserves convexity), so
    $$
    h_\alpha(x)=a(x)+(-\alpha b(x))
    $$
    is convex.

Therefore  $S_\alpha$  is convex for all  $\alpha\ge 0$ . This is often enough for minimization because many ratio objectives are nonnegative (norms, energies, costs).

**Important honesty:** for  $\alpha<0$ , the term  $-\alpha b(x)=|\alpha|\, b(x)$  is a **positive multiple of a concave function**, which is concave, not convex, so  $h_\alpha$  may fail to be convex. So you do **not** get “all  $\alpha$ ” quasiconvexity for free in this generality.

### 5.3 When you _do_ get full quasiconvexity: affine denominator

If  $b$  is **affine** and positive on  $D$ , then  $b$  is both convex and concave, and  $\alpha b$  is affine for all  $\alpha\in\mathbb R$ . Hence

$$
h_\alpha(x)=a(x)-\alpha b(x)
$$

is convex for all  $\alpha$  whenever  $a$  is convex. That yields genuine quasiconvexity (all  $\alpha$ ).

This special case covers a lot of “convex / linear” fractional programs.

* * *

5.4 The most important special case: linear-fractional is quasilinear
---------------------------------------------------------------------

Let

$$
f(x)=\frac{a^\top x + b}{c^\top x + d}, \quad\text{with }c^\top x+d>0\text{ on the domain}.
$$

Then for any  $\alpha$ ,

$$
f(x)\le \alpha \iff a^\top x+b \le \alpha(c^\top x + d) \iff (a-\alpha c)^\top x \le \alpha d - b,
$$

which is a **halfspace**. So all sublevel sets are halfspaces (convex), and similarly superlevel sets are halfspaces. Therefore linear-fractional functions are **quasilinear**.

This is why “ratio of affine things” behaves absurdly well.

* * *

6) Quasiconcavity and economics intuition (brief but sharp)
===========================================================

Quasiconcavity means **superlevel sets are convex**:

$$
\{x:\ f(x)\ge \alpha\}\ \text{ convex}.
$$

In microeconomics, that’s exactly “convex upper contour sets”: if two bundles are at least  $\alpha$ \-good, then mixing them keeps you at least  $\alpha$ \-good.

Concave utility ⇒ quasiconcave, but quasiconcavity alone is often the natural primitive assumption for “preferences with taste for diversification” without demanding full concavity.

* * *

7) Edge cases and “don’t get tricked” notes
===========================================

1.  **Empty sublevel sets are convex.** If  $\alpha<\inf f$ , then  $S_\alpha=\emptyset$ , and that’s convex by definition. So quasiconvexity doesn’t care about very low  $\alpha$ .
2.  **Denominator positivity is not optional in fractional proofs.** If  $b(x)$  can change sign, multiplying inequalities can flip direction and destroy convexity claims.
3.  **Quasiconvex ≠ easy gradients.** A differentiable quasiconvex function can still be nonconvex, so Hessians won’t help; level-set geometry is the correct tool.

(There are also first-order characterizations for differentiable quasiconvex functions—gradient is a normal to sublevel sets—but that’s a natural “Module 18.5” or a bridge into KKT-like conditions for quasiconvex programs.)

* * *

8) End-of-Module 18 checklist (if these aren’t automatic, don’t advance)
========================================================================

You can:

1.  Define quasiconvex / quasiconcave via convexity of sublevel / superlevel sets (using extended values cleanly).
2.  Prove the 2-point max inequality characterization:
    $$
    f((1-t)x+ty)\le \max\{f(x),f(y)\}.
    $$
3.  Prove convex ⇒ quasiconvex (and concave ⇒ quasiconcave).
4.  Explain quasiconvex minimization as bisection on  $\alpha$  with convex feasibility checks; give the monotonicity logic  $F(\alpha)\neq\emptyset \iff p^\star\le\alpha$ .
5.  Prove quasiconvexity of common fractional forms by rewriting sublevel sets as
    $$
    a(x)-\alpha b(x)\le 0
    $$
    with correct sign/positivity handling (and know when it only works for  $\alpha\ge 0$ ).
6.  Prove  $\max_i f_i$  is quasiconvex if each  $f_i$  is quasiconvex.

* * *

Next module
-----------

**Module 19 — Conjugates, support functions, Fenchel–Young.**  
This is where duality stops being “Lagrangian symbol pushing” and becomes a machine: conjugates convert geometry (supporting hyperplanes) into algebra (dual objectives) almost automatically.

## Prompt:
Now this:

# Module 19 — Conjugates, support functions, Fenchel–Young

*(the engine that manufactures duality instead of “guessing” it)*

## 0) What this module is secretly doing

If Module 15 taught you “duality = separating hyperplanes,” this module gives you the algebraic machine that *builds those hyperplanes*.

The key object is the **convex conjugate**:
[
f^*(y)=\sup_x \big(y^\top x - f(x)\big).
]
This single definition contains:

* support functions of sets,
* dual norms,
* Fenchel’s inequality,
* Fenchel duality,
* Lagrangian duality as a special case,
* KKT as equality conditions of Fenchel–Young.

If you internalize conjugates, dual derivations stop feeling like magic tricks.

---

# 1) Linear functionals and the “supremum of affine underestimators”

Take any function (f:\mathbb R^n\to\mathbb R\cup{+\infty}). For a fixed (y), the expression
[
y^\top x - f(x)
]
is “how much the linear functional (y^\top x) exceeds the cost (f(x)).”

Taking (\sup_x) asks: **what is the maximum advantage** of using slope (y) against (f)?

That maximum advantage is (f^*(y)).

---

# 2) Convex conjugate: definition and first facts

## 2.1 Definition (Fenchel conjugate)

[
\boxed{\ f^*(y):=\sup_{x\in\mathbb R^n}\big(y^\top x - f(x)\big). }
]
(If (f(x)=+\infty) outside (\mathrm{dom}(f)), this sup effectively runs only over (\mathrm{dom}(f)).)

### Domain of (f^*)

[
\mathrm{dom}(f^*)={y:\ f^*(y)<+\infty}.
]

---

## 2.2 (f^*) is always convex (even if (f) is not)

### Proposition

[
\boxed{\ f^*\ \text{is convex (and lower semicontinuous) as a supremum of affine functions}. }
]

### Proof (convexity)

Fix (x). The map (y\mapsto y^\top x - f(x)) is affine in (y).
A supremum of affine functions is convex:

Take (y_1,y_2) and (\theta\in[0,1]). Then
[
f^*((1-\theta)y_1+\theta y_2)
=\sup_x\big(((1-\theta)y_1+\theta y_2)^\top x - f(x)\big)
]
[
=\sup_x\big((1-\theta)(y_1^\top x - f(x))+\theta(y_2^\top x - f(x))\big)
]
[
\le (1-\theta)\sup_x(y_1^\top x - f(x))+\theta\sup_x(y_2^\top x - f(x))
=(1-\theta)f^*(y_1)+\theta f^*(y_2).
]
So (f^*) is convex. ∎

**Commentary:** dual functions are convex because they are supremums of affine things. That’s why dual optimization problems are convex “for free.”

---

# 3) Fenchel–Young inequality (the fundamental inequality)

## Theorem (Fenchel–Young)

For all (x,y),
[
\boxed{\ f(x)+f^*(y)\ \ge\ y^\top x. }
]

### Proof (one line, but fully justified)

By definition,
[
f^*(y)=\sup_u (y^\top u - f(u)) \ge y^\top x - f(x)
]
since supremum is ≥ the value at (u=x). Rearranging gives:
[
f(x)+f^*(y)\ge y^\top x.
]
∎

### Equality condition (crucial)

Equality holds iff (x) achieves the supremum in the definition of (f^*(y)), i.e.
[
f^*(y)=y^\top x - f(x).
]
This is equivalent to:
[
y \in \partial f(x)
\quad\Longleftrightarrow\quad
x \in \partial f^*(y).
]
We’ll prove the first equivalence now because it’s the KKT “stationarity” in disguise.

---

# 4) Subgradient ↔ conjugate equality (deepest “bridge” fact)

## Theorem

For proper closed convex (f) and (x\in\mathrm{dom}(f)),
[
\boxed{\ y\in\partial f(x)\quad\Longleftrightarrow\quad f(x)+f^*(y)=y^\top x. }
]

### Proof (⇒)

Assume (y\in\partial f(x)). Then for all (u),
[
f(u)\ge f(x)+y^\top(u-x)
\quad\Longleftrightarrow\quad
y^\top u - f(u) \le y^\top x - f(x).
]
So the supremum over (u) of (y^\top u-f(u)) is ≤ (y^\top x-f(x)). But the supremum is always ≥ the value at (u=x), so actually equality:
[
f^*(y)=\sup_u(y^\top u-f(u)) = y^\top x - f(x).
]
Rearrange:
[
f(x)+f^*(y)=y^\top x.
]

### Proof (⇐)

Assume (f(x)+f^*(y)=y^\top x). Since
[
f^*(y)=\sup_u(y^\top u-f(u)),
]
the equality implies
[
\sup_u(y^\top u-f(u)) = y^\top x-f(x).
]
So for all (u),
[
y^\top u - f(u)\le y^\top x - f(x)
\quad\Longleftrightarrow\quad
f(u)\ge f(x)+y^\top(u-x).
]
That is exactly (y\in\partial f(x)). ∎

**Commentary:**
KKT stationarity is often “(\nabla f(x)+A^\top \lambda = 0).”
In conjugate language it’s “a supporting hyperplane achieves equality in Fenchel–Young.”

---

# 5) Biconjugate and convex envelope (ties back to Module 16)

Define the **biconjugate**
[
f^{**}(x)=\sup_y\big(y^\top x - f^*(y)\big).
]

## Theorem (Fenchel–Moreau)

If (f) is proper, closed, convex, then
[
\boxed{\ f^{**}=f. }
]

More generally, for any proper (f),
[
\boxed{\ f^{**} = \text{closed convex envelope of }f. }
]
This is the analytic twin of “convex hull of epigraph” from Module 16.

**Dependency note:** proving Fenchel–Moreau cleanly uses separation (Module 15) and epigraph geometry (Module 16). So at this point you should understand the statement and how it connects: conjugation is “supporting hyperplanes of epigraph” made algebraic.

---

# 6) Support functions: conjugates of indicators (and why this is huge)

## 6.1 Support function definition

For a set (C\subseteq\mathbb R^n), define its **support function**
[
\boxed{\ \sigma_C(y):=\sup_{x\in C} y^\top x. }
]
This is “how far the set extends in direction (y).”

Geometrically, (\sigma_C(y)) is the maximum height of (C) in direction (y).

## 6.2 Indicator/support conjugacy

Let (I_C) be the indicator function from Module 17. Then:
[
\boxed{\ I_C^*(y)=\sigma_C(y). }
]

### Proof

[
I_C^*(y)=\sup_x (y^\top x - I_C(x)).
]
If (x\notin C), (I_C(x)=+\infty) so expression is (-\infty). Only points in (C) matter. For (x\in C), (I_C(x)=0), so:
[
I_C^*(y)=\sup_{x\in C} y^\top x = \sigma_C(y).
]
∎

**Commentary:**
Constraints become support functions under conjugation. This is one of the main algebraic routes to duality.

---

# 7) Dual norms as support functions (connect Module 1)

Let (|\cdot|) be a norm with unit ball (B={x:|x|\le 1}). The dual norm is
[
|y|** = \sup*{|x|\le 1} y^\top x.
]
But the RHS is exactly (\sigma_B(y)). So:
[
\boxed{\ |y|** = \sigma*{B}(y). }
]
And since (\sigma_B=I_B^*),
[
|y|_* = I_B^*(y).
]
This is why “sup over unit ball” is the recurring duality pattern.

---

# 8) Canonical conjugates you must know (with proofs)

## 8.1 Conjugate of a norm

Let (f(x)=|x|) (any norm). Claim:
[
\boxed{\ f^*(y)=I_{{y:|y|_*\le 1}}(y). }
]
So the conjugate of a norm is the indicator of the dual unit ball.

### Proof

Use the definition:
[
f^*(y)=\sup_x (y^\top x-|x|).
]
**Case 1:** (|y|_*\le 1).
Then by definition of dual norm,
[
y^\top x \le |y|_* |x| \le |x|.
]
So (y^\top x-|x|\le 0) for all (x). Achieve 0 at (x=0). Thus (f^*(y)=0).

**Case 2:** (|y|**>1).
By definition of (|y|**), there exists some (x_0) with (|x_0|=1) such that (y^\top x_0>1). (More precisely: supremum >1 so pick an (\varepsilon)-optimizer.)
Consider (x=t x_0). Then (|x|=t) and
[
y^\top x-|x| = t(y^\top x_0-1)\to +\infty\quad \text{as }t\to\infty,
]
since (y^\top x_0-1>0). So (f^*(y)=+\infty).

Therefore (f^*(y)=0) when (|y|_*\le1), else (+\infty), i.e. the indicator of the dual unit ball. ∎

---

## 8.2 Conjugate of a quadratic (the workhorse of least squares / ridge)

Let (f(x)=\tfrac12|x|_2^2). Claim:
[
\boxed{\ f^*(y)=\tfrac12|y|_2^2. }
]

### Proof

Compute
[
f^*(y)=\sup_x \left(y^\top x - \tfrac12 x^\top x\right).
]
This is a concave quadratic in (x). Complete the square:
[
y^\top x - \tfrac12 x^\top x
= -\tfrac12\left(x^\top x -2y^\top x\right)
= -\tfrac12\left(|x-y|_2^2 - |y|_2^2\right)
= \tfrac12|y|_2^2 - \tfrac12|x-y|_2^2.
]
The supremum over (x) occurs at (x=y) and equals (\tfrac12|y|_2^2). ∎

---

# 9) The “dual-making recipe” you’re about to use in Module 20

When you see something like
[
\min_x f(x)+g(Ax),
]
conjugates let you rewrite (g(Ax)) via
[
g(z)=\sup_y (y^\top z - g^*(y)).
]
Plug (z=Ax):
[
g(Ax)=\sup_y (y^\top Ax - g^*(y)).
]
Then swap (\min) and (\sup) (under conditions) and you get a dual:
[
\max_y \ -g^*(y) - f^*(-A^\top y).
]
That’s Fenchel duality. It’s the cleanest “no-guessing” route to dual problems.

---

# 10) End-of-Module 19 checklist (if any of these feel shaky, stop)

You can:

1. Define (f^*) and prove (f^*) is convex.
2. Prove Fenchel–Young: (f(x)+f^*(y)\ge x^\top y).
3. Prove equality ⇔ subgradient: (y\in\partial f(x)\iff f(x)+f^*(y)=x^\top y).
4. Define support function (\sigma_C) and prove (I_C^*=\sigma_C).
5. Show dual norm is a support function of the primal unit ball.
6. Compute conjugates:

   * norm ⇒ indicator of dual unit ball,
   * (\tfrac12|x|^2) ⇒ (\tfrac12|y|^2).
7. Explain the dual-making recipe conceptually (swap sup/min after conjugate expansion).

---

## Next module

**Module 20 — Lagrangian duality, constraint qualifications, KKT, and conic duality (LP/SOCP/SDP).**
Now we cash everything in: build the Lagrangian, derive the dual function, prove weak duality, state strong duality with Slater, and show the conic primal/dual pair where the dual cone (K^*) reappears exactly as “dual feasibility.”

## Response:
Thought for 37s

Module 19 — Conjugates, support functions, Fenchel–Young
========================================================

_(the engine that manufactures duality instead of “guessing” it)_

0) What this module is secretly doing
-------------------------------------

Module 15 gave you the geometric primitive:

> outside a closed convex set ⇒ there exists a separating hyperplane.

Module 19 gives you the algebraic machine that _systematically builds_ the right hyperplanes and turns them into dual problems.

The key object is the **convex conjugate**:

$$
f^*(y)=\sup_{x\in\mathbb R^n}\big(y^\top x - f(x)\big).
$$

This one definition secretly contains:

*   support functions of sets,
*   dual norms,
*   Fenchel–Young inequality (the universal lower-bound inequality),
*   Fenchel duality (a clean min–max dual recipe),
*   KKT “stationarity” as _equality cases_ of Fenchel–Young,
*   and the biconjugate  $f^{**}$  as “closed convex envelope” (Module 16, but algebraic).

Once you internalize conjugates, dual derivations become deterministic rather than vibe-based.

* * *

1) Setup: extended-value functions, “proper/closed”, and why they matter
========================================================================

We work with

$$
f:\mathbb R^n\to \mathbb R\cup\{+\infty\}.
$$

This is not optional—this is how constraints become functions.

### Effective domain

$$
\mathrm{dom}(f):=\{x:\ f(x)<+\infty\}.
$$

### Proper

 $f$  is **proper** if (i)  $\mathrm{dom}(f)\neq\emptyset$  and (ii)  $f(x)>-\infty$  for all  $x$ .  
(We usually exclude  $-\infty$  values entirely in convex optimization; the important pathology is  $f\equiv +\infty$ , which is useless.)

### Closed (for convex functions)

A convex  $f$  is **closed** if its epigraph is closed; equivalently, it is **lower semicontinuous** (lsc) in finite dimensions.

Why you care: the clean “inversion” identity  $f^{**}=f$  needs  $f$  to be proper + closed + convex.

* * *

2) Convex conjugate: definition and first meaning
=================================================

2.1 Definition (Fenchel conjugate)
----------------------------------

 $$
\boxed{\ f^*(y):=\sup_{x\in\mathbb R^n}\big(y^\top x-f(x)\big). }
$$*   Think of  $y^\top x$  as a linear functional (a hyperplane slope).
*   Think of  $f(x)$  as a “cost” you pay.
*   Then  $y^\top x-f(x)$  is the “profit” of using slope  $y$  against the penalty  $f$ .
*    $f^*(y)$  is the maximal profit achievable.

This “profit” interpretation becomes brutally concrete when  $f$  is an indicator or a norm (later sections).

2.2 The dual viewpoint: conjugates produce affine underestimates
----------------------------------------------------------------

Rewrite the definition as:

$$
y^\top x - f(x) \le f^*(y)\quad \forall x \quad\Longleftrightarrow\quad y^\top x - f^*(y) \le f(x)\quad \forall x.
$$

So for each fixed  $y$ , the affine function

$$
x\mapsto y^\top x - f^*(y)
$$

lies **below**  $f$  everywhere.

That is: **conjugates parametrize global affine underestimators of  $f$ **.

When  $f$  is closed convex, _all_ supporting hyperplanes of  $\mathrm{epi}(f)$  can be described this way.

* * *

3) Basic structural facts:  $f^*$  is always convex and lsc
===========================================================

Proposition
-----------

For any  $f$ ,

$$
\boxed{f^*\ \text{is convex and lower semicontinuous}.}
$$

### Proof (convexity, step-by-step)

Fix  $x$ . The map

$$
y\mapsto y^\top x - f(x)
$$

is affine in  $y$ .

Now  $f^*(y)=\sup_x \big(y^\top x-f(x)\big)$  is a pointwise supremum of affine functions of  $y$ . A supremum of affine functions is convex:

Take  $y_1,y_2$  and  $\theta\in[0,1]$ . Then

$$
f^*((1-\theta)y_1+\theta y_2) =\sup_x\Big(((1-\theta)y_1+\theta y_2)^\top x-f(x)\Big)
$$
 
$$
=\sup_x\Big((1-\theta)(y_1^\top x-f(x))+\theta(y_2^\top x-f(x))\Big)
$$
 
$$
\le (1-\theta)\sup_x(y_1^\top x-f(x))+\theta\sup_x(y_2^\top x-f(x)) =(1-\theta)f^*(y_1)+\theta f^*(y_2).
$$

So  $f^*$  is convex. ∎

### Why lsc holds (one clean viewpoint)

Each affine function  $y\mapsto y^\top x-f(x)$  is continuous. The pointwise supremum of continuous functions is always lower semicontinuous. ∎

**Big meta-point:** dual objectives are convex basically “for free” because they are supremums of affine things.

* * *

4) Fenchel–Young inequality: the fundamental inequality
=======================================================

Theorem (Fenchel–Young)
-----------------------

For all  $x,y$ ,

$$
\boxed{f(x)+f^*(y)\ \ge\ y^\top x.}
$$

### Proof (one line, fully justified)

By definition,

$$
f^*(y)=\sup_u \big(y^\top u-f(u)\big)\ \ge\ y^\top x-f(x)
$$

because a supremum is at least the value at  $u=x$ . Rearranging gives Fenchel–Young. ∎

### Interpretation

Fenchel–Young says:

> every conjugate produces a universal inequality that lower-bounds  $f(x)$  by linear functionals.

This is exactly the “dual feasible ⇒ lower bound” logic of duality, in embryo form.

* * *

5) Equality in Fenchel–Young ⇔ subgradients (KKT stationarity hiding in plain sight)
====================================================================================

This is the single most important bridge fact.

Theorem (Fenchel–Young equality ↔ subgradient)
----------------------------------------------

Let  $f$  be proper, closed, convex. Then for  $x\in\mathrm{dom}(f)$ ,

$$
\boxed{ y\in\partial f(x) \quad\Longleftrightarrow\quad f(x)+f^*(y)=y^\top x. }
$$

Moreover, the condition is symmetric:

$$
\boxed{ y\in\partial f(x) \quad\Longleftrightarrow\quad x\in\partial f^*(y). }
$$

### Proof (⇒ direction)

Assume  $y\in\partial f(x)$ . By definition of subgradient:

$$
f(u)\ge f(x)+y^\top(u-x)\quad\forall u.
$$

Rearrange:

$$
y^\top u-f(u)\le y^\top x-f(x)\quad\forall u.
$$

Taking supremum over  $u$ :

$$
f^*(y)=\sup_u(y^\top u-f(u))\le y^\top x-f(x).
$$

But always  $f^*(y)\ge y^\top x-f(x)$  (plug  $u=x$  into the supremum). Hence equality:

$$
f^*(y)=y^\top x-f(x),
$$

so  $f(x)+f^*(y)=y^\top x$ .

### Proof (⇐ direction)

Assume  $f(x)+f^*(y)=y^\top x$ , i.e.

$$
f^*(y)=y^\top x-f(x).
$$

But  $f^*(y)$  is a supremum:

$$
\sup_u(y^\top u-f(u))=y^\top x-f(x).
$$

So for every  $u$ ,

$$
y^\top u-f(u)\le y^\top x-f(x) \quad\Longleftrightarrow\quad f(u)\ge f(x)+y^\top(u-x).
$$

That is exactly  $y\in\partial f(x)$ .

### Symmetry  $y\in\partial f(x)\iff x\in\partial f^*(y)$ 

Apply the proved equivalence twice: the equality

$$
f(x)+f^*(y)=y^\top x
$$

is symmetric in swapping  $f$  with  $f^*$  and  $x$  with  $y$  (since Fenchel–Young for  $f^*$  reads  $f^*(y)+f^{**}(x)\ge x^\top y$ , and for closed convex  $f$ ,  $f^{**}=f$ ). This yields the symmetric subgradient statement. ∎

**This is KKT “stationarity” in its purest form:**  
stationarity is the claim that a supporting hyperplane is _tight_.

* * *

6) The biconjugate  $f^{**}$  and “convex envelope” (Module 16 in algebra clothing)
===================================================================================

Define the biconjugate:

$$
\boxed{ f^{**}(x):=\sup_{y\in\mathbb R^n}\big(y^\top x-f^*(y)\big). }
$$

Two facts you must hold simultaneously in your head
---------------------------------------------------

### Fact A:  $f^{**}\le f$  always

This is immediate from Fenchel–Young:

$$
f^*(y)\ge y^\top x-f(x) \ \Rightarrow\ y^\top x-f^*(y)\le f(x)
$$

for every  $y$ . Taking supremum over  $y$  gives  $f^{**}(x)\le f(x)$ .

So  $f^{**}$  is always an underestimator of  $f$ .

### Fact B:  $f^{**}$  is the _largest_ closed convex underestimator

This is the analytic twin of “convex hull of the epigraph” from Module 16.

Theorem (Fenchel–Moreau)
------------------------

If  $f$  is proper, closed, convex, then

$$
\boxed{f^{**}=f.}
$$

More generally, for any proper  $f$ ,

$$
\boxed{f^{**}=\text{closed convex envelope of }f.}
$$

**Dependency honesty:** a fully clean proof uses separation of epigraphs (Module 15 + Module 16). At this stage you should _understand the mechanism_:  $f^*$  encodes all supporting hyperplanes; taking the supremum over all those hyperplanes reconstructs the tightest closed convex function below  $f$ .

* * *

7) Support functions: conjugates of indicators (constraints → algebra)
======================================================================

7.1 Support function
--------------------

For a set  $C\subseteq\mathbb R^n$ ,

 $$
\boxed{\ \sigma_C(y):=\sup_{x\in C} y^\top x. }
$$

Geometric meaning: “maximum extent of  $C$  in direction  $y$ .”

If  $C$  is unbounded in a direction where  $y$  has positive dot product,  $\sigma_C(y)=+\infty$ .

7.2 Indicator/support conjugacy
-------------------------------

Let  $I_C$  be the indicator:

$$
I_C(x)=\begin{cases} 0,&x\in C\\ +\infty,&x\notin C. \end{cases}
$$

Then

$$
\boxed{I_C^*(y)=\sigma_C(y).}
$$

### Proof

$$
I_C^*(y)=\sup_x\big(y^\top x-I_C(x)\big).
$$

If  $x\notin C$ , then  $I_C(x)=+\infty$  and the expression is  $-\infty$ . Only  $x\in C$  matter, where  $I_C(x)=0$ . Hence

$$
I_C^*(y)=\sup_{x\in C} y^\top x=\sigma_C(y).
$$

∎

**This is the core “constraints → dual objective” move.**  
You will do this constantly: indicator functions turn constraints into support functions under conjugation.

* * *

8) Cones, polars, and the dual cone connection (ties back to Module 14)
=======================================================================

For a cone  $K$  (containing  $0$ ), define its **polar cone**

$$
K^\circ:=\{y:\ y^\top x\le 0\ \forall x\in K\}.
$$

(Notice the sign: “ $\le 0$ ” not “ $\ge 0$ ”.)

Recall the **dual cone** from Module 14:

$$
K^*:=\{y:\ y^\top x\ge 0\ \forall x\in K\}.
$$

So

$$
K^\circ = -K^*.
$$

### Proposition (support function of a cone is an indicator)

If  $K$  is a cone, then

$$
\boxed{ \sigma_K(y)= \begin{cases} 0,& y\in K^\circ\\ +\infty,& y\notin K^\circ. \end{cases}}
$$

Equivalently,  $\sigma_K = I_{K^\circ}$ .

### Proof

*   If  $y\in K^\circ$ , then  $y^\top x\le 0$  for all  $x\in K$ . Since  $0\in K$ ,  $\sup_{x\in K} y^\top x\ge 0$  (take  $x=0$ ). Combine:  $\sup\le 0$  and  $\sup\ge 0$  ⇒  $\sup=0$ .
*   If  $y\notin K^\circ$ , then there exists  $x_0\in K$  with  $y^\top x_0>0$ . Because  $K$  is a cone,  $t x_0\in K$  for all  $t\ge 0$ , so
    $$
    \sup_{x\in K} y^\top x \ge \sup_{t\ge 0} y^\top (t x_0)=\sup_{t\ge 0} t(y^\top x_0)=+\infty.
    $$

∎

So for cones, conjugating the indicator gives you (essentially) the indicator of a polar cone, i.e. the same dual-cone geometry from Module 14 shows up automatically.

* * *

9) Dual norms as support functions (and conjugates of norms)
============================================================

Let  $\|\cdot\|$  be a norm with unit ball

$$
B:=\{x:\ \|x\|\le 1\}.
$$

The **dual norm** is defined by

 $$
\boxed{\ \|y\|_*:=\sup_{\|x\|\le 1} y^\top x\ }.
$$

But that is exactly a support function:

$$
\|y\|_*=\sigma_B(y).
$$

So norms, dual norms, and support functions are the same pattern: “maximize a linear functional over a convex set.”

* * *

10) Canonical conjugates you must know (with full proofs)
=========================================================

10.1 Conjugate of a norm
------------------------

Let  $f(x)=\|x\|$ . Claim:

$$
\boxed{ f^*(y)=I_{\{y:\ \|y\|_*\le 1\}}(y). }
$$

So “conjugate of a norm = indicator of dual unit ball”.

### Proof

Compute

$$
f^*(y)=\sup_x\big(y^\top x-\|x\|\big).
$$

**Case 1:  $\|y\|_*\le 1$ .**  
By definition of dual norm,  $y^\top x\le \|y\|_*\|x\|\le \|x\|$ . Hence

$$
y^\top x-\|x\|\le 0\quad\forall x.
$$

Taking  $x=0$  gives value  $0$ . So the supremum is  $0$ .

**Case 2:  $\|y\|_*>1$ .**  
Then by definition of supremum, there exists some  $x_0$  with  $\|x_0\|\le 1$  such that  $y^\top x_0>1$  (more carefully: pick  $\varepsilon>0$  and choose  $x_0$  with  $y^\top x_0> \|y\|_*-\varepsilon$ ; take  $\varepsilon$  small enough so this is  $>1$ ). Now scale: for  $t>0$ ,

$$
y^\top (t x_0)-\|t x_0\| = t(y^\top x_0-\|x_0\|)\ge t(y^\top x_0-1)\to+\infty.
$$

So  $f^*(y)=+\infty$ .

Thus  $f^*(y)=0$  if  $\|y\|_*\le 1$ , else  $+\infty$ . ∎

### Bonus symmetry you should notice immediately

Since  $f^*=I_{B_*}$  where  $B_*=\{y:\|y\|_*\le 1\}$ , conjugating again gives

$$
f^{**}=(I_{B_*})^*=\sigma_{B_*}.
$$

But

$$
\sigma_{B_*}(x)=\sup_{\|y\|_*\le 1} x^\top y = \|x\|
$$

(the dual norm identity in the other direction). So norms are recovered exactly by biconjugation—consistent with “norms are closed convex”.

* * *

10.2 Conjugate of a quadratic (scalar identity, then matrix generalization)
---------------------------------------------------------------------------

### Scalar Euclidean quadratic

Let  $f(x)=\frac12\|x\|_2^2$ . Claim:

$$
\boxed{f^*(y)=\frac12\|y\|_2^2.}
$$

**Proof.**

$$
f^*(y)=\sup_x\left(y^\top x-\frac12 x^\top x\right).
$$

Complete the square:

$$
y^\top x-\frac12 x^\top x = -\frac12\big(\|x\|_2^2-2y^\top x\big) = -\frac12\big(\|x-y\|_2^2-\|y\|_2^2\big) =\frac12\|y\|_2^2-\frac12\|x-y\|_2^2.
$$

The supremum over  $x$  occurs at  $x=y$  and equals  $\frac12\|y\|_2^2$ . ∎

### Matrix quadratic (the one you actually use in optimization)

Let  $P\in\mathbf S_{++}^n$  and

$$
f(x)=\frac12 x^\top P x.
$$

Claim:

$$
\boxed{ f^*(y)=\frac12 y^\top P^{-1} y. }
$$

**Proof.**

$$
f^*(y)=\sup_x\left(y^\top x-\frac12 x^\top P x\right).
$$

Complete the square in the  $P$ \-metric. Let  $x=P^{-1}y+z$ . Then

$$
y^\top x = y^\top(P^{-1}y+z)=y^\top P^{-1}y+y^\top z,
$$

and

$$
x^\top P x = (P^{-1}y+z)^\top P (P^{-1}y+z) = y^\top P^{-1}y +2y^\top z + z^\top P z.
$$

So

$$
y^\top x-\frac12 x^\top P x = \left(y^\top P^{-1}y+y^\top z\right)-\frac12\left(y^\top P^{-1}y+2y^\top z+z^\top P z\right) = \frac12 y^\top P^{-1}y-\frac12 z^\top P z.
$$

Since  $P\succ0$ ,  $z^\top P z\ge 0$ , with equality at  $z=0$ . Hence the supremum is  $\frac12 y^\top P^{-1}y$ . ∎

* * *

11) The “dual-making recipe” (Fenchel duality in one deterministic move)
========================================================================

This is the pattern you’ll use constantly.

Consider

$$
\min_{x\in\mathbb R^n}\ \big(f(x)+g(Ax)\big),
$$

where  $f,g$  are proper closed convex and  $A$  is linear.

### Step 1: expand  $g$  using its conjugate

For any  $z$ ,

$$
g(z)=\sup_{y}\big(y^\top z-g^*(y)\big)
$$

(when  $g$  is closed convex,  $g=g^{**}$ ). Substitute  $z=Ax$ :

$$
g(Ax)=\sup_y\big(y^\top Ax-g^*(y)\big).
$$

### Step 2: plug into the primal

$$
\min_x\ \Big(f(x)+\sup_y(y^\top Ax-g^*(y))\Big) = \min_x\ \sup_y\ \Big(f(x)+y^\top Ax-g^*(y)\Big).
$$

### Step 3: swap  $\min$  and  $\sup$  (the only “non-algebra” step)

Under appropriate regularity (constraint qualification; e.g. a Slater-type condition), you can interchange:

$$
\min_x\sup_y(\cdots)=\sup_y\min_x(\cdots).
$$

### Step 4: do the inner minimization

For fixed  $y$ ,

$$
\min_x \big(f(x)+y^\top Ax\big) =\min_x \big(f(x)+(-A^\top y)^\top x\big) = -f^*(-A^\top y).
$$

(That last equality is just the definition of conjugate, rearranged.)

So the dual becomes:

$$
\boxed{ \max_{y}\ \Big(-g^*(y)-f^*(-A^\top y)\Big). }
$$

This is **Fenchel duality**. Lagrangian duality is essentially this plus indicator functions for constraints.

* * *

12) End-of-Module 19 checklist (no mercy)
=========================================

You’re not “done” unless these are automatic:

1.  **Definition fluency:** write  $f^*(y)=\sup_x(y^\top x-f(x))$  and explain what it means geometrically (affine underestimators).
2.  **Convexity proof:** prove  $f^*$  is convex as a supremum of affine functions.
3.  **Fenchel–Young:** prove  $f(x)+f^*(y)\ge y^\top x$  and interpret it as a universal certificate inequality.
4.  **Equality ⇔ subgradient:** prove
    $$
    y\in\partial f(x)\iff f(x)+f^*(y)=y^\top x \iff x\in\partial f^*(y).
    $$
5.  **Biconjugate meaning:** know (and be able to justify)  $f^{**}\le f$  always, and  $f^{**}=f$  for proper closed convex  $f$ ; otherwise  $f^{**}$  is the closed convex envelope.
6.  **Support functions:** define  $\sigma_C$  and prove  $I_C^*=\sigma_C$ .
7.  **Dual norms:** derive  $\|y\|_*=\sup_{\|x\|\le 1}y^\top x$  as a support function.
8.  **Canonical conjugates:** prove
    *    $(\|\cdot\|)^* = I_{\{\|y\|_*\le 1\}}$ ,
    *    $\left(\tfrac12\|x\|_2^2\right)^*=\tfrac12\|y\|_2^2$ ,
    *    $\left(\tfrac12 x^\top P x\right)^*=\tfrac12 y^\top P^{-1} y$  for  $P\succ0$ .
9.  **Dual-making recipe:** derive the Fenchel dual of  $f(x)+g(Ax)$  and identify exactly where the “swap min/sup” assumption enters.

* * *

Next module
-----------

**Module 20 — Lagrangian duality, constraint qualifications, KKT, and conic duality (LP/SOCP/SDP).**  
Now you cash everything in: indicator functions turn constraints into conjugates; dual cones reappear as feasibility conditions; Slater explains when the min–max swap is valid; KKT becomes “tight supporting hyperplanes + normal cones.”

## Prompt:
Now this:

# Module 20 — Lagrangian duality, constraint qualifications, KKT, and conic duality (LP/SOCP/SDP)

*(the “one machine” that produces dual problems, optimality conditions, and certificates)*

## 0) What this module is secretly doing

Everything we’ve built (separation, epigraphs, subgradients, conjugates, cones) now clicks into a single mechanism:

1. Build a **Lagrangian** that mixes objective + constraints.
2. Take an infimum over (x) to get a **dual function** (q) (always concave).
3. Maximize (q) subject to “the Lagrangian doesn’t blow up” to get the **dual problem**.
4. Use **weak duality** (always) and **strong duality** (under conditions) to connect primal and dual.
5. Under strong duality + regularity, primal/dual optimal solutions satisfy **KKT** (a set of equalities/inequalities that are simultaneously:

   * optimality conditions, and
   * certificates.

A good mental model:

> Dual feasibility = “I found a separating hyperplane.”
> Complementary slackness = “the hyperplane touches at the optimum.”
> Multipliers = “coordinates of the normal vector in the constraint-generated cone.”

---

# 1) Problem classes and notation (be domain-honest)

## 1.1 General constrained optimization (inequalities + equalities)

We consider problems of the form
[
\boxed{
\begin{aligned}
\min_{x\in\mathbb R^n}\quad & f_0(x)\
\text{s.t.}\quad & f_i(x)\le 0,\quad i=1,\dots,m\
& h_j(x)=0,\quad j=1,\dots,p,
\end{aligned}}
]
with an implicit domain (x\in\mathrm{dom}(f_0)\cap\cdots\cap\mathrm{dom}(f_m)).

* (f_i:\mathbb R^n\to\mathbb R\cup{+\infty}) can be extended-real (best for convex analysis).
* (h_j:\mathbb R^n\to\mathbb R) typically finite-valued.

Feasible set:
[
\mathcal F := {x:\ f_i(x)\le 0,\ \forall i;\ h_j(x)=0,\ \forall j}.
]

Optimal value:
[
p^\star := \inf_{x\in\mathcal F} f_0(x).
]

---

## 1.2 The convex case (where the strong theorems live)

We call the problem **convex** if:

* (f_0,f_1,\dots,f_m) are **convex** functions,
* each (h_j) is **affine** (i.e. (h_j(x)=a_j^\top x-b_j)),
* the domain intersection is convex (automatic if each function has convex domain).

This is the “Boyd & Vandenberghe world.”

---

# 2) The Lagrangian: mixing objective and constraints

## 2.1 Definition

Introduce multipliers:

* (\lambda\in\mathbb R^m) for inequalities, with constraint (\lambda\ge 0),
* (\nu\in\mathbb R^p) for equalities, unrestricted.

Define the **Lagrangian**
[
\boxed{
\mathcal L(x,\lambda,\nu)
:= f_0(x) + \sum_{i=1}^m \lambda_i f_i(x) + \sum_{j=1}^p \nu_j h_j(x).
}
]

### Why (\lambda\ge 0)?

Because for feasible (x) we have (f_i(x)\le 0). If (\lambda_i\ge 0), then (\lambda_i f_i(x)\le 0), so adding these terms can only *decrease* the Lagrangian relative to (f_0(x)). That monotonicity is exactly what powers weak duality.

---

# 3) Dual function and weak duality (always true)

## 3.1 Dual function

Define
[
\boxed{
q(\lambda,\nu):=\inf_{x\in\mathbb R^n} \mathcal L(x,\lambda,\nu).
}
]
This is the best lower bound on (\mathcal L) you can get by choosing (x).

### Fact: (q) is concave in ((\lambda,\nu))

Reason: for each fixed (x), (\mathcal L(x,\lambda,\nu)) is affine in ((\lambda,\nu)), and the infimum of affine functions is concave.

---

## 3.2 Weak duality theorem (rigorous)

### Theorem (weak duality)

For any (\lambda\ge 0) and any (\nu),
[
\boxed{
q(\lambda,\nu)\ \le\ p^\star.
}
]

### Proof (step-by-step, no jumps)

Take any feasible (x\in\mathcal F). Then:

* (f_i(x)\le 0) for all (i),
* (h_j(x)=0) for all (j).

Compute the Lagrangian at this feasible (x):
[
\mathcal L(x,\lambda,\nu)
= f_0(x) + \sum_{i=1}^m \lambda_i f_i(x) + \sum_{j=1}^p \nu_j h_j(x).
]
Since (\lambda_i\ge 0) and (f_i(x)\le 0), we have (\lambda_i f_i(x)\le 0).
Since (h_j(x)=0), we have (\nu_j h_j(x)=0).
Therefore
[
\mathcal L(x,\lambda,\nu)\le f_0(x).
]
Now take the infimum over all (x) (not just feasible) on the left:
[
q(\lambda,\nu)=\inf_x \mathcal L(x,\lambda,\nu)\ \le\ \mathcal L(x,\lambda,\nu)\ \le\ f_0(x).
]
This holds for every feasible (x). Take infimum over feasible (x):
[
q(\lambda,\nu)\le \inf_{x\in\mathcal F} f_0(x)=p^\star.
]
Done. ∎

**Interpretation:** every dual-feasible ((\lambda,\nu)) gives a certified lower bound on the primal optimum.

---

## 3.3 The dual problem

Because we want the **best** lower bound, we maximize (q):
[
\boxed{
\begin{aligned}
\max_{\lambda,\nu}\quad & q(\lambda,\nu)\
\text{s.t.}\quad & \lambda\ge 0.
\end{aligned}}
]
Let its optimal value be (d^\star). Then weak duality implies
[
\boxed{d^\star\le p^\star.}
]
The gap (p^\star-d^\star\ge 0) is the **duality gap**.

---

# 4) KKT conditions (what they are and why they matter)

Assume for a moment differentiability where needed (we’ll generalize conceptually).

## 4.1 KKT conditions (inequalities + equalities)

A triple ((x^\star,\lambda^\star,\nu^\star)) satisfies KKT if:

1. **Primal feasibility**
   [
   f_i(x^\star)\le 0,\ \forall i;\qquad h_j(x^\star)=0,\ \forall j.
   ]

2. **Dual feasibility**
   [
   \lambda^\star\ge 0.
   ]

3. **Complementary slackness**
   [
   \boxed{\lambda_i^\star f_i(x^\star)=0\quad\forall i.}
   ]
   Meaning: either constraint (i) is active ((f_i(x^\star)=0)) and can have (\lambda_i^\star>0), or it’s inactive ((f_i(x^\star)<0)) and then (\lambda_i^\star) must be (0).

4. **Stationarity**
   If (f_0,f_i,h_j) are differentiable:
   [
   \boxed{
   \nabla f_0(x^\star) + \sum_{i=1}^m \lambda_i^\star \nabla f_i(x^\star)

* \sum_{j=1}^p \nu_j^\star \nabla h_j(x^\star)=0.
  }
  ]
  Equivalently:
  [
  \nabla_x \mathcal L(x^\star,\lambda^\star,\nu^\star)=0.
  ]

---

## 4.2 Where KKT comes from (the real reason)

* **Stationarity** says: at optimum, the objective’s supporting hyperplane is balanced by a linear combination of constraint normals (normal cone geometry from Module 17).
* **Complementary slackness** says: multipliers only “push” where the boundary is actually touched.
* **Dual feasibility** enforces the correct outward direction (for (\le 0) constraints).
* **Primal feasibility** is just: you’re actually feasible.

---

# 5) KKT is sufficient for convex problems (big theorem you will use constantly)

## Theorem (KKT sufficiency)

Consider a convex problem (convex (f_0,f_i), affine (h_j)).
If there exist ((x^\star,\lambda^\star,\nu^\star)) satisfying KKT, then:

* (x^\star) is primal optimal,
* ((\lambda^\star,\nu^\star)) is dual optimal,
* (p^\star=d^\star) (zero duality gap).

### Proof (clean and rigorous)

Take any feasible (x\in\mathcal F). By convexity of (f_0) and (f_i) and affinity of (h_j), we can use first-order lower bounds:

For convex differentiable (f_0):
[
f_0(x)\ge f_0(x^\star)+\nabla f_0(x^\star)^\top(x-x^\star).
]
Similarly for each convex (f_i):
[
f_i(x)\ge f_i(x^\star)+\nabla f_i(x^\star)^\top(x-x^\star).
]
For affine (h_j), we have exact equality:
[
h_j(x)=h_j(x^\star)+\nabla h_j(x^\star)^\top(x-x^\star)
]
(and (h_j(x^\star)=0), (h_j(x)=0) for feasible points).

Now form:
[
f_0(x) - f_0(x^\star).
]
Use stationarity:
[
\nabla f_0(x^\star) = -\sum_i \lambda_i^\star \nabla f_i(x^\star) - \sum_j \nu_j^\star \nabla h_j(x^\star).
]
So
[
\nabla f_0(x^\star)^\top(x-x^\star)
= -\sum_i \lambda_i^\star \nabla f_i(x^\star)^\top(x-x^\star)
-\sum_j \nu_j^\star \nabla h_j(x^\star)^\top(x-x^\star).
]
Plug into the convex lower bound:
[
f_0(x)\ge f_0(x^\star)
-\sum_i \lambda_i^\star \nabla f_i(x^\star)^\top(x-x^\star)
-\sum_j \nu_j^\star \nabla h_j(x^\star)^\top(x-x^\star).
]
Now use the convex inequalities for (f_i):
[
\nabla f_i(x^\star)^\top(x-x^\star)\le f_i(x)-f_i(x^\star).
]
Multiply by (\lambda_i^\star\ge 0):
[
\lambda_i^\star \nabla f_i(x^\star)^\top(x-x^\star)\le \lambda_i^\star(f_i(x)-f_i(x^\star)).
]
So with the minus sign:
[
-\lambda_i^\star \nabla f_i(x^\star)^\top(x-x^\star)\ge -\lambda_i^\star(f_i(x)-f_i(x^\star))
= -\lambda_i^\star f_i(x)+\lambda_i^\star f_i(x^\star).
]
For the affine equalities, feasibility gives (h_j(x)=h_j(x^\star)=0), hence
[
\nabla h_j(x^\star)^\top(x-x^\star)=h_j(x)-h_j(x^\star)=0.
]
So the equality part drops out.

Combine everything:
[
f_0(x)\ge f_0(x^\star) + \sum_i \big(-\lambda_i^\star f_i(x)+\lambda_i^\star f_i(x^\star)\big).
]
Now use:

* feasibility: (f_i(x)\le 0) ⇒ (-\lambda_i^\star f_i(x)\ge 0),
* complementary slackness: (\lambda_i^\star f_i(x^\star)=0).

Thus:
[
f_0(x)\ge f_0(x^\star).
]
Since this holds for every feasible (x), (x^\star) is optimal. ∎

**Commentary:**
This proof is the “supporting hyperplane + normals” story written in algebra.

---

# 6) Strong duality and constraint qualifications (why Slater matters)

Weak duality always holds. Strong duality ((p^\star=d^\star)) can fail without regularity: the dual may be too “small” to touch the primal epigraph (geometrically: separation exists but not supporting).

## 6.1 Slater’s condition (the main convex CQ)

For convex problems with inequality constraints (f_i(x)\le 0) and affine equalities (Ax=b), **Slater** says:

There exists an (x) such that
[
f_i(x) < 0\ \forall i \quad\text{and}\quad Ax=b
]
and (x\in\mathrm{ri}(\mathrm{dom}(f_0)\cap\cdots\cap\mathrm{dom}(f_m))).

This is **strict feasibility**: you can sit inside the feasible region with margin.

## 6.2 Strong duality theorem (standard convex form)

### Theorem (strong duality + KKT existence)

For a convex optimization problem:

* convex (f_0,f_i),
* affine equalities,
* and Slater’s condition holds,

then:

1. (p^\star=d^\star) (strong duality),
2. the dual optimum is attained (under mild closedness/properness),
3. there exist multipliers ((\lambda^\star,\nu^\star)) such that KKT holds at a primal optimum (x^\star).

### Why this is true (geometric proof idea, but precise)

A fully detailed proof is a bit long because it uses separation in (\mathbb R^{m+p+1}) on an epigraph of a perturbation function. Here is the clean “no-magic” structure you should understand:

1. Define a **perturbation/value function**:
   [
   v(u,w)=\inf_x\Big{ f_0(x): f_i(x)\le u_i,\ Ax-b=w \Big}.
   ]
   This is convex in ((u,w)) because it’s an infimum of convex functions in the right lifted space.

2. The primal optimum is (v(0,0)).

3. Under Slater, ((0,0)) lies in a “nice” region (relative interior) of the effective domain of (v). This prevents pathological boundary behavior.

4. For convex (v), separation (Module 15) gives a supporting hyperplane to (\mathrm{epi}(v)) at ((0,0,v(0,0))). The slope of that hyperplane gives multipliers ((\lambda^\star,\nu^\star)).

5. That supporting hyperplane inequality is exactly the dual bound, and touching at the optimum yields (p^\star=d^\star) plus KKT.

So: **Slater ensures the supporting hyperplane exists** (not just a separating one), hence the dual can “touch” the primal value.

That’s the geometric heart.

---

## 6.3 LICQ and MFCQ (nonconvex / smooth CQs — conceptually)

Outside pure convexity, KKT may fail as a necessary condition unless constraints are regular.

Two classical smooth constraint qualifications:

* **LICQ** (Linear Independence Constraint Qualification): gradients of active constraints at (x^\star) are linearly independent.
* **MFCQ** (Mangasarian–Fromovitz): there exists a direction that strictly decreases all active inequalities while staying tangent to equalities.

You don’t need all details yet; the point is: CQs guarantee the normal cone has a “nice representation” by constraint gradients, so multipliers exist.

---

# 7) Conic duality: the unified form (LP/SOCP/SDP all fit here)

Now we compress everything into one elegant template.

## 7.1 Primal conic form

Let (K\subseteq\mathbb R^n) be a closed convex cone. Consider:
[
\boxed{
\begin{aligned}
\min_{x\in\mathbb R^n}\quad & c^\top x\
\text{s.t.}\quad & Ax=b\
& x\in K.
\end{aligned}}
]
This is a convex problem because:

* objective linear,
* equality affine,
* cone constraint is convex.

We encode (x\in K) using an indicator:
[
I_K(x)=0 \text{ if }x\in K,\ +\infty\text{ else}.
]

## 7.2 Deriving the dual (step-by-step)

Write the Lagrangian with multiplier (y\in\mathbb R^m) for (Ax=b):
[
\mathcal L(x,y)=c^\top x + y^\top(b-Ax) + I_K(x)
= b^\top y + (c-A^\top y)^\top x + I_K(x).
]
Dual function:
[
q(y)=\inf_x \Big[b^\top y + (c-A^\top y)^\top x + I_K(x)\Big]
= b^\top y + \inf_x\Big[(c-A^\top y)^\top x + I_K(x)\Big].
]
The infimum term is (-) the support function of (K) with a sign flip, but easiest is this standard fact:

[
\inf_{x\in K} (c-A^\top y)^\top x
=================================

\begin{cases}
0, & c-A^\top y \in K^*\
-\infty, & \text{otherwise},
\end{cases}
]
where the **dual cone**
[
\boxed{
K^*:={s:\ s^\top x\ge 0\ \forall x\in K}.
}
]

Reason:

* If (s\in K^*), then (s^\top x\ge 0) for all (x\in K), so inf is (0) achieved at (x=0).
* If (s\notin K^*), there exists some (x_0\in K) with (s^\top x_0<0). Scaling (t x_0\in K) gives (s^\top(tx_0)=t(s^\top x_0)\to -\infty), so inf is (-\infty).

Here (s=c-A^\top y). So:
[
q(y)=
\begin{cases}
b^\top y, & c-A^\top y\in K^*\
-\infty, & \text{otherwise}.
\end{cases}
]

Thus the dual problem is:
[
\boxed{
\begin{aligned}
\max_{y}\quad & b^\top y\
\text{s.t.}\quad & c-A^\top y \in K^*.
\end{aligned}}
]
Often written with an explicit slack (s\in K^*):
[
\boxed{
\begin{aligned}
\max_{y,s}\quad & b^\top y\
\text{s.t.}\quad & A^\top y + s = c\
& s\in K^*.
\end{aligned}}
]

**This is the conic primal/dual pair.**

---

## 7.3 Conic KKT conditions

For primal feasible (x\in K, Ax=b) and dual feasible ((y,s)) with (s\in K^*, A^\top y+s=c), KKT adds **complementary slackness**:
[
\boxed{ s^\top x = 0. }
]
Why? In cones, “inactive vs active” becomes “orthogonality between primal and dual cone elements.” This is the generalization of (\lambda_i f_i(x)=0).

---

# 8) LP as conic duality (K = nonnegative orthant)

Take (K=\mathbb R_+^n). Then (K^*=\mathbb R_+^n) (self-dual under dot product).

Primal:
[
\min c^\top x\quad \text{s.t. }Ax=b,\ x\ge 0.
]
Dual:
[
\max b^\top y\quad \text{s.t. }A^\top y \le c.
]
(Here slack (s=c-A^\top y\ge 0).)

Complementary slackness:
[
x_i s_i = 0\quad\forall i,
]
the classic LP condition.

---

# 9) SOCP as conic duality (second-order cone is self-dual)

Second-order cone (Lorentz cone) in (\mathbb R^{n+1}):
[
Q:={(t,z): t\ge |z|_2}.
]
Fact: (Q^*=Q) (self-dual). So SOCPs have duals of the same cone type.

SOCP standard conic form uses blocks of (Q) constraints; dual uses the same (Q) constraints.

(We can derive the self-duality proof later; it’s a direct Cauchy–Schwarz argument.)

---

# 10) SDP as conic duality (PSD cone + trace inner product)

Now the matrix case. This is where Module 6 (trace inner product) and Module 14 (PSD cone) were preparing you.

## 10.1 PSD cone and inner product

Let (S^n) be symmetric matrices. Define inner product:
[
\langle X,Y\rangle := \mathrm{tr}(XY)
]
(for symmetric (X,Y), transpose is unnecessary).

PSD cone:
[
S_+^n={X\in S^n:\ X\succeq 0}.
]
Fact: ((S_+^n)^*=S_+^n) under the trace inner product (self-dual).

## 10.2 SDP primal/dual pair

**Primal SDP**
[
\boxed{
\begin{aligned}
\min_{X\in S^n}\quad & \langle C,X\rangle\
\text{s.t.}\quad & \langle A_i,X\rangle=b_i,\quad i=1,\dots,m\
& X\succeq 0.
\end{aligned}}
]

Derive dual: Lagrangian with multipliers (y\in\mathbb R^m) for equalities:
[
\mathcal L(X,y)=\langle C,X\rangle + \sum_{i=1}^m y_i(b_i-\langle A_i,X\rangle) + I_{S_+^n}(X).
]
Group terms:
[
\mathcal L(X,y)= b^\top y + \left\langle C-\sum_{i=1}^m y_i A_i,\ X\right\rangle + I_{S_+^n}(X).
]
Now:
[
q(y)=\inf_{X\succeq 0}\left[b^\top y + \left\langle C-\sum_i y_i A_i,\ X\right\rangle\right].
]
This infimum is (b^\top y) if the coefficient matrix is in the dual cone:
[
C-\sum_i y_i A_i \in (S_+^n)^* = S_+^n,
]
otherwise (-\infty).

So **dual SDP**:
[
\boxed{
\begin{aligned}
\max_{y\in\mathbb R^m}\quad & b^\top y\
\text{s.t.}\quad & C-\sum_{i=1}^m y_i A_i \succeq 0.
\end{aligned}}
]

Complementary slackness (conic form):
Let (S:=C-\sum_i y_i A_i\succeq 0). Then
[
\boxed{\ \langle S,X\rangle = \mathrm{tr}(SX)=0. }
]
For PSD matrices, (\mathrm{tr}(SX)=0) with (S,X\succeq 0) implies they “live on orthogonal subspaces” (their product has zero trace; in many cases (SX=0) when they commute, but trace zero is the correct conic condition).

---

# 11) Duality as certificates: infeasibility / unboundedness (what you should *hear*)

* A dual feasible point gives a **lower bound** (weak duality).
* Under strong duality, the best lower bound equals the primal optimum.
* If primal is infeasible, the dual may be unbounded (or can provide a certificate depending on form).
* Farkas (Module 15) is the LP feasibility certificate; conic variants generalize it.

This is why dual variables aren’t “just multipliers.” They are *proof objects*.

---

# 12) End-of-Module 20 checklist (hard requirements)

You can:

1. Define Lagrangian, dual function (q), dual problem.
2. Prove weak duality rigorously.
3. Write KKT conditions (feasibility, dual feasibility, complementary slackness, stationarity).
4. Prove KKT sufficiency for convex problems (the inequality-chaining proof).
5. State Slater and explain geometrically why it enables strong duality + multipliers.
6. Derive conic duality:
   [
   \min c^\top x\ \text{s.t. }Ax=b,\ x\in K
   \quad\Longleftrightarrow\quad
   \max b^\top y\ \text{s.t. }A^\top y+s=c,\ s\in K^*.
   ]
7. Specialize to LP ((K=\mathbb R_+^n)), SOCP (self-dual (Q)), SDP (PSD cone + trace inner product), and write complementary slackness in each.

---

## Next module

**Module 21 — Sensitivity / shadow prices / certificates (meaning of dual variables).**
We’ll formalize “multipliers are subgradients of the value function” and show how dual solutions quantify how the optimum changes when you perturb constraints (and how they certify infeasibility/unboundedness in practice).

## Response:
Module 20 — Lagrangian duality, constraint qualifications, KKT, and conic duality (LP/SOCP/SDP)
===============================================================================================

_(the “one machine” that produces dual problems, optimality conditions, and certificates)_

0) What this module is secretly doing
-------------------------------------

Everything from Modules 14–19 collapses into a single mechanism:

1.  Build a **Lagrangian** = objective + weighted constraints.
2.  Take  $\inf_x$  to get a **dual function**  $q$  (always concave).
3.  Maximize  $q$  over multipliers to get the **dual problem**.
4.  **Weak duality** always: dual ≤ primal.
5.  Under the right regularity (e.g. Slater), **strong duality** holds and **KKT** becomes both:
    *   optimality conditions, and
    *   _certificates_ (proof objects).

Mental model you should actually carry:

*   **Dual feasibility** = “I found a valid separating/supporting hyperplane.”
*   **Complementary slackness** = “the hyperplane touches at the optimum.”
*   **Multipliers** = “coordinates of a normal vector in a cone of constraint normals.”

* * *

1) Problem classes and notation (domain-honest)
===============================================

1.1 General constrained problem
-------------------------------

$$
\boxed{ \begin{aligned} \min_{x\in\mathbb R^n}\quad & f_0(x)\\ \text{s.t.}\quad & f_i(x)\le 0,\quad i=1,\dots,m\\ & h_j(x)=0,\quad j=1,\dots,p, \end{aligned}}
$$

with implicit domain

$$
x\in \bigcap_{i=0}^m \mathrm{dom}(f_i).
$$

Feasible set:

$$
\mathcal F:=\{x:\ f_i(x)\le 0\ \forall i,\ h_j(x)=0\ \forall j\}.
$$

Optimal value:

$$
p^\star:=\inf_{x\in\mathcal F} f_0(x).
$$

1.2 Convex problem (the “BV world”)
-----------------------------------

Convex if:

*    $f_0,f_1,\dots,f_m$  are convex (extended-real allowed),
*   each  $h_j$  is affine (e.g.  $h(x)=Ax-b$ ),
*   domains are handled properly (intersection convex; typically automatic in convex analysis).

This is where strong theorems (Slater, KKT sufficiency, conic duality) live.

* * *

2) The Lagrangian: mixing objective and constraints
===================================================

2.1 Definition
--------------

Multipliers:

*    $\lambda\in\mathbb R^m$  for inequalities, with  $\lambda\ge 0$ ,
*    $\nu\in\mathbb R^p$  for equalities, free sign.
    
$$
\boxed{ \mathcal L(x,\lambda,\nu) := f_0(x)+\sum_{i=1}^m \lambda_i f_i(x)+\sum_{j=1}^p \nu_j h_j(x). }
$$

### Why  $\lambda\ge 0$  is forced (not “convention”)

For feasible  $x$ ,  $f_i(x)\le 0$ . If  $\lambda_i\ge 0$ , then  $\lambda_i f_i(x)\le 0$ , so

$$
\mathcal L(x,\lambda,\nu)\le f_0(x)\quad \text{for every feasible }x.
$$

That inequality is the whole reason weak duality works.

* * *

3) Dual function and weak duality (always true)
===============================================

3.1 Dual function
-----------------

$$
\boxed{ q(\lambda,\nu):=\inf_{x\in\mathbb R^n}\mathcal L(x,\lambda,\nu). }
$$

### Fact:  $q$  is concave in  $(\lambda,\nu)$ 

For fixed  $x$ ,  $\mathcal L(x,\lambda,\nu)$  is affine in  $(\lambda,\nu)$ .  
An infimum of affine functions is concave. (This is the “dual is convex optimization” miracle: concavity comes for free.)

3.2 Weak duality
----------------

### Theorem

For any  $\lambda\ge 0$  and any  $\nu$ ,

$$
\boxed{q(\lambda,\nu)\le p^\star.}
$$

### Proof (no jumps)

Take any feasible  $x\in\mathcal F$ . Then  $f_i(x)\le 0$  and  $h_j(x)=0$ . So

$$
\mathcal L(x,\lambda,\nu) = f_0(x)+\sum_i \lambda_i f_i(x)+\sum_j \nu_j h_j(x) \le f_0(x).
$$

Also, by definition of infimum,

$$
q(\lambda,\nu)=\inf_u \mathcal L(u,\lambda,\nu)\le \mathcal L(x,\lambda,\nu).
$$

Hence  $q(\lambda,\nu)\le f_0(x)$  for every feasible  $x$ . Taking inf over feasible  $x$  gives  $q(\lambda,\nu)\le p^\star$ . ∎

Interpretation: every dual-feasible  $(\lambda,\nu)$  is a **certified lower bound** on the primal optimum.

3.3 Dual problem
----------------

Maximize the best lower bound:

$$
\boxed{ \begin{aligned} \max_{\lambda,\nu}\quad & q(\lambda,\nu)\\ \text{s.t.}\quad & \lambda\ge 0. \end{aligned}}
$$

Let optimal value be  $d^\star$ . Then

$$
\boxed{d^\star\le p^\star.}
$$

The gap  $p^\star-d^\star\ge 0$  is the **duality gap**.

* * *

4) KKT conditions (what they are)
=================================

Assume differentiability for the stationarity line (Module 17 handles nonsmooth via subgradients/normal cones).

A triple  $(x^\star,\lambda^\star,\nu^\star)$  satisfies KKT if:

1.  **Primal feasibility**
    $$
    f_i(x^\star)\le 0\ \forall i,\qquad h_j(x^\star)=0\ \forall j.
    $$
2.  **Dual feasibility**
    $$
    \lambda^\star\ge 0.
    $$
3.  **Complementary slackness**
    $$
    \boxed{\lambda_i^\star f_i(x^\star)=0\quad \forall i.}
    $$
    (Multiplier can be positive only if constraint is tight.)
4.  **Stationarity**
    $$
    \boxed{ \nabla f_0(x^\star)+\sum_{i=1}^m \lambda_i^\star\nabla f_i(x^\star) +\sum_{j=1}^p \nu_j^\star\nabla h_j(x^\star)=0. }
    $$
    Equivalently  $\nabla_x\mathcal L(x^\star,\lambda^\star,\nu^\star)=0$ .

Geometric translation (Module 17 language):  
stationarity says “objective subgradient + constraint normal = 0”.

* * *

5) KKT sufficiency for convex problems (major theorem)
======================================================

Theorem (KKT sufficiency)
-------------------------

For a convex problem (convex  $f_0,f_i$ , affine  $h_j$ ), if there exists  $(x^\star,\lambda^\star,\nu^\star)$  satisfying KKT, then:

*    $x^\star$  is primal optimal,
*    $(\lambda^\star,\nu^\star)$  is dual optimal,
*    $p^\star=d^\star$  (zero gap).

### Proof (core idea, written as inequalities)

Take any feasible  $x$ . Convexity gives first-order lower bounds:

$$
f_0(x)\ge f_0(x^\star)+\nabla f_0(x^\star)^\top(x-x^\star),
$$
 
$$
f_i(x)\ge f_i(x^\star)+\nabla f_i(x^\star)^\top(x-x^\star).
$$

Affine equalities imply

$$
\nabla h_j(x^\star)^\top(x-x^\star)=h_j(x)-h_j(x^\star)=0.
$$

Use stationarity to substitute for  $\nabla f_0(x^\star)$ , then bound the  $\nabla f_i$  terms using convexity, multiply by  $\lambda_i^\star\ge 0$ , and use feasibility  $f_i(x)\le 0$  plus complementary slackness  $\lambda_i^\star f_i(x^\star)=0$ . The result is

$$
f_0(x)\ge f_0(x^\star)\quad \forall x\in\mathcal F,
$$

so  $x^\star$  is optimal. (And with the standard duality argument, the dual is tight too.) ∎

This is the “supporting hyperplane touches epigraph” story converted into algebra.

* * *

6) Strong duality and constraint qualifications (why Slater matters)
====================================================================

Weak duality never fails. Strong duality can fail without regularity because the best supporting hyperplane might not exist (only separating ones do).

Slater’s condition (convex CQ)
------------------------------

For convex problems with inequalities  $f_i(x)\le 0$  and affine equalities  $Ax=b$ , Slater requires existence of a **strictly feasible** point:

$$
\exists x:\ f_i(x)<0\ \forall i,\quad Ax=b,
$$

(and domain conditions in relative interior when extended-value functions are involved).

Theorem (strong duality + KKT existence, standard form)
-------------------------------------------------------

If the problem is convex and Slater holds, then:

*    $p^\star=d^\star$ ,
*   dual optimum is attained (under mild closedness/properness),
*   there exist multipliers making KKT hold at a primal optimum.

Geometric reason: Slater puts you in a “nice interior” region so the epigraph/value function admits a **supporting** hyperplane (touching), not just a separating one.

* * *

7) Conic duality: the unified template (LP/SOCP/SDP are just choices of  $K$ )
==============================================================================

7.1 Primal conic form
---------------------

Let  $K\subseteq\mathbb R^n$  be a closed convex cone:

$$
\boxed{ \begin{aligned} \min_{x}\quad & c^\top x\\ \text{s.t.}\quad & Ax=b\\ & x\in K. \end{aligned}}
$$

7.2 Dual cone
-------------

$$
\boxed{ K^*:=\{s:\ s^\top x\ge 0\ \forall x\in K\}. }
$$

7.3 Derive the conic dual (fully mechanical)
--------------------------------------------

Use indicator  $I_K(x)$ . Lagrangian with multiplier  $y$  for  $Ax=b$ :

$$
\mathcal L(x,y)=c^\top x + y^\top(b-Ax)+I_K(x) = b^\top y + (c-A^\top y)^\top x + I_K(x).
$$

Dual function:

$$
q(y)=b^\top y + \inf_{x\in K}(c-A^\top y)^\top x.
$$

That infimum is  $0$  iff  $c-A^\top y\in K^*$ , else  $-\infty$  (scaling argument on cones). Therefore dual:

$$
\boxed{ \begin{aligned} \max_{y}\quad & b^\top y\\ \text{s.t.}\quad & c-A^\top y\in K^*. \end{aligned}}
$$

Equivalently introduce slack  $s\in K^*$ :

$$
\boxed{ \begin{aligned} \max_{y,s}\quad & b^\top y\\ \text{s.t.}\quad & A^\top y + s = c\\ & s\in K^*. \end{aligned}}
$$

7.4 Conic KKT (clean form)
--------------------------

Primal feasibility:  $Ax=b,\ x\in K$ .  
Dual feasibility:  $A^\top y+s=c,\ s\in K^*$ .  
Complementary slackness:

$$
\boxed{s^\top x=0.}
$$

This is the cone-general version of “ $\lambda_i f_i(x)=0$ ”.

* * *

8) LP / SOCP / SDP as special cones
===================================

8.1 LP:  $K=\mathbb R_+^n$ 
---------------------------

Self-dual:  $(\mathbb R_+^n)^*=\mathbb R_+^n$ .  
Primal:  $Ax=b,\ x\ge 0$ .  
Dual:  $A^\top y\le c$ .  
Slack  $s=c-A^\top y\ge 0$ .  
Complementary slackness:  $x_i s_i=0$ .

8.2 SOCP:  $K$  is a product of second-order cones
--------------------------------------------------

Lorentz cone  $Q=\{(t,z): t\ge \|z\|_2\}$  is self-dual, so SOCP duals are again SOCPs.

8.3 SDP:  $K=S_+^n$  with trace inner product
---------------------------------------------

Self-dual:  $(S_+^n)^*=S_+^n$ .  
Primal SDP:

$$
\min \langle C,X\rangle \ \text{s.t.}\ \langle A_i,X\rangle=b_i,\ X\succeq 0.
$$

Dual SDP:

$$
\max b^\top y\ \text{s.t.}\ C-\sum_i y_i A_i\succeq 0.
$$

Complementary slackness:

$$
\boxed{\langle X,S\rangle=\mathrm{tr}(XS)=0,\quad X,S\succeq 0.}
$$

* * *

9) End-of-Module 20 checklist (hard requirements)
=================================================

You can, without hesitation:

1.  Build  $\mathcal L$ , define  $q(\lambda,\nu)$ , write the dual.
2.  Prove weak duality cleanly.
3.  State KKT (feasibility, dual feasibility, complementary slackness, stationarity).
4.  Prove KKT sufficiency for convex problems (inequality-chaining proof).
5.  State Slater and explain why it enables supporting hyperplanes ⇒ strong duality + multipliers.
6.  Derive conic duality mechanically and identify where  $K^*$  appears.
7.  Specialize conic duality to LP/SOCP/SDP and write their complementary slackness.

* * *

Next module
-----------

**Module 21 — Sensitivity / shadow prices / meaning of dual variables.**  
We’ll show multipliers are (sub)gradients of the value function, quantify how optima move under perturbations, and interpret dual feasibility as _numerical certificates_ in solvers.

## Prompt:
Now this:

# Module 21 — Sensitivity, shadow prices, certificates

*(dual variables as meaning: derivatives of the optimal value, not just symbols)*

## 0) What this module is secretly doing

Up to now, dual variables (\lambda,\nu) (or (y,s)) might still feel like “Lagrangian artifacts.” Module 21 turns them into something you can *interpret* and *use*:

* **Sensitivity:** how does the optimal value change if I slightly relax/tighten constraints?
* **Shadow price:** the marginal value of a resource.
* **Certificate:** a dual feasible point can prove bounds, infeasibility, or unboundedness.

The key conceptual punchline:

[
\boxed{\text{Under strong duality, optimal multipliers are subgradients of the value function.}}
]

That’s the rigorous version of “dual variables are shadow prices.”

---

# 1) The value function (a.k.a. perturbation function)

Consider a convex problem with inequality constraints and equalities in the clean BV style:
[
\begin{aligned}
\min_x\quad & f_0(x)\
\text{s.t.}\quad & f_i(x)\le 0,\ i=1,\dots,m\
& Ax=b.
\end{aligned}
]
Now introduce **perturbations**:

* relax/tighten inequalities by (u\in\mathbb R^m),
* shift equalities by (v\in\mathbb R^p).

Define the **value function**
[
\boxed{
p(u,v):=\inf_x\Big{ f_0(x):\ f_i(x)\le u_i\ \forall i,\ Ax=b+v\Big}.
}
]
So the original optimal value is (p(0,0)=p^\star).

### Domain honesty

* If the perturbed constraints are infeasible, (p(u,v)=+\infty).
* If the infimum is unbounded below, (p(u,v)=-\infty).

This is an extended-real function.

---

# 2) Why (p(u,v)) is convex (this matters!)

### Proposition

If the original problem is convex (convex (f_0,f_i), affine equalities), then (p(u,v)) is a **convex function** of ((u,v)).

### Proof idea (clean and correct)

For each fixed (x), the constraints (f_i(x)\le u_i) and (Ax=b+v) are **affine conditions** in ((u,v)) (they describe sets in ((u,v))-space). The epigraph of (p) can be written as a projection of a convex set in ((x,u,v,t))-space. Projections of convex sets are convex, hence (\mathrm{epi}(p)) is convex, hence (p) is convex. ∎

**Commentary:**
This is why subgradients of (p) exist and matter: (p) is convex in the perturbations.

---

# 3) Dual function as a lower bound on the value function

Recall the Lagrangian (Module 20):
[
\mathcal L(x,\lambda,\nu)=f_0(x)+\sum_i\lambda_i f_i(x)+\nu^\top(Ax-b),
\quad \lambda\ge 0.
]
For the perturbed problem (f_i(x)\le u_i), (Ax=b+v), the Lagrangian becomes:
[
\mathcal L_{u,v}(x,\lambda,\nu)
=f_0(x)+\sum_i\lambda_i(f_i(x)-u_i)+\nu^\top(Ax-b-v).
]
Group the perturbations:
[
\mathcal L_{u,v}(x,\lambda,\nu)
===============================

\underbrace{f_0(x)+\sum_i\lambda_i f_i(x)+\nu^\top(Ax-b)}_{\mathcal L(x,\lambda,\nu)}
-\lambda^\top u-\nu^\top v.
]

Take inf over (x):
[
q(\lambda,\nu;u,v):=\inf_x \mathcal L_{u,v}(x,\lambda,\nu)
==========================================================

\underbrace{\inf_x\mathcal L(x,\lambda,\nu)}_{q(\lambda,\nu)}
-\lambda^\top u-\nu^\top v.
]
So
[
\boxed{
q(\lambda,\nu;u,v)=q(\lambda,\nu)-\lambda^\top u-\nu^\top v.
}
]

Now apply weak duality to the perturbed problem:
[
q(\lambda,\nu;u,v)\le p(u,v)\quad \forall \lambda\ge 0,\ \forall \nu.
]
Hence:
[
\boxed{
p(u,v)\ \ge\ q(\lambda,\nu)-\lambda^\top u-\nu^\top v.
}
]
This is a family of affine lower bounds on (p(u,v)).

---

# 4) Strong duality ⇒ multipliers are subgradients of (p)

Assume Slater holds for the original problem so that strong duality and KKT multipliers exist. Let ((\lambda^\star,\nu^\star)) be optimal dual variables for the original problem. Then:
[
p(0,0)=p^\star=d^\star=q(\lambda^\star,\nu^\star).
]

Plug into the affine lower bound:
[
p(u,v)\ge q(\lambda^\star,\nu^\star)-(\lambda^\star)^\top u-(\nu^\star)^\top v
= p(0,0)-(\lambda^\star)^\top u-(\nu^\star)^\top v.
]

Rearrange:
[
p(u,v)\ \ge\ p(0,0) + \underbrace{\begin{bmatrix}-\lambda^\star\ -\nu^\star\end{bmatrix}}_{g^\star}^\top
\begin{bmatrix}u\ v\end{bmatrix}.
]

This is exactly the subgradient inequality for convex (p) at ((-\lambda^\star,-\nu^\star)):

[
\boxed{
(-\lambda^\star,-\nu^\star)\in \partial p(0,0).
}
]

### Meaning

* (-\lambda^\star) is the subgradient of (p) with respect to inequality relaxations (u).
* (-\nu^\star) is the subgradient of (p) with respect to equality shifts (v).

So:
[
\boxed{
p(u,v)\approx p(0,0) -(\lambda^\star)^\top u - (\nu^\star)^\top v\quad\text{for small perturbations}.
}
]

That approximation becomes exact as a first-order bound; if (p) is differentiable at ((0,0)), it becomes a true gradient.

---

# 5) Shadow price interpretation (signs matter — be careful)

### Inequalities (f_i(x)\le u_i)

* Increasing (u_i) **relaxes** constraint (i) (more feasible points).
* Relaxing constraints cannot increase the minimum; it should weakly **decrease** the optimal value.

Our formula:
[
p(u,0)\gtrsim p(0,0)-\lambda^{\star\top}u.
]
Since (\lambda^\star\ge 0), increasing (u_i) lowers the bound (decreases value). Correct sign.

So (\lambda_i^\star) measures:
[
\boxed{\text{marginal decrease in optimal cost per unit relaxation of constraint }i.}
]

### Equalities (Ax=b+v)

Here (v) shifts the required target. (\nu^\star) tells you how cost changes with that shift:
[
p(0,v)\gtrsim p(0,0) - (\nu^\star)^\top v.
]
The sign depends on the problem and direction of shift.

---

# 6) A concrete example: resource constraint

Suppose
[
\min_x f(x)\quad \text{s.t. } a^\top x \le b.
]
Perturb (b\to b+u) (so (u) is “extra resource”). The multiplier (\lambda^\star\ge 0) satisfies:
[
p(b+u)\approx p(b) - \lambda^\star u.
]
So:

* if (\lambda^\star=0): resource isn’t binding; extra resource doesn’t help.
* if (\lambda^\star>0): resource is scarce; one more unit reduces optimal cost by about (\lambda^\star).

That’s literally “shadow price.”

---

# 7) Dual solutions as certificates (what they *prove*)

## 7.1 Lower bounds (always)

Any dual feasible ((\lambda,\nu)) gives:
[
q(\lambda,\nu)\le p^\star.
]
So you can certify “the optimum is at least ___.”

In numerical algorithms, this is how you get stopping criteria: primal feasible gives an upper bound; dual feasible gives a lower bound.

---

## 7.2 Infeasibility certificates (LP / conic case)

This is where Module 15’s separation becomes a practical statement.

### LP (Farkas-style)

Primal feasibility problem:
[
Ax=b,\ x\ge 0.
]
Exactly one of the following holds:

1. there exists (x\ge 0) with (Ax=b), or
2. there exists (y) such that
   [
   A^\top y \ge 0,\quad b^\top y < 0.
   ]
   The vector (y) is a **certificate**: it proves infeasibility because if (Ax=b) with (x\ge 0) existed, then
   [
   b^\top y = (Ax)^\top y = x^\top(A^\top y)\ge 0,
   ]
   contradicting (b^\top y<0).

That’s separation made algebraic.

### Conic generalization

For conic feasibility (Ax=b,\ x\in K), infeasibility certificates live in the dual cone (K^*). You’ll see conditions like
[
A^\top y \in K^*,\quad b^\top y < 0
]
as the conic analogue. Same proof structure.

---

## 7.3 Unboundedness certificates

If you can produce a feasible direction that keeps constraints satisfied while driving objective to (-\infty), that’s a primal certificate of unboundedness. Dually, infeasibility of the dual often corresponds to primal unboundedness (under mild conditions).

The safe mental picture:

* dual feasible ⇒ primal lower bounded,
* dual infeasible can be a sign of primal unboundedness (not always without assumptions, but in standard convex/closed settings yes).

---

# 8) Complementary slackness as “price only on scarce resources”

For inequality constraints:
[
\lambda_i^\star f_i(x^\star)=0.
]
Interpretation:

* If constraint has slack (f_i(x^\star)<0), then (\lambda_i^\star=0): no shadow price; it’s not scarce.
* If (\lambda_i^\star>0), then (f_i(x^\star)=0): it binds; scarcity creates price.

This is as close as math gets to economics poetry without becoming cringe.

---

# 9) End-of-Module 21 checklist (the “do you actually get dual variables?” test)

You can:

1. Define the value function (p(u,v)) and explain what perturbations mean.
2. Explain why (p(u,v)) is convex (epigraph/projection logic).
3. Derive the affine lower bound:
   [
   p(u,v)\ge q(\lambda,\nu)-\lambda^\top u-\nu^\top v.
   ]
4. Use strong duality to conclude:
   [
   (-\lambda^\star,-\nu^\star)\in\partial p(0,0).
   ]
5. Interpret (\lambda_i^\star) as a marginal value / shadow price with correct sign logic.
6. Explain how dual feasible points certify bounds, and how Farkas/conic conditions certify infeasibility.

---

## Response:
Thought for 1m 39s

Module 21 — Sensitivity, shadow prices, certificates
====================================================

_(dual variables as meaning: derivatives of the optimal value, not just symbols)_

0) What this module is secretly doing
-------------------------------------

Until now,  $\lambda,\nu$  (or conic  $y,s$ ) might still feel like “Lagrangian bookkeeping.”

This module upgrades them into **meaningful quantitative objects**:

*   **Sensitivity:** how does the optimal value move when you perturb constraints?
*   **Shadow prices:** the “marginal value” of relaxing/tightening a constraint.
*   **Certificates:** dual feasible points _prove_ bounds; special dual objects _prove_ infeasibility/unboundedness.

The punchline you should tattoo on your cortex:

$$
\boxed{\text{Under strong duality (and attainment), optimal multipliers give a supporting hyperplane to the value function.}}
$$

Equivalently:

$$
\boxed{(-\lambda^\star,-\nu^\star)\in \partial p(0,0).}
$$

So dual variables are literally (sub)derivatives of the optimal value with respect to perturbations.

* * *

1) The value function (a.k.a. perturbation function)
====================================================

Start with a standard convex problem (BV style):

$$
\begin{aligned} \min_x\quad & f_0(x)\\ \text{s.t.}\quad & f_i(x)\le 0,\quad i=1,\dots,m\\ & Ax=b, \end{aligned}
$$

where  $f_0,f_i$  are convex (extended-real allowed) and  $Ax=b$  is affine.

Now **perturb** the constraints:

*   inequalities become  $f_i(x)\le u_i$  where  $u\in\mathbb R^m$ ,
*   equalities become  $Ax=b+v$  where  $v\in\mathbb R^p$ .

Define the **value function**

$$
\boxed{ p(u,v):=\inf_x\Big\{ f_0(x)\ :\ f_i(x)\le u_i\ \forall i,\ Ax=b+v\Big\}. }
$$

The original optimal value is

$$
p(0,0)=p^\star.
$$

### Domain honesty (extended-real)

*   If the perturbed constraints are infeasible,  $p(u,v)=+\infty$ .
*   If the objective can be driven to  $-\infty$  while satisfying perturbed constraints,  $p(u,v)=-\infty$ .

So  $p$  is an extended-real function  $p:\mathbb R^{m+p}\to \mathbb R\cup\{\pm\infty\}$ .

* * *

2) Why  $p(u,v)$  is convex (full, set-geometry proof)
======================================================

This matters because “multipliers are subgradients” only makes sense when  $p$  is convex.

Proposition
-----------

If the original problem is convex (convex  $f_0,f_i$ , affine equalities), then  $p(u,v)$  is **convex** in  $(u,v)$ .

Proof (epigraph as projection)
------------------------------

Consider the epigraph of  $p$ :

$$
\mathrm{epi}(p)=\{(u,v,t):\ t\ge p(u,v)\}.
$$

Unpack the meaning  $t\ge p(u,v)$ . By definition of infimum,

$$
t\ge p(u,v) \quad\Longleftrightarrow\quad \exists x\ \text{s.t.}\ \Big(f_i(x)\le u_i,\ Ax=b+v,\ f_0(x)\le t\Big).
$$

So:

$$
\mathrm{epi}(p)=\mathrm{proj}_{(u,v,t)}\ \mathcal S,
$$

where

$$
\mathcal S := \Big\{(x,u,v,t): f_i(x)\le u_i\ \forall i,\ Ax-b=v,\ f_0(x)\le t \Big\}.
$$

Now check convexity of  $\mathcal S$  in the variables  $(x,u,v,t)$ :

*   Each constraint  $f_i(x)\le u_i$  defines a convex set in  $(x,u_i)$  because it is the epigraph-style inequality  $f_i(x)-u_i\le 0$  with  $f_i$  convex and  $-u_i$  affine.
*   The equality  $Ax-b=v$  is affine (a linear subspace/affine set) in  $(x,v)$ .
*   The inequality  $f_0(x)\le t$  defines  $\mathrm{epi}(f_0)$ , which is convex since  $f_0$  is convex.

Intersection of convex sets is convex, so  $\mathcal S$  is convex.

Finally: **projections of convex sets are convex**. Therefore  $\mathrm{epi}(p)$  is convex, hence  $p$  is convex. ∎

* * *

3) Dual affine lower bounds for the perturbed value function
============================================================

Recall the (unperturbed) Lagrangian from Module 20:

$$
\mathcal L(x,\lambda,\nu) = f_0(x)+\sum_{i=1}^m \lambda_i f_i(x)+\nu^\top(Ax-b), \qquad \lambda\ge 0.
$$

Dual function:

$$
q(\lambda,\nu)=\inf_x \mathcal L(x,\lambda,\nu).
$$

3.1 Perturbed Lagrangian
------------------------

For the perturbed constraints  $f_i(x)\le u_i$  and  $Ax=b+v$ , write them as

$$
f_i(x)-u_i\le 0,\qquad Ax-b-v=0.
$$

So the perturbed Lagrangian is:

$$
\mathcal L_{u,v}(x,\lambda,\nu) = f_0(x)+\sum_i \lambda_i(f_i(x)-u_i)+\nu^\top(Ax-b-v).
$$

Group terms:

$$
\boxed{ \mathcal L_{u,v}(x,\lambda,\nu) = \mathcal L(x,\lambda,\nu) -\lambda^\top u-\nu^\top v. }
$$

3.2 Perturbed dual function
---------------------------

Define

$$
q(\lambda,\nu;u,v):=\inf_x \mathcal L_{u,v}(x,\lambda,\nu).
$$

Using the grouping above (the perturbation part doesn’t depend on  $x$ ):

$$
\boxed{ q(\lambda,\nu;u,v) = q(\lambda,\nu)-\lambda^\top u-\nu^\top v. }
$$

3.3 Weak duality for the perturbed problem ⇒ affine minorants
-------------------------------------------------------------

Weak duality applied to the perturbed problem says:

$$
q(\lambda,\nu;u,v)\le p(u,v) \quad \forall \lambda\ge 0,\ \forall \nu.
$$

So:

$$
\boxed{ p(u,v)\ \ge\ q(\lambda,\nu)-\lambda^\top u-\nu^\top v. }
$$

Interpretation: every dual-feasible  $(\lambda,\nu)$  produces an **affine lower bound** (a supporting-hyperplane _candidate_) for the convex function  $p(u,v)$ .

* * *

4) Strong duality ⇒ optimal multipliers are subgradients of  $p$ 
=================================================================

Now assume the standard “good case” at the origin:

*   Slater holds for the original problem (at  $u=v=0$ ),
*   strong duality holds and the dual optimum is attained,
*   let  $(\lambda^\star,\nu^\star)$  be dual optimal.

Then:

$$
p(0,0)=p^\star=d^\star=q(\lambda^\star,\nu^\star).
$$

Plug  $(\lambda^\star,\nu^\star)$  into the affine lower bound:

$$
p(u,v)\ge q(\lambda^\star,\nu^\star)-(\lambda^\star)^\top u-(\nu^\star)^\top v = p(0,0)-(\lambda^\star)^\top u-(\nu^\star)^\top v.
$$

Rearrange into the exact **subgradient inequality** form:

$$
p(u,v)\ge p(0,0)+ \underbrace{\begin{bmatrix}-\lambda^\star\\ -\nu^\star\end{bmatrix}}_{g^\star}^\top \begin{bmatrix}u\\ v\end{bmatrix}.
$$

Therefore:

$$
\boxed{ (-\lambda^\star,-\nu^\star)\in \partial p(0,0). }
$$

### Important nuance (no lying with “≈”)

For a convex function, a subgradient gives a **global affine lower bound**, not automatically a two-sided approximation. What you always get is:

*   exact at  $(0,0)$ ,
*   valid lower bound everywhere.

If  $p$  happens to be differentiable at  $(0,0)$ , then this becomes an actual first-order sensitivity:

$$
\nabla_u p(0,0)=-\lambda^\star,\qquad \nabla_v p(0,0)=-\nu^\star.
$$

If not differentiable,  $\partial p(0,0)$  is a set: multiple optimal multipliers correspond to multiple supporting hyperplanes.

* * *

5) Shadow prices and sign conventions (be painfully careful)
============================================================

Your perturbation choice fixes the meaning.

5.1 Inequality perturbations  $f_i(x)\le u_i$ 
----------------------------------------------

*   Increasing  $u_i$  **relaxes** constraint  $i$ .
*   Relaxation cannot increase the minimum (more feasible options), so  $p(u,v)$  should be **nonincreasing** in each  $u_i$ .

Our subgradient statement:

$$
p(u,0)\ge p(0,0)-(\lambda^\star)^\top u.
$$

Since  $\lambda^\star\ge 0$ , the right-hand side decreases when  $u$  increases—consistent.

**Interpretation:**

$$
\boxed{\lambda_i^\star\ \text{measures the marginal *benefit* (decrease in optimal cost) from relaxing constraint }i.}
$$

More precisely,  $-\lambda^\star$  is a subgradient of  $p$  in the  $u$ \-directions.

5.2 Equality perturbations  $Ax=b+v$ 
-------------------------------------

Here  $v$  shifts the required target. The multiplier  $\nu^\star$  gives the directional sensitivity:

$$
p(0,v)\ge p(0,0)-(\nu^\star)^\top v.
$$

No positivity constraint on  $\nu^\star$ , so sensitivity can go either direction depending on geometry and objective.

### Warning: alternate Lagrangian convention flips the sign

If you instead write equality term as  $y^\top(b-Ax)$  (common in conic form), the multiplier relates to  $\partial p/\partial b$  with the opposite sign. Always track whether your Lagrangian uses  $Ax-b$  or  $b-Ax$ .

* * *

6) Two micro-examples where you can compute everything
======================================================

These are worth doing because they remove all mystical fog.

Example A (inequality):  $x^2$  with a lower bound
--------------------------------------------------

Problem:

$$
\min_{x\in\mathbb R} x^2 \quad\text{s.t.}\quad 1-x\le 0 \ \ (\text{i.e. }x\ge 1).
$$

Perturb as in this module:

$$
1-x\le u \quad\Longleftrightarrow\quad x\ge 1-u.
$$

Value function:

*   If  $u\ge 1$ , constraint is  $x\ge 1-u\le 0$ , so unconstrained minimizer  $x=0$  is feasible ⇒  $p(u)=0$ .
*   If  $u<1$ , feasible set is  $x\ge 1-u>0$ , minimizer is at boundary  $x^\star=1-u$  ⇒  $p(u)=(1-u)^2$ .

So:

$$
p(u)= \begin{cases} (1-u)^2,& u<1,\\ 0,& u\ge 1. \end{cases}
$$

This is convex and nonincreasing.

At the original problem  $u=0$ :

$$
p(0)=1,\qquad p'(0)=-2.
$$

Our theory predicts  $\nabla p(0)=-\lambda^\star$ , so  $\lambda^\star=2$ .

Check KKT:

*    $f_0(x)=x^2$ ,  $f_1(x)=1-x$ .
*   Stationarity:  $2x^\star+\lambda^\star(-1)=0\Rightarrow 2(1)-\lambda^\star=0\Rightarrow \lambda^\star=2$ .
*   Complementary slackness: constraint active so fine.

Everything matches perfectly.

Example B (equality): quadratic with a target
---------------------------------------------

Problem:

$$
\min_x \tfrac12 x^2\quad \text{s.t.}\quad x=b.
$$

Perturb  $x=b+v$ . Then

$$
p(v)=\tfrac12(b+v)^2.
$$

So  $p'(0)=b$ .

Lagrangian with the convention in Module 20:

$$
\mathcal L(x,\nu)=\tfrac12 x^2+\nu(x-b).
$$

Stationarity:  $x+\nu=0\Rightarrow \nu^\star=-x^\star=-b$ .  
Theory says  $\nabla_v p(0)=-\nu^\star=b$ . Works.

* * *

7) Dual solutions as certificates (what they _prove_, not “interpret”)
======================================================================

7.1 Bounds (always)
-------------------

*   Any primal feasible  $x$  gives an **upper bound**:  $f_0(x)\ge p^\star$ .
*   Any dual feasible  $(\lambda,\nu)$  gives a **lower bound**:  $q(\lambda,\nu)\le p^\star$ .

So in algorithms:

*   primal feasible = “here’s a candidate objective value”,
*   dual feasible = “here’s a certified bound you cannot beat.”

Duality gap = upper − lower.

7.2 Infeasibility certificates (LP / conic)
-------------------------------------------

### LP feasibility (Farkas)

For:

$$
Ax=b,\quad x\ge 0,
$$

either there exists  $x$  satisfying it, **or** there exists  $y$  with

$$
A^\top y\ge 0,\qquad b^\top y<0.
$$

That  $y$  is a _proof object_ (certificate) because if  $Ax=b$  with  $x\ge 0$  existed, then

$$
b^\top y=(Ax)^\top y=x^\top(A^\top y)\ge 0,
$$

contradiction.

### Conic analogue

For conic feasibility:

$$
Ax=b,\quad x\in K,
$$

a typical certificate has the form

$$
A^\top y \in K^*,\qquad b^\top y<0,
$$

which is the same separation logic with “ $\ge 0$ ” replaced by membership in the dual cone.

7.3 Unboundedness certificates (primal rays)
--------------------------------------------

If you can find a direction  $d$  such that

$$
Ad=0,\quad d\in K,\quad c^\top d<0,
$$

then from any feasible  $x$ ,  $x+td$  stays feasible for all  $t\ge 0$  while objective  $c^\top(x+td)\to -\infty$ . That’s a primal certificate of unboundedness.

(Dually, under standard closedness/regularity, primal unboundedness corresponds to dual infeasibility—same “either/or” geometry as separation.)

* * *

8) Complementary slackness = “price only on scarce resources”
=============================================================

For inequalities:

$$
\lambda_i^\star f_i(x^\star)=0.
$$

Meaning:

*   If  $f_i(x^\star)<0$  (slack), then  $\lambda_i^\star=0$ : no scarcity, no price.
*   If  $\lambda_i^\star>0$ , then  $f_i(x^\star)=0$ : the constraint binds, so it has value.

This is not metaphor; it’s exactly what KKT encodes.

* * *

9) End-of-Module 21 checklist (the “do you actually get it?” test)
==================================================================

You can:

1.  Define  $p(u,v)$  with full domain honesty ( $\pm\infty$ ).
2.  Prove  $p$  is convex via “epigraph = projection of a convex set.”
3.  Derive the affine lower bound:
    $$
    p(u,v)\ge q(\lambda,\nu)-\lambda^\top u-\nu^\top v.
    $$
4.  Under strong duality + attainment at  $(0,0)$ , conclude:
    $$
    (-\lambda^\star,-\nu^\star)\in\partial p(0,0).
    $$
5.  Interpret signs correctly:  $u$  relaxes inequalities, so  $\lambda^\star\ge 0$  means relaxation reduces cost.
6.  Explain certificates: dual feasible ⇒ bound; Farkas/conic dual objects ⇒ infeasibility; rays ⇒ unboundedness.

* * *



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)