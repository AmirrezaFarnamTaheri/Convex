# Exercise 3.31 breakdown

**User:** Anonymous (meqrvsl88948@hotmail.com)  
**Created:** 12/14/2025 11:32:17  
**Updated:** 12/14/2025 13:24:10  
**Exported:** 12/16/2025 13:52:10  
**Link:** [https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3-expanded/c/693e6f07-af78-8328-bcf7-f43132fa9d20](https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3-expanded/c/693e6f07-af78-8328-bcf7-f43132fa9d20)  

## Prompt:
Breakdown, unpack, explain this:

Got it. **Exercise 3.31** is a sneaky one: it builds the “best positively homogeneous (degree-1) minorant” of a convex function by *radially rescaling*.

We’re given a **convex** function (f:\mathbb R^n\to\mathbb R\cup{+\infty}) (at least proper on rays we touch), and we define
[
g(x);=;\inf_{\alpha>0}\frac{f(\alpha x)}{\alpha}.
]
We must prove:

**(a)** (g) is homogeneous: (g(tx)=t,g(x)) for all (t\ge 0).
**(b)** (g) is the largest homogeneous underestimator of (f).
**(c)** (g) is convex.

I will be **domain-honest**: the inf can be (+\infty) or (-\infty) if (f) is pathological; BV typically intends (f) proper and (often implicitly) (f(0)=0) or at least (f(0)\ge 0) so (g) is not (-\infty). I’ll flag exactly where that matters.

---

# 0) Domain and finiteness sanity checks (so we don’t cheat)

For a fixed (x), define the ray function
[
\phi_x(\alpha)=\frac{f(\alpha x)}{\alpha},\qquad \alpha>0.
]
Then
[
g(x)=\inf_{\alpha>0}\phi_x(\alpha).
]

* If (f(\alpha x)=+\infty) for all (\alpha>0), then (g(x)=+\infty).
* If (f(0)<0), then (g(0)=\inf_{\alpha>0} \frac{f(0)}{\alpha}=-\infty). This is why BV typically lives with (f(0)\ge 0) (or normalizes to (f(0)=0)).

Nothing breaks in the *formal* proofs if we allow (\pm\infty), but for “nice” convex analysis, you usually want (g) proper (not identically (+\infty), and not (-\infty) somewhere). I’ll proceed with inequalities that remain valid whenever the expressions are defined in (\mathbb R\cup{\pm\infty}).

---

# (a) Positive homogeneity: (g(tx)=t g(x)) for (t\ge 0)

## Case 1: (t>0)

Start from the definition:
[
g(tx)=\inf_{\alpha>0}\frac{f(\alpha(tx))}{\alpha}
=\inf_{\alpha>0}\frac{f((\alpha t)x)}{\alpha}.
]

Now do a **change of variable**:
[
\beta=\alpha t \quad\Longleftrightarrow\quad \alpha=\beta/t.
]
Since (t>0), (\alpha>0 \iff \beta>0). So the infimum over (\alpha>0) is the same as the infimum over (\beta>0).

Then
[
g(tx)
=\inf_{\beta>0}\frac{f(\beta x)}{\beta/t}
=t\inf_{\beta>0}\frac{f(\beta x)}{\beta}
=t,g(x).
]

✅ So (g(tx)=t g(x)) for all (t>0).

## Case 2: (t=0)

We need to show (g(0)=0\cdot g(x)=0). But beware: if (f(0)<0), then (g(0)=-\infty). So:

* If (f(0)\ge 0), then for (\alpha>0),
  [
  \frac{f(\alpha\cdot 0)}{\alpha}=\frac{f(0)}{\alpha}\ge 0,
  ]
  hence (g(0)=\inf_{\alpha>0} f(0)/\alpha = 0). So homogeneity holds at (t=0).
* If (f(0)<0), then (g(0)=-\infty) and the identity (g(0)=0) fails (but then the whole “largest homogeneous underestimator” story becomes degenerate).

So under the standard mild condition (f(0)\ge 0) (and in particular if (f(0)=0)), we get:
[
\boxed{g(tx)=t g(x)\ \ \forall t\ge 0.}
]

---

# (b) (g) is the largest homogeneous underestimator of (f)

We must show two things:

