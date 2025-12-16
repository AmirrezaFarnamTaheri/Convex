# Log-concavity and inequality

**User:** Anonymous (meqrvsl88948@hotmail.com)  
**Created:** 12/14/2025 11:33:06  
**Updated:** 12/16/2025 13:51:07  
**Exported:** 12/16/2025 13:51:57  
**Link:** [https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3-expanded/c/693e6f38-8f7c-8329-82b7-6bb2d68df46a](https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3-expanded/c/693e6f38-8f7c-8329-82b7-6bb2d68df46a)  

## Prompt:
Breakdown. unpack, explain this:

## Exercise 3.47 (BV): first-order inequality ⇔ log-concavity 

### Statement (with all assumptions / domain bits)

Let (f:\mathbb{R}^n\to\mathbb{R}) be **differentiable**, with **convex domain** (\mathrm{dom},f), and assume (f(x)>0) for all (x\in\mathrm{dom},f). Prove that (f) is **log-concave** (i.e. (\log f) is concave) **iff** for all (x,y\in\mathrm{dom},f),
[
\boxed{\ \frac{f(y)}{f(x)}\le \exp!\left(\frac{\nabla f(x)^\top (y-x)}{f(x)}\right)\ }\tag{★}
]
This is exactly the exercise statement in your document. 

---

## 0) First translate (★) into a “tangent plane” inequality for (\log f)

Because (f(x)>0) on the domain, (\log f(x)) is well-defined everywhere on (\mathrm{dom},f). Also (\log(\cdot)) is **strictly increasing**, so we can take logs without flipping inequalities.

Take (\log) of both sides of (★):
[
\log f(y)-\log f(x)\ \le\ \frac{\nabla f(x)^\top (y-x)}{f(x)}.
]
Use the chain rule identity
[
\nabla(\log f)(x)=\frac{1}{f(x)}\nabla f(x)
]
(which we’ll derive explicitly in a moment), to rewrite the RHS:
[
\log f(y)\ \le\ \log f(x)+\nabla(\log f)(x)^\top (y-x).\tag{T}
]
So (★) is **equivalent** to (T). This is the whole game: **(T) says “(\log f) lies below its tangent hyperplane at every point.”** 

Thus the exercise reduces to:

> (\log f) is concave on (\mathrm{dom},f)  **iff**  it satisfies the global tangent upper bound (T).

That equivalence is a standard (but crucial) theorem about differentiable concave functions. 

---

## 1) Core lemma: concavity ⇔ “global tangent upper bound”

Let (h:\mathcal D\to\mathbb R) be differentiable on a **convex** set (\mathcal D\subseteq\mathbb R^n).

### Lemma

[
\boxed{\ h \text{ is concave on }\mathcal D\ \Longleftrightarrow\ h(y)\le h(x)+\nabla h(x)^\top (y-x)\ \ \forall x,y\in\mathcal D. \ }\tag{L}
]
This is exactly what your file calls the “key lemma.” 

I’ll prove both directions **from first principles**, and I’ll be annoyingly explicit about where “domain is convex” is used.

---

### (⇒) If (h) is concave, then (L) holds

Fix (x,y\in\mathcal D). Because (\mathcal D) is convex, the whole segment
[
x+t(y-x)\in\mathcal D\quad \forall t\in[0,1]
]
stays inside the domain (this is the *only* reason we assume convex domain).

Define a 1D function along the segment:
[
\varphi(t):=h(x+t(y-x)),\qquad t\in[0,1].
]
Because (h) is concave on (\mathcal D), (\varphi) is concave on ([0,1]) (concavity survives restriction to a line).

Now use a pure 1D fact:

> **1D concavity tangent fact.** If (\varphi) is concave and differentiable at (0), then for all (t\in[0,1]),
> [
> \varphi(t)\le \varphi(0)+\varphi'(0),t.
> ]
> (Geometrically: concave curves lie below their tangent line.)