1. (g(x)\le f(x)) for all (x). (So (g) is an underestimator.)
2. If (h) is homogeneous and (h\le f), then (h\le g).

## Step 1: (g\le f)

Pick (\alpha=1) in the inf defining (g(x)):
[
g(x)=\inf_{\alpha>0}\frac{f(\alpha x)}{\alpha}\le \frac{f(1\cdot x)}{1}=f(x).
]
So (g(x)\le f(x)) for all (x) (whenever (f(x)) is defined; if (f(x)=+\infty), it’s still true).

✅ Underestimator proved.

## Step 2: Maximality among homogeneous underestimators

Assume (h) is **homogeneous** (degree 1): (h(\alpha x)=\alpha h(x)) for all (\alpha>0), and assume
[
h(x)\le f(x)\quad \forall x.
]

Fix any (x) and any (\alpha>0). Apply the underestimator inequality at the point (\alpha x):
[
h(\alpha x)\le f(\alpha x).
]
Now use homogeneity of (h): (h(\alpha x)=\alpha h(x)). Divide by (\alpha>0):
[
h(x)\le \frac{f(\alpha x)}{\alpha}.
]
This is true for **every** (\alpha>0). Therefore it is true for the infimum over (\alpha>0):
[
h(x)\le \inf_{\alpha>0}\frac{f(\alpha x)}{\alpha}=g(x).
]

Since (x) was arbitrary,
[
\boxed{h\le g.}
]

✅ So (g) is the **largest** homogeneous function lying below (f).

(Notice: we never needed (f(0)=0) for this step; only (\alpha>0).)

---

# (c) Convexity of (g)

This is the interesting part. A trap: (g) is an **infimum** over (\alpha) of convex functions (x\mapsto f(\alpha x)/\alpha), and *infimum of convex functions is not convex in general*. So we need to exploit **convexity of (f)** more cleverly.

BV’s intended path is:

1. Use convexity of (f) to show the map (\alpha\mapsto f(\alpha x)/\alpha) is monotone (when (f(0)=0) or (f(0)\ge 0)),
2. identify (g(x)) with the **directional derivative at 0**,
3. show that directional derivative is **sublinear** (homogeneous + subadditive),
4. conclude convexity.

I’ll do it with complete steps, and I’ll mark exactly where (f(0)=0) is used.

---

## Step C1: If (f(0)=0), then (\alpha\mapsto \frac{f(\alpha x)}{\alpha}) is nondecreasing

Assume (f) is convex and (f(0)=0). Fix (x). Take (0<\beta<\alpha). Write
[
\beta x = \lambda(\alpha x) + (1-\lambda)0,\quad \text{where }\lambda=\beta/\alpha\in(0,1).
]
By convexity of (f),
[
f(\beta x)\le \lambda f(\alpha x)+(1-\lambda)f(0)=\frac{\beta}{\alpha}f(\alpha x)+\left(1-\frac{\beta}{\alpha}\right)\cdot 0.
]
Divide by (\beta>0):
[
\frac{f(\beta x)}{\beta}\le \frac{f(\alpha x)}{\alpha}.
]
So the ratio is nondecreasing in (\alpha).