Apply it at (t=1):
[
\varphi(1)\le \varphi(0)+\varphi'(0).
]
Now translate each term back:

* (\varphi(0)=h(x))
* (\varphi(1)=h(y))
* By the multivariable chain rule for curves,
  [
  \varphi'(0)=\nabla h(x)^\top (y-x).
  ]

So:
[
h(y)\le h(x)+\nabla h(x)^\top (y-x),
]
which is exactly (L). (This is the same derivation your file sketches, just with the “restrict to a line” logic made explicit. )

---

### (⇐) If (L) holds, then (h) is concave

Assume the inequality (L) holds for all (x,y\in\mathcal D). We must prove concavity:
[
h(\theta x+(1-\theta)y)\ \ge\ \theta h(x)+(1-\theta)h(y)\quad \forall x,y\in\mathcal D,\ \theta\in[0,1].
]

Fix (x,y\in\mathcal D) and (\theta\in[0,1]). Define the midpoint-like mixture point
[
z:=\theta x+(1-\theta)y.
]
Because (\mathcal D) is convex, (z\in\mathcal D). (**This is exactly where convexity of the domain is used.**)

Now apply (L) twice, **both times with basepoint (z)**:

1. with “(x)” playing the role of “(y)” in (L):
   [
   h(x)\le h(z)+\nabla h(z)^\top (x-z),
   ]
2. with (y):
   [
   h(y)\le h(z)+\nabla h(z)^\top (y-z).
   ]

Multiply the first by (\theta), the second by (1-\theta), and add:
[
\theta h(x)+(1-\theta)h(y)
\le
\theta h(z)+(1-\theta)h(z)+\nabla h(z)^\top\big(\theta(x-z)+(1-\theta)(y-z)\big).
]
The scalar part becomes (h(z)). For the vector part, expand:
[
\theta(x-z)+(1-\theta)(y-z)
=\theta x+(1-\theta)y-z
=z-z=0.
]
So the gradient term vanishes, leaving
[
\theta h(x)+(1-\theta)h(y)\le h(z)=h(\theta x+(1-\theta)y),
]
which is concavity. This is exactly the “multiply and the gradient cancels” trick shown in your file. 

Lemma proved.

---

## 2) Apply the lemma to (h=\log f)

Define
[
h(x):=\log f(x).
]
This is valid on (\mathrm{dom},f) because (f>0) there. 

So:
[
f \text{ log-concave}\ \Longleftrightarrow\ h=\log f \text{ concave}.
]
By the lemma, (h) is concave **iff** it satisfies the tangent upper bound:
[
\log f(y)\le \log f(x)+\nabla(\log f)(x)^\top (y-x)\quad \forall x,y\in\mathrm{dom},f.\tag{T}
]
Thus all that remains is to compute (\nabla(\log f)(x)) and rewrite (T) into (★).

---

## 3) Compute (\nabla(\log f)(x)) (no handwaving)

Because (f) is differentiable and (f(x)>0), the scalar function (\log(f(x))) is differentiable, and for each coordinate (i),
[
\frac{\partial}{\partial x_i}\log f(x)
=(\log)'(f(x))\cdot \frac{\partial f(x)}{\partial x_i}
=\frac{1}{f(x)},\frac{\partial f(x)}{\partial x_i}.
]
Stacking these components gives
[
\boxed{\ \nabla(\log f)(x)=\frac{1}{f(x)},\nabla f(x).\ }\tag{C}
]
This is exactly what your file derives. 

---

## 4) Finish both directions (the “iff”)

### Direction 1: log-concave ⇒ inequality (★)

Assume (f) is log-concave, i.e. (\log f) is concave on (\mathrm{dom},f). By the lemma, (T) holds. Substitute (C):
[
\log f(y)\le \log f(x)+\left(\frac{\nabla f(x)}{f(x)}\right)^\top (y-x)
=\log f(x)+\frac{\nabla f(x)^\top (y-x)}{f(x)}.
]
Subtract (\log f(x)):
[
\log\frac{f(y)}{f(x)}\le \frac{\nabla f(x)^\top (y-x)}{f(x)}.
]
Exponentiate (allowed; (\exp) is increasing), yielding (★):
[
\frac{f(y)}{f(x)}\le \exp!\left(\frac{\nabla f(x)^\top (y-x)}{f(x)}\right).
]
These exact algebra steps appear in your file too. 

### Direction 2: inequality (★) ⇒ log-concave

Assume (★) holds for all (x,y\in\mathrm{dom},f). Because (f>0), we can take logs:
[
\log\frac{f(y)}{f(x)}\le \frac{\nabla f(x)^\top (y-x)}{f(x)}.
]
Rewrite the left side as (\log f(y)-\log f(x)), and again use (C) to get exactly (T):
[
\log f(y)\le \log f(x)+\nabla(\log f)(x)^\top (y-x).
]
By the lemma, this implies (\log f) is concave on (\mathrm{dom},f), i.e. (f) is log-concave.

So the equivalence is proved.

---

## What the inequality is really saying (intuition, but still precise)

The concavity of (\log f) is an **additive** statement:
[
\log f(y)\ \le\ \log f(x)+\text{(linear function of }y-x).
]
Exponentiating turns this into a **multiplicative** growth control:
[
f(y)\ \le\ f(x)\cdot \exp!\big(\nabla(\log f)(x)^\top (y-x)\big),
]
i.e. “in log-space, (f) can’t grow faster than its tangent hyperplane.”

Equality happens exactly when (\log f) is affine along the segment between (x) and (y) (so the tangent bound is tight).

---

You said “3.47 next,” so this is the complete 3.47. If you now mean **Exercise 3.48** next (the natural continuation in your file), it’s the “subtracting a constant preserves log-concavity on ({f>a})” result, and we can do it with the same level of domain paranoia.

## Response:
Great — let’s now go **zero-to-hero**, **triple-rigorous**, and ultra-explicit on **Exercise 3.47 from Boyd & Vandenberghe**:

* * *

🚩 Problem Recap: Log-concavity ⇔ First-order Inequality
========================================================

We are given:

*   A function  $f: \mathbb{R}^n \to \mathbb{R}$ 
*   Assumptions:
    *    $f$  is **differentiable**,
    *    $\mathrm{dom}\, f \subseteq \mathbb{R}^n$  is **convex**,
    *    $f(x) > 0 \quad \forall x \in \mathrm{dom}\, f$ 

We are to prove the **equivalence**:

* * *

🔄 Claim
--------

The following two statements are equivalent:

*   (1)  $f$  is **log-concave**, i.e.,  $\log f$  is **concave** on  $\mathrm{dom}\, f$ 
*   (2) For all  $x, y \in \mathrm{dom}\, f$ , we have:
    $$
    \boxed{ \frac{f(y)}{f(x)} \leq \exp\left( \frac{\nabla f(x)^\top (y - x)}{f(x)} \right) } \tag{★}
    $$

* * *

🔧 Step-by-Step Proof Plan
==========================

We'll walk through the equivalence in **four layers**:

### ✅ Step 0: Take log of both sides of (★), show it’s equivalent to the tangent plane inequality for  $\log f$ 

### ✅ Step 1: Prove a core lemma:

**Concave ⇔ Lies below tangent plane** (global first-order condition)

### ✅ Step 2: Apply the lemma to  $\log f$ 

### ✅ Step 3: Carefully compute  $\nabla(\log f)(x)$ 

### ✅ Step 4: Complete both directions of the “⇔” equivalence

* * *

🧮 Step 0: Take log of both sides of (★)
----------------------------------------

We start from:

$$
\frac{f(y)}{f(x)} \leq \exp\left( \frac{\nabla f(x)^\top (y - x)}{f(x)} \right) \tag{★}
$$