**Consequence:** since it’s nondecreasing on ((0,\infty)),
[
\inf_{\alpha>0}\frac{f(\alpha x)}{\alpha}
=========================================

\lim_{\alpha\downarrow 0}\frac{f(\alpha x)}{\alpha}.
]
So (under (f(0)=0)),
[
\boxed{g(x)=\lim_{t\downarrow 0}\frac{f(tx)}{t}.}
]
That limit is exactly the **directional derivative of (f) at 0 in direction (x)**, often denoted (f'(0;x)).

> If you only know (f(0)\ge 0), you still get an “almost” monotonicity with an error term (f(0)), but the clean identification with the directional derivative is what BV usually wants.

From now on in (c), I will assume the standard normalization **(f(0)=0)** (it’s the natural one here; otherwise the “largest homogeneous underestimator” is still defined but can get awkward at (x=0)).

---

## Step C2: Prove subadditivity: (g(x+y)\le g(x)+g(y))

Using the directional-derivative representation:
[
g(x)=\lim_{t\downarrow 0}\frac{f(tx)}{t}.
]

Take any (x,y). For any (t>0),
[
t(x+y)=\frac12 (2tx)+\frac12(2ty).
]
Convexity of (f) gives
[
f(t(x+y)) \le \frac12 f(2tx)+\frac12 f(2ty).
]
Divide by (t>0):
[
\frac{f(t(x+y))}{t}\le \frac12\frac{f(2tx)}{t}+\frac12\frac{f(2ty)}{t}
= \frac{f(2tx)}{2t}+\frac{f(2ty)}{2t}.
]
Now take the limit (t\downarrow 0). Since (2t\downarrow 0) as well,
[
\lim_{t\downarrow 0}\frac{f(2tx)}{2t}=g(x),\qquad
\lim_{t\downarrow 0}\frac{f(2ty)}{2t}=g(y).
]
So
[
g(x+y)=\lim_{t\downarrow 0}\frac{f(t(x+y))}{t}
\le \lim_{t\downarrow 0}\left(\frac{f(2tx)}{2t}+\frac{f(2ty)}{2t}\right)
=g(x)+g(y).
]

✅ Subadditivity proved.

---

## Step C3: Combine with homogeneity to get convexity

We already proved in part (a) that (g) is positively homogeneous:
[
g(\lambda x)=\lambda g(x)\quad \forall \lambda\ge 0.
]

A standard fact: **positive homogeneity + subadditivity ⇒ convexity**. Here’s the proof (one line, but explicit):

Take (x,y) and (\theta\in[0,1]). Then
[
g(\theta x+(1-\theta)y)
\le g(\theta x)+g((1-\theta)y) \quad (\text{subadditivity})
= \theta g(x)+(1-\theta)g(y)\quad (\text{homogeneity}).
]
That is exactly Jensen convexity.

So
[
\boxed{g\ \text{is convex.}}
]

---

# Final results (with the minimal assumptions called out)

* **(a)** If (f(0)\ge 0), then (g) is positively homogeneous on (t\ge 0). (If (f(0)<0), then (g(0)=-\infty).)
* **(b)** For any convex (f), (g\le f) and (g) is the **largest** degree-1 homogeneous underestimator.
* **(c)** If (f) is convex and normalized so that (f(0)=0) (the standard setup here), then (g(x)=\lim_{t\downarrow 0} f(tx)/t) and (g) is **sublinear** (homogeneous + subadditive), hence **convex**.

---

If you want, I can also add a very useful interpretation: **(g) is the support function of (\partial f(0))** when (f) is closed convex with (f(0)=0), i.e.
[
g(x)=\sup_{s\in\partial f(0)} s^\top x,
]
which makes (a)(c) instantly obvious and makes (b) feel inevitable.

## Response:
Updated saved memory

Great. Let's unpack the entirety of **Exercise 3.31** from scratch, in full detail, with a focus on understanding:

*   What is being defined
*   Why this construction makes sense
*   How each proof step works and what it's leveraging
*   How to interpret the final object  $g(x) = \inf_{\alpha > 0} \frac{f(\alpha x)}{\alpha}$ 

* * *

🧭 Roadmap for the Breakdown
----------------------------

We will proceed step-by-step, grounding everything from first principles:

### 0\. Preliminaries & Definitions

*   What is the setup?
*   What are the domain issues?
*   What does this rescaling do?

### 1\. Part (a): Prove that  $g$  is positively homogeneous

### 2\. Part (b): Prove that  $g$  is the largest positively homogeneous underestimator of  $f$ 

### 3\. Part (c): Prove that  $g$  is convex

### 4\. Optional (bonus): Link to directional derivatives and subdifferential geometry

* * *

0\. Setup, Domain, and the Function  $g$ 
=========================================

We're given a function:

$$
f : \mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}
$$

and define a new function  $g : \mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$  by:

$$
g(x) := \inf_{\alpha > 0} \frac{f(\alpha x)}{\alpha}
$$

This is often called the **homogeneous envelope** of  $f$ .

Let’s understand what this is doing:

### 🔁 Intuition: Radial Rescaling

We're moving along the ray in direction  $x$ , that is, along all vectors  $\alpha x$  for  $\alpha > 0$ , and we’re evaluating  $f(\alpha x)/\alpha$  at each point. Then we take the infimum.

This quantity is like asking:

> "What’s the smallest average cost per unit of size when moving along the ray in direction  $x$ ?"

This function  $g$  naturally builds in **homogeneity**, because we’re normalizing out the scale.

### ⚠️ Domain issues

Let’s define the "ray function":

$$
\phi_x(\alpha) := \frac{f(\alpha x)}{\alpha}, \qquad \alpha > 0
$$

Then:

$$
g(x) = \inf_{\alpha > 0} \phi_x(\alpha)
$$

We immediately get some subtleties:

*   If  $f(\alpha x) = +\infty$  for all  $\alpha > 0$ , then  $g(x) = +\infty$ 
*   If  $f(0) < 0$ , then for any  $\alpha > 0$ ,
    $$
    \frac{f(0)}{\alpha} \to -\infty
    $$
    so  $g(0) = -\infty$ 

Therefore, **we typically assume**:

*    $f(0) \ge 0$ , or normalize  $f(0) = 0$ 
*    $f$  proper on at least some rays

Otherwise,  $g$  could be  $-\infty$  at the origin, which breaks homogeneity.

* * *

Part (a): Prove  $g$  is positively homogeneous
===============================================

We want:

$$
g(t x) = t g(x), \quad \forall t \ge 0
$$

Let’s split into cases:

* * *

### ✅ Case 1:  $t > 0$ 

Start with definition:

$$
g(t x) = \inf_{\alpha > 0} \frac{f(\alpha t x)}{\alpha}
$$

Make a change of variable:  
Let  $\beta = \alpha t \Rightarrow \alpha = \beta / t$ . Since  $t > 0$ , the mapping  $\alpha \mapsto \beta$  is bijective over  $(0, \infty)$ .

So:

$$
g(t x) = \inf_{\beta > 0} \frac{f(\beta x)}{\beta / t} = t \inf_{\beta > 0} \frac{f(\beta x)}{\beta} = t g(x)
$$

* * *

### ✅ Case 2:  $t = 0$ 

Then  $g(0) = \inf_{\alpha > 0} \frac{f(0)}{\alpha}$ 

Now:

*   If  $f(0) > 0$ : then  $g(0) = 0$ 
*   If  $f(0) = 0$ : then  $g(0) = 0$ 
*   If  $f(0) < 0$ : then  $g(0) = -\infty$ , which ruins homogeneity

So under the (standard) assumption that  $f(0) \ge 0$ , we have:

$$
g(0) = 0 = 0 \cdot g(x)
$$

✅ So:

$$
\boxed{g(t x) = t g(x) \quad \forall t \ge 0}
$$

* * *

Part (b): Show  $g$  is the **largest** homogeneous underestimator
==================================================================

### Claim:

1.   $g(x) \le f(x)$  for all  $x$ 
2.  If  $h$  is any **positively homogeneous** function with  $h(x) \le f(x)$ , then  $h(x) \le g(x)$ 

* * *

✅ Step 1:  $g(x) \le f(x)$ 
---------------------------

Just pick  $\alpha = 1$  in the infimum:

$$
g(x) = \inf_{\alpha > 0} \frac{f(\alpha x)}{\alpha} \le \frac{f(x)}{1} = f(x)
$$

* * *

✅ Step 2: Maximality
--------------------

Let  $h$  be a function such that:

*    $h(\alpha x) = \alpha h(x)$  for all  $\alpha > 0$ 
*    $h(x) \le f(x)$  for all  $x$ 

Then for any  $\alpha > 0$ , we have:

$$
h(\alpha x) \le f(\alpha x) \Rightarrow \alpha h(x) \le f(\alpha x) \Rightarrow h(x) \le \frac{f(\alpha x)}{\alpha}
$$

This is true for every  $\alpha > 0$ , so:

$$
h(x) \le \inf_{\alpha > 0} \frac{f(\alpha x)}{\alpha} = g(x)
$$

Therefore:

$$
\boxed{g(x) = \sup \{ h(x) \mid h \le f, \ h \text{ positively homogeneous} \}}
$$

* * *

Part (c): Prove that  $g$  is convex
====================================

This is subtle, because:

*   Infimum of convex functions is not necessarily convex
*    $g$  is defined as such an infimum, so we must exploit something else

We’ll proceed through a **directional derivative** interpretation.

* * *