Because  $f(x) > 0$ , we can safely take logs. The natural log is **strictly increasing**, so the inequality direction is preserved:

$$
\log \left( \frac{f(y)}{f(x)} \right) \leq \frac{\nabla f(x)^\top (y - x)}{f(x)} \Rightarrow \log f(y) - \log f(x) \leq \frac{\nabla f(x)^\top (y - x)}{f(x)}
$$

Define:

$$
h(x) := \log f(x)
$$

Then:

$$
h(y) - h(x) \leq \nabla h(x)^\top (y - x) \tag{T}
$$

So:

$$
\boxed{★ \iff \log f(y) \leq \log f(x) + \nabla (\log f)(x)^\top (y - x)} \tag{T}
$$

This is the **first-order upper bound** (tangent plane) condition for **concavity**.

* * *

🧠 Step 1: Lemma — Concave ⇔ First-order upper bound
----------------------------------------------------

Let  $h: \mathcal{D} \to \mathbb{R}$  be differentiable on a **convex** domain  $\mathcal{D} \subseteq \mathbb{R}^n$ .

Then:

$$
\boxed{ h \text{ concave } \iff \forall x, y \in \mathcal{D}, \quad h(y) \leq h(x) + \nabla h(x)^\top (y - x) } \tag{L}
$$

We prove both directions.

* * *

### 🔁 (⇒) Concave ⇒ Inequality

Suppose  $h$  is concave on convex  $\mathcal{D}$ . Fix  $x, y \in \mathcal{D}$ . Since  $\mathcal{D}$  is convex, the whole line segment  $x + t(y - x)$  for  $t \in [0,1]$  stays inside  $\mathcal{D}$ .

Define:

$$
\varphi(t) := h(x + t(y - x)) \quad\text{for } t \in [0,1]
$$

Then  $\varphi$  is a **composition** of a concave  $h$  with a linear map ⇒  $\varphi$  is concave on  $[0,1]$ .

From 1D concavity:  
For differentiable  $\varphi$ , concavity ⇒

$$
\varphi(1) \leq \varphi(0) + \varphi'(0)
$$

Compute:

*    $\varphi(1) = h(y)$ 
*    $\varphi(0) = h(x)$ 
*    $\varphi'(0) = \nabla h(x)^\top (y - x)$  (chain rule)

So:

$$
h(y) \leq h(x) + \nabla h(x)^\top (y - x)
$$

This proves one direction of the lemma.

* * *

### 🔁 (⇐) Inequality ⇒ Concave

Assume:

$$
h(y) \leq h(x) + \nabla h(x)^\top (y - x) \quad \forall x,y\in\mathcal{D}
$$

We need to prove:

$$
h(\theta x + (1 - \theta)y) \geq \theta h(x) + (1 - \theta) h(y) \quad \forall \theta \in [0,1]
$$

Let:

$$
z := \theta x + (1 - \theta) y \in \mathcal{D} \quad \text{(by convexity)}
$$

Apply the inequality (L) **twice**, both times with basepoint  $z$ :

*    $h(x) \leq h(z) + \nabla h(z)^\top (x - z)$ 
*    $h(y) \leq h(z) + \nabla h(z)^\top (y - z)$ 

Multiply:

*   First inequality by  $\theta$ 
*   Second by  $(1 - \theta)$ 

Add:

$$
\theta h(x) + (1 - \theta) h(y) \leq h(z) + \nabla h(z)^\top [\theta (x - z) + (1 - \theta)(y - z)]
$$

But:

$$
\theta (x - z) + (1 - \theta)(y - z) = \theta x + (1 - \theta) y - z = z - z = 0
$$

So the gradient term drops out, and we are left with:

$$
\theta h(x) + (1 - \theta) h(y) \leq h(z) \Rightarrow h(\theta x + (1 - \theta) y) \geq \theta h(x) + (1 - \theta) h(y)
$$

This is exactly concavity.

✅ Lemma proved.

* * *

📌 Step 2: Apply Lemma to  $h(x) = \log f(x)$ 
----------------------------------------------

Assume  $f(x) > 0$ . Then  $\log f(x)$  is well-defined and differentiable. So:

$$
f \text{ log-concave } \iff \log f \text{ is concave } \iff \log f(y) \leq \log f(x) + \nabla (\log f)(x)^\top (y - x) \tag{T}
$$

We're almost done — we just need to compute  $\nabla(\log f)(x)$  explicitly.

* * *

🧮 Step 3: Compute  $\nabla(\log f)(x)$ 
----------------------------------------

Apply multivariable chain rule:

For scalar function  $f: \mathbb{R}^n \to \mathbb{R}_{>0}$ :

Each component:

$$
\frac{\partial}{\partial x_i} \log f(x) = \frac{1}{f(x)} \cdot \frac{\partial f(x)}{\partial x_i}
$$

So the gradient is:

$$
\boxed{ \nabla(\log f)(x) = \frac{1}{f(x)} \nabla f(x) } \tag{C}
$$

Plug this into (T):

$$
\log f(y) \leq \log f(x) + \frac{1}{f(x)} \nabla f(x)^\top (y - x)
$$

Exponentiating:

$$
\frac{f(y)}{f(x)} \leq \exp\left( \frac{\nabla f(x)^\top (y - x)}{f(x)} \right)
$$

Which is exactly (★).

* * *

🔁 Step 4: Prove the ⇐ and ⇒ directions
---------------------------------------

### Direction 1:  $f$  log-concave ⇒ (★)

*    $f$  log-concave ⇒  $\log f$  concave ⇒ inequality (T) holds.
*   Plug in  $\nabla(\log f)(x) = \frac{1}{f(x)} \nabla f(x)$ 
*   Inequality (★) follows.

### Direction 2: Inequality (★) ⇒  $f$  log-concave

Assume:

$$
\frac{f(y)}{f(x)} \leq \exp\left( \frac{\nabla f(x)^\top (y - x)}{f(x)} \right)
$$

Take log:

$$
\log f(y) - \log f(x) \leq \frac{\nabla f(x)^\top (y - x)}{f(x)} \Rightarrow \log f(y) \leq \log f(x) + \nabla(\log f)(x)^\top (y - x)
$$

So  $\log f$  satisfies the global tangent bound ⇒ concave ⇒  $f$  is log-concave.

* * *

🔍 Final Interpretation
-----------------------

Let’s re-interpret the inequality (★):

*   In additive (log) terms:
    $$
    \log f(y) \leq \log f(x) + \nabla(\log f)(x)^\top (y - x)
    $$
    So log  $f$  grows no faster than a **linear function** ⇒ concavity.
*   In multiplicative terms:
    $$
    f(y) \leq f(x) \cdot \exp\left( \nabla(\log f)(x)^\top (y - x) \right)
    $$
    So  $f$  grows no faster than an **exponential** controlled by the gradient of  $\log f$ 

This is useful in exponential families, multiplicative models, economics, and entropy-like settings where **growth rates** matter more than values.

* * *

✅ Summary
---------

| Feature | Additive (log space) | Multiplicative (original space) |
| --- | --- | --- |
| Tangent bound |  $\log f(y) \leq \log f(x) + \nabla(\log f)(x)^\top (y - x)$  |  $f(y) \leq f(x) \cdot \exp( \nabla(\log f)(x)^\top (y - x) )$  |
| Type | Linear upper bound | Exponential growth control |
| Significance | Concavity of  $\log f$  | Log-concavity of  $f$  |

* * *

If you want to proceed to **Exercise 3.48** (log-concavity preserved under truncation:  $\{ f > a \}$ ), we’ll directly use the above as a building block. Just confirm.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)