Step 1: Directional derivative connection
-----------------------------------------

Assume:  $f$  is convex and  $f(0) = 0$ 

Let’s fix  $x \in \mathbb{R}^n$ . Then:

We will show:

$$
g(x) = \lim_{t \downarrow 0} \frac{f(tx)}{t}
$$

This is the **directional derivative of  $f$  at 0 in direction  $x$ **:

$$
f'(0; x) := \lim_{t \downarrow 0} \frac{f(0 + t x) - f(0)}{t} = \lim_{t \downarrow 0} \frac{f(tx)}{t}
$$

Let’s verify that this limit equals the infimum:

We first show that for  $0 < \beta < \alpha$ , we have:

$$
\frac{f(\beta x)}{\beta} \le \frac{f(\alpha x)}{\alpha}
$$

This is due to convexity of  $f$  and the fact that  $f(0) = 0$ :

$$
\beta x = \lambda \alpha x + (1 - \lambda) 0 \quad \text{with } \lambda = \beta/\alpha \in (0,1) \Rightarrow f(\beta x) \le \lambda f(\alpha x) \Rightarrow \frac{f(\beta x)}{\beta} \le \frac{f(\alpha x)}{\alpha}
$$

Hence  $\phi_x(\alpha) = f(\alpha x)/\alpha$  is nondecreasing in  $\alpha$ , and so:

$$
\inf_{\alpha > 0} \frac{f(\alpha x)}{\alpha} = \lim_{\alpha \downarrow 0} \frac{f(\alpha x)}{\alpha} \Rightarrow \boxed{g(x) = f'(0; x)}
$$

* * *

Step 2: Prove subadditivity
---------------------------

Take any  $x, y \in \mathbb{R}^n$ . Then:

$$
g(x + y) = \lim_{t \downarrow 0} \frac{f(t(x + y))}{t}
$$

Now note:

$$
t(x+y) = \frac{1}{2} \cdot 2t x + \frac{1}{2} \cdot 2t y \Rightarrow f(t(x + y)) \le \frac{1}{2} f(2t x) + \frac{1}{2} f(2t y)
$$

Divide both sides by  $t$ :

$$
\frac{f(t(x+y))}{t} \le \frac{f(2t x)}{2t} + \frac{f(2t y)}{2t}
$$

Now take  $t \downarrow 0$  ⇒ both  $2t \downarrow 0$ 

$$
g(x+y) \le g(x) + g(y) \Rightarrow \text{g is subadditive}
$$

* * *

Step 3: Combine with homogeneity
--------------------------------

We already proved  $g(tx) = t g(x)$ . So:

*   Homogeneity:  $g(\lambda x) = \lambda g(x)$  for  $\lambda \ge 0$ 
*   Subadditivity:  $g(x+y) \le g(x) + g(y)$ 

⇒ These two properties together imply convexity:

$$
g(\theta x + (1-\theta) y) \le \theta g(x) + (1-\theta) g(y)
$$

So:

$$
\boxed{g \text{ is convex}}
$$

* * *

Bonus Interpretation: Subdifferential Support Function
======================================================

If  $f$  is closed, proper, convex, and  $f(0) = 0$ , then the directional derivative is:

$$
f'(0; x) = \sup_{s \in \partial f(0)} s^T x \Rightarrow g(x) = \sup_{s \in \partial f(0)} s^T x
$$

This is the **support function** of the subdifferential set  $\partial f(0)$ . So:

*    $g$  is the support function of a closed convex set
*   Such functions are always convex and positively homogeneous
*   Convexity and homogeneity follow instantly from this form
*   This form is also geometrically illuminating: it describes a “worst-case slope in direction  $x$ ” over all subgradients at 0

* * *

✅ Final Summary
===============

| Property | Conclusion | Conditions |
| --- | --- | --- |
| (a) Homogeneity |  $g(tx) = t g(x)$  | Holds for all  $t \ge 0$ , if  $f(0) \ge 0$  |
| (b) Max underestimator |  $g \le f$ , and any homogeneous  $h \le f \Rightarrow h \le g$  | Always |
| (c) Convexity |  $g$  is convex | If  $f$  convex and  $f(0) = 0$  |

Let me know if you want the full derivation via epigraphs, or connections to cones, support functions, or dual norms.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)