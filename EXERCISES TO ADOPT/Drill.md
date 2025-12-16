
1. **A reusable micro-toolbox** (3–4 lemmas you’ll use in every dual derivation).
2. **A complete 10-problem canonical pack** with:

* primal (domain/assumptions explicit),
* Lagrangian (constraints written correctly),
* dual function (q) computed by an explicit (\inf),
* dual problem,
* KKT (in smooth/subgradient form),
* interpretation + “what to sanity-check”.

---

# A. Micro-toolbox (proved, because we’re not handwaving)

## Lemma A1 — “Linear term makes (\inf) blow up unless coefficient is zero”

Let (a\in\mathbb R^n). Then
[
\inf_{x\in\mathbb R^n} a^\top x=
\begin{cases}
0,& a=0\
-\infty,& a\neq 0.
\end{cases}
]

**Proof.** If (a=0), expression is identically 0.
If (a\neq 0), pick (x=t(-a)). Then (a^\top x = a^\top(-t a)= -t|a|_2^2\to -\infty) as (t\to+\infty). ∎

**Use:** This is exactly why you get constraints like (A^\top y=0) in duals.

---

## Lemma A2 — Quadratic minimization identity (completion of the square)

Let (H\in\mathbb S_{++}^n) (symmetric positive definite) and (g\in\mathbb R^n). Then
[
\inf_{x\in\mathbb R^n}\left{\frac12 x^\top Hx + g^\top x\right}
===============================================================

-\frac12 g^\top H^{-1}g,
]
and the unique minimizer is
[
x^\star = -H^{-1}g.
]

**Proof (no gaps).** Consider
[
\frac12 x^\top Hx + g^\top x
============================

\frac12\left(x^\top Hx + 2g^\top x\right).
]
Write (g^\top x = (H^{1/2}H^{-1/2}g)^\top x = (H^{-1/2}g)^\top (H^{1/2}x)). The clean algebraic way is to complete the square directly:

Let (x = z - H^{-1}g) (i.e. (z=x+H^{-1}g)). Then
[
\frac12 x^\top Hx + g^\top x
============================

\frac12(z-H^{-1}g)^\top H(z-H^{-1}g) + g^\top(z-H^{-1}g).
]
Expand:
[
\frac12(z^\top Hz - 2z^\top g + g^\top H^{-1}g) + g^\top z - g^\top H^{-1}g
===========================================================================

\frac12 z^\top Hz - z^\top g + \frac12 g^\top H^{-1}g + g^\top z - g^\top H^{-1}g.
]
Since (z^\top g = g^\top z), the middle terms cancel:
[
= \frac12 z^\top Hz - \frac12 g^\top H^{-1}g.
]
Because (H\succ0), we have (z^\top Hz\ge 0), with equality iff (z=0). Hence the infimum is achieved at (z=0), i.e. (x=-H^{-1}g), and its value is (-\frac12 g^\top H^{-1}g). ∎

**Use:** This is how you “integrate out” quadratic primal variables in the Lagrangian.

---

## Lemma A3 — Conjugate of a norm (proved)

Let (|\cdot|) be any norm and (|\cdot|**) its dual norm. Then
[
(\rho|x|)^*(z) = I*{{|z|_*\le \rho}}(z).
]

**Proof sketch (but rigorous).** Same as in Module 19:

* If (|z|**\le\rho), then (z^\top x \le |z|** |x|\le \rho|x|), so (\sup_x(z^\top x-\rho|x|)\le 0), achieved at (x=0).
* If (|z|_*>\rho), choose (|x_0|=1) with (z^\top x_0>\rho) (approximate maximizer), then scaling (tx_0) makes (z^\top (tx_0)-\rho|tx_0| = t(z^\top x_0-\rho)\to+\infty). ∎

**Use:** This gives the LASSO constraint (|A^\top y|_\infty\le\rho) in one line, *but it’s not magic anymore*.

---

## Lemma A4 — Indicator/support duality

For a set (C),
[
I_C^*(y)=\sigma_C(y):=\sup_{x\in C}y^\top x.
]
**Proof:** immediate from definition of conjugate and the fact (I_C(x)=+\infty) outside (C). ∎

**Use:** Constrained problems become support-function duals.

---

# B. The completed problem pack (10 canonical duals)

I’ll number them in a way that builds skills.

---

## Problem 1 — Unconstrained quadratic (includes least squares as a special case)

### Primal

[
\min_{x\in\mathbb R^n}\ f(x):=\frac12 x^\top Hx + g^\top x + c,
\quad H\in\mathbb S_{++}^n.
]

### Solution (no dual needed)

By Lemma A2:

* minimizer (x^\star=-H^{-1}g),
* value (f(x^\star)=c-\frac12 g^\top H^{-1}g).

### Why this belongs in the pack

Because almost every dual derivation reduces to “inf over a quadratic,” which is Lemma A2.

---

## Problem 2 — Least squares (normal equations) + geometric meaning

### Primal

[
\min_x \frac12|Ax-b|_2^2.
]

### Expand to a quadratic

[
\frac12|Ax-b|^2=\frac12(Ax-b)^\top(Ax-b)
=\frac12 x^\top A^\top A x - (A^\top b)^\top x + \frac12 b^\top b.
]
So it’s Problem 1 with:

* (H=A^\top A) (PSD, not necessarily PD),
* (g=-A^\top b).

### Optimality condition (rigorous)

If (A^\top A) is invertible (full column rank), then Lemma A2 gives
[
x^\star=(A^\top A)^{-1}A^\top b.
]
If not invertible, the function is still convex; minimizers satisfy the first-order condition
[
\boxed{A^\top(Ax^\star-b)=0 \iff A^\top A x^\star = A^\top b.}
]
This is the normal equation.

### Geometry (exact statement)

(r^\star:=b-Ax^\star) satisfies (A^\top r^\star=0), meaning (r^\star\perp\mathcal C(A)).
So (Ax^\star) is the orthogonal projection of (b) onto (\mathcal C(A)).

---

## Problem 3 — Least squares dual (introduce residual variable)

### Primal (equivalent form)

[
\min_{x,r}\ \frac12|r|^2\quad\text{s.t.}\quad r=Ax-b.
]

### Lagrangian

Equality constraint (r-Ax+b=0) with multiplier (y\in\mathbb R^m):
[
\mathcal L(x,r,y)=\frac12|r|^2 + y^\top(r-Ax+b).
]

### Dual function (q(y)=\inf_{x,r}\mathcal L)

**Step 1: inf over (r).**
Use Lemma A2 with (H=I), (g=y):
[
\inf_r\left(\frac12|r|^2+y^\top r\right)=-\frac12|y|^2,
\quad r^\star=-y.
]

So
[
\inf_r \mathcal L = -\frac12|y|^2 + y^\top(-Ax+b).
]
That is
[
-\frac12|y|^2 + b^\top y - (A^\top y)^\top x.
]

**Step 2: inf over (x).**
By Lemma A1, (\inf_x -(A^\top y)^\top x) is:

* (0) if (A^\top y=0),
* (-\infty) otherwise.

So
[
q(y)=
\begin{cases}
b^\top y-\frac12|y|^2,& A^\top y=0\
-\infty,& \text{else}.
\end{cases}
]

### Dual problem

[
\boxed{
\max_y\ b^\top y-\frac12|y|^2\quad\text{s.t.}\quad A^\top y=0.
}
]

### KKT interpretation (no fluff)

* Stationarity in (r): (r^\star=-y^\star) ⇒ dual variable is minus residual.
* Dual feasibility (A^\top y^\star=0) ⇒ residual orthogonal to (\mathcal C(A)) ⇒ projection theorem.

---

## Problem 4 — Ridge regression (Tikhonov)

### Primal

[
\min_x\ \frac12|Ax-b|^2+\frac{\lambda}{2}|x|^2,\quad \lambda>0.
]

### Residual form

[
\min_{x,r}\ \frac12|r|^2+\frac{\lambda}{2}|x|^2\quad \text{s.t. } r=Ax-b.
]

### Lagrangian

[
\mathcal L(x,r,y)=\frac12|r|^2+\frac{\lambda}{2}|x|^2+y^\top(r-Ax+b).
]

### Dual function

**Inf over (r):** same as above gives (-\frac12|y|^2) and (r^\star=-y).

Now we have
[
-\frac12|y|^2 + b^\top y + \frac{\lambda}{2}|x|^2 - (A^\top y)^\top x.
]

**Inf over (x):** apply Lemma A2 with (H=\lambda I), (g=-A^\top y):
[
\inf_x\left(\frac{\lambda}{2}|x|^2-(A^\top y)^\top x\right)
===========================================================

-\frac{1}{2\lambda}|A^\top y|^2.
]

So
[
q(y)=b^\top y-\frac12|y|^2-\frac{1}{2\lambda}|A^\top y|^2.
]

### Dual

[
\boxed{
\max_y\ b^\top y-\frac12|y|^2-\frac{1}{2\lambda}|A^\top y|^2.
}
]

### KKT (recover primal)

From stationarity:

* (r^\star=-y^\star),
* (x^\star=\frac{1}{\lambda}A^\top y^\star),
  and constraint (r^\star=Ax^\star-b). Eliminating (y^\star) yields:
  [
  (A^\top A+\lambda I)x^\star=A^\top b.
  ]

---

## Problem 5 — LASSO

### Primal

[
\min_x\ \frac12|Ax-b|^2+\rho|x|_1,\quad \rho>0.
]

### Residual form

[
\min_{x,r}\ \frac12|r|^2+\rho|x|_1\quad \text{s.t. } r=Ax-b.
]

### Lagrangian

[
\mathcal L(x,r,y)=\frac12|r|^2+\rho|x|_1+y^\top(r-Ax+b).
]

### Dual function

**Inf over (r):**
[
\inf_r\left(\frac12|r|^2+y^\top r\right)=-\frac12|y|^2,\quad r^\star=-y.
]
So reduced expression:
[
b^\top y-\frac12|y|^2+\rho|x|_1-(A^\top y)^\top x.
]

**Inf over (x):**
This is (\inf_x \big(\rho|x|_1-(A^\top y)^\top x\big)).
By Lemma A3 with norm (|\cdot|*1) (dual (|\cdot|*\infty)):
[
\inf_x\big(\rho|x|_1 - z^\top x\big)
====================================

\begin{cases}
0,& |z|_\infty\le \rho\
-\infty,& \text{otherwise},
\end{cases}
]
with (z=A^\top y).

So:
[
q(y)=
\begin{cases}
b^\top y-\frac12|y|^2,& |A^\top y|_\infty\le \rho\
-\infty,& \text{else}.
\end{cases}
]

### Dual

[
\boxed{
\max_y\ b^\top y-\frac12|y|^2\quad \text{s.t.}\quad |A^\top y|_\infty\le\rho.
}
]

### KKT (subgradient form, fully explicit)

Primal feasibility: (r^\star=Ax^\star-b).
Stationarity in (r): (r^\star+y^\star=0\Rightarrow y^\star=-r^\star).
Stationarity in (x):
[
0\in \rho,\partial|x^\star|_1 - A^\top y^\star
\iff A^\top y^\star\in \rho,\partial|x^\star|_1.
]
Coordinatewise:

* if (x_i^\star>0), then ((A^\top y^\star)_i=\rho),
* if (x_i^\star<0), then ((A^\top y^\star)_i=-\rho),
* if (x_i^\star=0), then ((A^\top y^\star)_i\in[-\rho,\rho]).

**This is the rigorous “why sparsity happens”.**

---

## Problem 6 — Basis pursuit (pure (\ell_1) minimization) + dual certificate

### Primal

[
\boxed{
\min_x\ |x|_1\quad\text{s.t.}\quad Ax=b.
}
]
Assume feasibility.

### Lagrangian

Equality (Ax-b=0) multiplier (y):
[
\mathcal L(x,y)=|x|_1 + y^\top(b-Ax)=b^\top y + \big(|x|_1-(A^\top y)^\top x\big).
]

### Dual function

We need (\inf_x\big(|x|*1 - (A^\top y)^\top x\big)).
By Lemma A3 with (\rho=1):
[
\inf_x(|x|*1-z^\top x)=
\begin{cases}
0,& |z|*\infty\le 1\
-\infty,& \text{else}.
\end{cases}
]
So
[
q(y)=
\begin{cases}
b^\top y,& |A^\top y|*\infty\le 1\
-\infty,& \text{else}.
\end{cases}
]

### Dual

[
\boxed{
\max_y\ b^\top y\quad\text{s.t.}\quad |A^\top y|_\infty\le 1.
}
]

### KKT certificate interpretation (core compressed truth)

At optimum (x^\star,y^\star):
[
A^\top y^\star \in \partial|x^\star|_1,
]
so:

* on the support of (x^\star), ((A^\top y^\star)_i=\mathrm{sign}(x_i^\star)),
* off the support, (|(A^\top y^\star)_i|\le 1).

That (y^\star) is literally a **dual certificate** of optimality/sparsity pattern.

---

## Problem 7 — Projection onto a convex set (normal cone appears)

### Primal

Given a closed convex set (C) and point (z),
[
\boxed{
\min_{x\in C}\ \frac12|x-z|_2^2.
}
]

### Rewrite with indicator

[
\min_x\ \frac12|x-z|^2 + I_C(x).
]

### Optimality condition (subgradient/KKT in one line)

[
0\in (x^\star-z) + \partial I_C(x^\star).
]
But (\partial I_C(x^\star)=N_C(x^\star)) (normal cone). So:
[
\boxed{z-x^\star \in N_C(x^\star).}
]
Meaning: the vector from the projection point to (z) is a normal vector to (C) at (x^\star).

### Why this belongs

This is the cleanest “geometry → KKT” example: no multipliers, just normal cones.

(If you want the explicit dual, you can express (I_C) via its conjugate (\sigma_C) and get a support-function dual; it’s a great exercise but I’m keeping the pack balanced.)

---

## Problem 8 — Soft-margin SVM (dual + support vectors)

### Primal

[
\boxed{
\begin{aligned}
\min_{w,b,\xi}\quad & \frac12|w|^2 + C\sum_{i=1}^N \xi_i\
\text{s.t.}\quad & 1-\xi_i-y_i(w^\top x_i+b)\le 0\
& -\xi_i\le 0,
\end{aligned}}
]
with multipliers (\alpha_i\ge 0) and (\mu_i\ge 0).

### Lagrangian

[
\mathcal L=
\frac12|w|^2 + C\sum_i\xi_i
+\sum_i\alpha_i(1-\xi_i-y_i(w^\top x_i+b))
+\sum_i\mu_i(-\xi_i).
]

### Min over primal variables (explicit)

**(i) (w):**
Collect (w)-terms:
[
\frac12|w|^2 - \sum_i \alpha_i y_i x_i^\top w.
]
Stationarity:
[
w-\sum_i\alpha_i y_i x_i=0
\Rightarrow w^\star=\sum_i\alpha_i y_i x_i.
]
Plugging the minimization value yields (-\frac12|w^\star|^2=-\frac12\sum_{i,j}\alpha_i\alpha_j y_iy_j x_i^\top x_j).

**(ii) (b):**
Term is (-b\sum_i \alpha_i y_i). By Lemma A1, finite inf over (b) requires:
[
\sum_i\alpha_i y_i=0.
]

**(iii) (\xi_i):**
Coefficient:
[
C-\alpha_i-\mu_i.
]
To avoid (-\infty) (since (\xi_i) is unconstrained inside (\inf)), require (C-\alpha_i-\mu_i=0). With (\mu_i\ge 0),
[
0\le \alpha_i\le C.
]

### Dual

[
\boxed{
\begin{aligned}
\max_{\alpha}\quad & \sum_i \alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_j y_i y_j x_i^\top x_j\
\text{s.t.}\quad & 0\le \alpha_i\le C,\quad \sum_i\alpha_i y_i=0.
\end{aligned}}
]

### KKT “support vector logic” (precise)

Complementary slackness:
[
\alpha_i(1-\xi_i-y_i(w^\top x_i+b))=0,\quad \mu_i\xi_i=0,\quad \alpha_i+\mu_i=C.
]
So:

* (0<\alpha_i<C \Rightarrow \xi_i=0) and margin tight: (y_i(w^\top x_i+b)=1).
* (\alpha_i=C \Rightarrow \mu_i=0) and often (\xi_i>0) (inside margin / misclassified).
* (\alpha_i=0): point doesn’t shape the separator.

---

## Problem 9 — Trust-region QCQP (dual scalar search, full KKT)

### Primal

[
\boxed{
\begin{aligned}
\min_x\quad & \frac12 x^\top P x + q^\top x + r\
\text{s.t.}\quad & x^\top x -1 \le 0,
\end{aligned}}
\qquad P\in\mathbb S_{++}^n.
]

### Lagrangian

Multiplier (\mu\ge 0):
[
\mathcal L(x,\mu)=\frac12x^\top P x+q^\top x+r+\mu(x^\top x-1)
==============================================================

\frac12x^\top(P+2\mu I)x+q^\top x+r-\mu.
]

### Dual function (q(\mu)=\inf_x \mathcal L(x,\mu))

Since (P\succ0) and (\mu\ge 0), (H(\mu):=P+2\mu I\succ 0). Apply Lemma A2:

* minimizer (x(\mu)=-(P+2\mu I)^{-1}q),
* inf value:
  [
  q(\mu)=r-\mu-\frac12 q^\top (P+2\mu I)^{-1}q.
  ]

### Dual

[
\boxed{
\max_{\mu\ge 0}\ r-\mu-\frac12 q^\top (P+2\mu I)^{-1}q.
}
]

### KKT (complete)

1. Primal feas: (|x^\star|^2\le 1)
2. Dual feas: (\mu^\star\ge 0)
3. Stationarity:
   [
   (P+2\mu^\star I)x^\star+q=0
   \Rightarrow x^\star=-(P+2\mu^\star I)^{-1}q
   ]
4. Complementary slackness:
   [
   \mu^\star(|x^\star|^2-1)=0
   ]

So either:

* **inactive constraint**: (\mu^\star=0) and (x^\star=-P^{-1}q) with (|x^\star|\le 1), or
* **active constraint**: (\mu^\star>0) and (|x^\star|=1), giving the scalar equation
  [
  | (P+2\mu I)^{-1}q|^2=1
  \iff q^\top (P+2\mu I)^{-2}q=1.
  ]

---

## Problem 10 — SDP primal/dual (trace-inner-product conic duality)

### Primal SDP

[
\boxed{
\begin{aligned}
\min_{X\in\mathbb S^n}\quad & \langle C,X\rangle\
\text{s.t.}\quad & \langle A_i,X\rangle=b_i,\ i=1,\dots,m\
& X\succeq 0.
\end{aligned}}
]
Inner product (\langle U,V\rangle=\mathrm{tr}(UV)).

### Lagrangian

Multiplier (y\in\mathbb R^m):
[
\mathcal L(X,y)=\langle C,X\rangle+\sum_i y_i(b_i-\langle A_i,X\rangle)+I_{S_+^n}(X)
=b^\top y+\langle C-\sum_i y_iA_i,\ X\rangle+I_{S_+^n}(X).
]

### Dual function (q(y)=\inf_X \mathcal L(X,y))

Let (S(y):=C-\sum_i y_iA_i). Then
[
q(y)=b^\top y+\inf_{X\succeq 0}\langle S(y),X\rangle.
]

Now the key PSD fact (same scaling logic as Lemma A1 but in cone form):

* If (S(y)\succeq 0), then (\langle S(y),X\rangle\ge 0) for all (X\succeq 0), and the inf is (0) (achieved at (X=0)).
* If (S(y)\not\succeq 0), there exists a vector (v) with (v^\top S(y)v<0). Take (X=t,vv^\top\succeq 0). Then
  [
  \langle S(y),X\rangle=\mathrm{tr}(S(y),t,vv^\top)=t,\mathrm{tr}(vv^\top S(y))=t,v^\top S(y)v\to -\infty.
  ]
  So the inf is (-\infty).

Thus:
[
q(y)=
\begin{cases}
b^\top y,& S(y)\succeq 0\
-\infty,& \text{otherwise}.
\end{cases}
]

### Dual SDP

[
\boxed{
\begin{aligned}
\max_y\quad & b^\top y\
\text{s.t.}\quad & C-\sum_i y_iA_i\succeq 0.
\end{aligned}}
]

### KKT (matrix form)

Let (X^\star\succeq 0) primal feasible and (S^\star:=C-\sum_i y_i^\star A_i\succeq 0) dual feasible. Then:

* primal feasibility: (\langle A_i,X^\star\rangle=b_i),
* dual feasibility: (S^\star\succeq 0),
* complementary slackness:
  [
  \boxed{\langle S^\star,X^\star\rangle=\mathrm{tr}(S^\star X^\star)=0.}
  ]

That’s the SDP analogue of (\lambda_i g_i(x)=0).

---

# C. How to “complete” your mastery: 6 sanity checks you should run on every dual you derive

1. **Does the dual objective give a lower bound** on primal optimum by weak duality? (Quick check: plug any feasible multipliers, see if it’s believable.)
2. **Did you correctly detect when (\inf_x \mathcal L) is (-\infty)?**
   That’s where every dual constraint comes from.
3. **Are signs correct?** Inequality constraints must multiply by (\lambda\ge 0).
4. **Can you derive KKT stationarity from your inf steps?** If you solved (\inf) by completing the square, the argmin equations should match stationarity.
5. **Complementary slackness interpretation:** identify which constraints are active.
6. **Dimensional sanity:** every inner product has matching shapes.

---

# D. If you want the pack even “more complete”

Two natural additions (I didn’t include to keep this message finite, but I can expand next in the same style):

* **SOCP canonical dual**: minimize (t) s.t. (|Ax+b|\le t) and linear equalities — gives you explicit dual cone constraints.
* **Log-sum-exp / entropy dual**: conjugate of (\log\sum_i e^{z_i}) is negative entropy on the simplex; from there you get logistic regression duals.

If you tell me which of those you care about more (SOCP geometry vs entropy/logistic), I’ll append it as Problems 11–12 with the same no-gaps derivation style.



I’ll **append Problems 11–14** (SOCP + simplex projection + log-sum-exp/entropy duality + logistic regression dual), and I’ll also add a **“complete solving” playbook**: how you go from (i) primal statement → (ii) dual/KKT → (iii) *actual solution* (closed form when possible; otherwise a principled numerical method with stopping certificates).

Below is dense but fully unpacked. Keep it as a reference sheet.

---

# Part I — How to completely solve convex optimization problems (the workflow)

Think of “solving” as **three layers**:

## Layer 1: Mathematical correctness

1. **State the problem with domains** (what (x) are allowed).
2. **Prove convexity** (or identify nonconvex).
3. **Check constraint qualification** (Slater for convex).
4. Derive **dual** and **KKT** cleanly (no guessing).
5. Know what’s guaranteed:

* Weak duality always.
* Strong duality + KKT necessity under Slater (convex).

## Layer 2: Compute a solution

Pick the right tool based on structure:

### A) Closed-form / semi-closed-form (best)

* Unconstrained quadratic (linear solve).
* Ridge (linear solve).
* Trust region (1D root find for multiplier).
* Projection onto simplex/box (sorting threshold).
* Some separable problems via KKT.

### B) First-order methods (large scale)

* Gradient descent (smooth).
* Accelerated gradient (Nesterov).
* Proximal gradient (smooth + nonsmooth separable regularizer like (\ell_1)).
* Coordinate descent (LASSO, SVM dual often).
* ADMM (splitting constraints nicely).

### C) Second-order / interior point (medium scale, high accuracy)

* Newton / quasi-Newton for smooth unconstrained or equality constrained.
* Interior-point for LP/SOCP/SDP (best for high-accuracy moderate size).

## Layer 3: Certify optimality (you must do this)

For convex problems:

* Produce **primal feasible** (x) (upper bound (p(x))).
* Produce **dual feasible** multipliers (lower bound (q(\lambda,\nu))).
* The **duality gap** (p(x)-q(\lambda,\nu)\ge 0) is a certificate.

That’s the “complete solve”: not just a candidate solution, but a **proof of near-optimality**.

---

# Part II — Append: Problems 11–14 (deeper, fully derived + how to solve)

I’ll reuse the micro-toolbox from before (linear term blow-up, quadratic completion, conjugates).

---

## Problem 11 — SOCP canonical form: derive the conic dual *and* solve strategy

### 11.1 Primal SOCP (standard and general)

A very common SOCP template is:
[
\boxed{
\begin{aligned}
\min_{x\in\mathbb R^n}\quad & c^\top x\
\text{s.t.}\quad & |A_i x + b_i|_2 \le d_i^\top x + e_i,\quad i=1,\dots,k\
& Fx=g.
\end{aligned}}
]
**Domain note:** each SOC constraint implicitly requires (d_i^\top x + e_i\ge 0) (otherwise (| \cdot |\le) negative is impossible unless the left side is also 0 and right side 0, but in general feasibility forces nonnegativity).

### 11.2 Turn it into conic form (the crucial step)

Define the second-order (Lorentz) cone:
[
Q^{m+1}:={(t,z)\in\mathbb R\times\mathbb R^m:\ t\ge |z|_2}.
]
Each constraint (|A_i x+b_i|\le d_i^\top x+e_i) is exactly:
[
(d_i^\top x+e_i,\ A_i x+b_i)\in Q^{m_i+1}.
]
Stack all SOC blocks into one big cone (K := Q^{m_1+1}\times\cdots\times Q^{m_k+1}).

Then the SOCP is a conic program:
[
\min c^\top x \quad \text{s.t.}\quad \mathcal A x + \beta \in K,\quad Fx=g,
]
for an appropriate linear operator (\mathcal A) (built from (d_i^\top) and (A_i)) and offset (\beta) (built from (e_i,b_i)).

### 11.3 Dual cone and why it matters

Key fact:
[
(Q^{m+1})^* = Q^{m+1}
]
(self-dual under the standard dot product). So for SOCP, “dual variables also live in SOCs.”

### 11.4 Lagrangian derivation (explicit, conic style)

Let the SOC constraint be (\mathcal A x + \beta \in K). This is equivalent to
[
\mathcal A x + \beta - s = 0,\quad s\in K
]
(using a slack (s)). But the clean conic duality derivation is:

Primal:
[
\min c^\top x \ \text{s.t. }Fx=g,\ \mathcal A x + \beta \in K.
]

Introduce:

* equality multiplier (y) for (Fx=g),
* cone multiplier (u\in K^*) for (\mathcal A x+\beta\in K).

The conic Lagrangian is
[
\mathcal L(x,y,u)=c^\top x + y^\top(g-Fx) + u^\top(\mathcal A x+\beta).
]
Group terms in (x):
[
\mathcal L = g^\top y + \beta^\top u + \underbrace{(c - F^\top y + \mathcal A^\top u)^\top x}_{\text{linear in }x}.
]

Now compute dual function (q(y,u)=\inf_x \mathcal L).
By the “linear term blow-up” lemma:

* if (c - F^\top y + \mathcal A^\top u \neq 0), then (\inf_x = -\infty).
* otherwise, (\inf_x = g^\top y + \beta^\top u).

So dual feasibility is:
[
c - F^\top y + \mathcal A^\top u = 0,\quad u\in K^*.
]

### 11.5 Dual SOCP

[
\boxed{
\begin{aligned}
\max_{y,u}\quad & g^\top y + \beta^\top u\
\text{s.t.}\quad & F^\top y - \mathcal A^\top u = c\
& u\in K^* = K.
\end{aligned}}
]

### 11.6 KKT (conic form)

At optimality (under Slater):

* primal feas: (Fx=g), (\mathcal A x+\beta\in K)
* dual feas: (u\in K^*), (F^\top y - \mathcal A^\top u=c)
* complementary slackness (conic): (u^\top(\mathcal A x+\beta)=0) **when written with slack appropriately**; equivalently (u\perp s) if you use explicit slack (s\in K).

### 11.7 How to actually solve SOCPs

* **General**: interior-point methods (polynomial time, highly reliable for moderate size).
* **Large scale**: first-order conic solvers (operator splitting / ADMM / homogeneous self-dual embedding).
* **Manual KKT solving**: only in special low-dimensional SOCPs where KKT reduces to few scalars.

---

## Problem 12 — Projection onto the probability simplex (full KKT → sorting formula)

This one is *gold* because it’s a complete “solve by KKT” example with a nontrivial but explicit algorithm.

### 12.1 Primal

Given (z\in\mathbb R^n), project onto simplex
[
\Delta:={x\in\mathbb R^n:\ x\ge 0,\ \mathbf 1^\top x = 1}.
]
Solve:
[
\boxed{
\min_{x\in\mathbb R^n}\ \frac12|x-z|_2^2\quad \text{s.t.}\quad x\ge 0,\ \mathbf 1^\top x=1.
}
]

### 12.2 Convexity + existence/uniqueness

* Objective is strongly convex (quadratic with Hessian (I\succ 0)).
* Feasible set is closed convex.
  ⇒ unique minimizer exists.

### 12.3 Lagrangian

* multipliers (\lambda\ge 0) for inequalities (-x_i\le 0),
* multiplier (\nu\in\mathbb R) for equality (\mathbf 1^\top x-1=0).

[
\mathcal L(x,\lambda,\nu)
=\frac12|x-z|^2 + \sum_{i=1}^n \lambda_i(-x_i) + \nu(\mathbf 1^\top x-1).
]

### 12.4 Stationarity (explicit coordinate form)

Compute gradient w.r.t. (x):
[
\nabla_x \frac12|x-z|^2 = x-z.
]
Stationarity:
[
0 = x-z -\lambda + \nu \mathbf 1
\quad\Longleftrightarrow\quad
\boxed{x = z + \lambda - \nu\mathbf 1.}
]

### 12.5 Complementary slackness + inequality structure

Constraints: (x_i\ge 0) and (\lambda_i\ge 0) with
[
\lambda_i x_i = 0 \quad \forall i.
]
So for each coordinate (i), exactly one of these holds:

* **Active**: (x_i=0) and then (\lambda_i\ge 0) can be positive.
* **Inactive**: (x_i>0) and then (\lambda_i=0).

Use stationarity (x_i = z_i + \lambda_i - \nu):

* If (x_i>0), then (\lambda_i=0) ⇒ (x_i = z_i-\nu) and must be positive ⇒ (z_i>\nu).
* If (x_i=0), then (0=z_i+\lambda_i-\nu) ⇒ (\lambda_i=\nu-z_i\ge 0) ⇒ (z_i\le \nu).

So we’ve derived the key structure:
[
\boxed{x_i = \max{z_i-\nu,\ 0}}
]
for some scalar (\nu) chosen to satisfy (\sum_i x_i=1).

### 12.6 Solve for (\nu) (the sorting trick)

Define (x(\nu)=\max(z-\nu\mathbf 1,0)). We need (\mathbf 1^\top x(\nu)=1).

Let (z_{(1)}\ge z_{(2)}\ge\cdots\ge z_{(n)}) be sorted descending.

Suppose the active set (S={i:\ z_i>\nu}) has size (k). Then for those indices:
[
x_i=z_i-\nu,\quad i\in S.
]
Sum constraint:
[
\sum_{i\in S}(z_i-\nu)=1
\quad\Rightarrow\quad
\nu = \frac{\sum_{i\in S} z_i - 1}{k}.
]
But (S) itself depends on (\nu). Sorting resolves this by testing candidate (k)’s:

Define prefix sums (Z_k=\sum_{j=1}^k z_{(j)}). Candidate threshold:
[
\nu_k := \frac{Z_k-1}{k}.
]
Correct (k) is the largest index such that (z_{(k)}>\nu_k). Then (\nu=\nu_k) and
[
\boxed{x_i = \max{z_i-\nu,\ 0}.}
]

### 12.7 How to “solve” in practice

Algorithm:

1. sort (z) descending,
2. compute prefix sums (Z_k),
3. find (k^\star=\max{k:\ z_{(k)}>\nu_k}),
4. set (\nu=\nu_{k^\star}),
5. output (x=\max(z-\nu,0)).

This is (O(n\log n)) due to sorting.

---

## Problem 13 — Log-sum-exp conjugate (negative entropy on simplex) + how to use it

### 13.1 Define log-sum-exp

[
f(z)=\log\left(\sum_{i=1}^n e^{z_i}\right).
]
It is convex and smooth.

### 13.2 Goal: compute the conjugate (f^*(p))

[
f^*(p)=\sup_{z\in\mathbb R^n}\Big(p^\top z - \log\sum_i e^{z_i}\Big).
]

### 13.3 First: domain restriction (why (p) must be in simplex)

Two invariances force simplex constraints.

**(i) Shift invariance of (f):**
For any scalar (\alpha),
[
f(z+\alpha\mathbf 1)=\log\sum_i e^{z_i+\alpha}=\alpha+\log\sum_i e^{z_i}= \alpha + f(z).
]

Now look at the conjugate objective:
[
p^\top(z+\alpha\mathbf 1)-f(z+\alpha\mathbf 1)=p^\top z + \alpha(p^\top \mathbf 1) - (\alpha+f(z))
= (p^\top z - f(z)) + \alpha(p^\top \mathbf 1 -1).
]

* If (p^\top\mathbf 1\neq 1), we can send (\alpha\to \pm\infty) to make the expression (+\infty).
  So finiteness requires:
  [
  \boxed{\mathbf 1^\top p = 1.}
  ]

**(ii) Nonnegativity:**
If some (p_i<0), we can send (z_i\to -\infty) to make (p_i z_i\to +\infty) while (f(z)) stays bounded by the remaining coordinates. More formally, take a direction that decreases one coordinate only; the log-sum-exp doesn’t punish (-\infty) as fast as the linear term grows if (p_i<0). Result:
[
\boxed{p\ge 0.}
]

Thus:
[
\mathrm{dom}(f^*)=\Delta={p\ge 0,\ \mathbf 1^\top p=1}.
]

### 13.4 Compute (f^*(p)) on the simplex (explicit maximizer)

Assume (p\in\Delta), and solve the unconstrained maximization in (z).

Let
[
\Phi(z)=p^\top z - \log\sum_i e^{z_i}.
]
Gradient:
[
\frac{\partial}{\partial z_i}\Phi(z)
= p_i - \frac{e^{z_i}}{\sum_j e^{z_j}}.
]
Set to zero:
[
p_i = \frac{e^{z_i}}{\sum_j e^{z_j}}.
]
This says (p) equals the softmax of (z). Solve it:
Let (S=\sum_j e^{z_j}). Then (e^{z_i}=p_i S), so
[
z_i=\log p_i + \log S.
]
So (z=\log p + \alpha\mathbf 1) for some (\alpha=\log S). That shift doesn’t matter because (p^\top\mathbf 1=1) and (f) has the same shift.

Plug (z=\log p) (choose (\alpha=0) for convenience):

* (p^\top z = \sum_i p_i \log p_i),
* (\sum_i e^{z_i}=\sum_i p_i=1) ⇒ (f(z)=\log 1 = 0).

So
[
\boxed{f^*(p)=\sum_{i=1}^n p_i\log p_i\quad\text{for }p\in\Delta,}
]
and (f^*(p)=+\infty) otherwise.

This is **negative entropy** (up to sign).

### 13.5 How you solve problems with log-sum-exp

If your primal has log-sum-exp, you can:

* either run Newton/gradient (since it’s smooth),
* or **dualize** into an entropy-regularized form on the simplex, which is often easier to interpret and sometimes easier numerically.

This conjugate is the engine behind logistic regression duals.

---

## Problem 14 — Logistic regression (L2-regularized) dual + solving methods

I’ll do the cleanest standard convex form.

### 14.1 Primal (binary logistic, (y\in{0,1}))

Data (x_i\in\mathbb R^d), labels (y_i\in{0,1}). Let (X\in\mathbb R^{N\times d}) be the data matrix (rows (x_i^\top)).

Negative log-likelihood + ridge:
[
\boxed{
\min_{w\in\mathbb R^d}\ \sum_{i=1}^N \Big(\log(1+e^{x_i^\top w}) - y_i,x_i^\top w\Big)
+\frac{\lambda}{2}|w|_2^2,
\quad \lambda>0.
}
]
This is convex because:

* (a\mapsto \log(1+e^a)) is convex,
* linear term (-y_i a) is affine,
* (\frac{\lambda}{2}|w|^2) is strongly convex.

### 14.2 Introduce (a = Xw) to separate the log-sum-exp pieces

Let (a\in\mathbb R^N) with constraint (a=Xw). Then primal is equivalent to:
[
\boxed{
\begin{aligned}
\min_{w,a}\quad & \sum_{i=1}^N \big(\phi(a_i)-y_i a_i\big) + \frac{\lambda}{2}|w|^2\
\text{s.t.}\quad & a = Xw,
\end{aligned}}
]
where (\phi(t)=\log(1+e^t)).

### 14.3 Lagrangian

Multiplier (u\in\mathbb R^N) for equality (a-Xw=0):
[
\mathcal L(w,a,u)=\sum_i(\phi(a_i)-y_i a_i) + \frac{\lambda}{2}|w|^2 + u^\top(a-Xw).
]
Group terms:
[
\mathcal L
=\sum_i \big(\phi(a_i) + (u_i-y_i)a_i\big) + \frac{\lambda}{2}|w|^2 - u^\top Xw.
]

### 14.4 Dual function (q(u)=\inf_{w,a}\mathcal L)

#### Step 1: inf over (w) (quadratic)

The (w)-part is:
[
\frac{\lambda}{2}|w|^2 - (X^\top u)^\top w.
]
By Lemma A2 (with (H=\lambda I), (g=-X^\top u)):
[
\inf_w = -\frac{1}{2\lambda}|X^\top u|^2,
\quad w^\star = \frac{1}{\lambda}X^\top u.
]

#### Step 2: inf over each (a_i) (scalar conjugate)

For each (i), minimize:
[
\inf_{a_i}\ \phi(a_i)+(u_i-y_i)a_i.
]
This is (-\phi^*(y_i-u_i)) (by definition of conjugate).

So we need (\phi^*). For (\phi(t)=\log(1+e^t)), the conjugate is:
[
\boxed{
\phi^*(v)= v\log v + (1-v)\log(1-v)\quad \text{for } v\in(0,1),
}
]
and (+\infty) otherwise. (This is a standard result; it’s exactly the 2-class entropy form.)

Therefore, (\inf_{a_i}) is finite iff (y_i-u_i\in[0,1]), i.e.
[
u_i \in [y_i-1,\ y_i].
]
Since (y_i\in{0,1}), this becomes:

* if (y_i=1): (u_i\in[0,1]),
* if (y_i=0): (u_i\in[-1,0]).

To unify, define (v_i:=y_i-u_i). Then (v\in[0,1]^N) and (u=y-v).

Now the dual function becomes:
[
q(u)= -\sum_i \phi^*(y_i-u_i) - \frac{1}{2\lambda}|X^\top u|^2.
]

### 14.5 Dual problem (clean form in (v\in[0,1]^N))

Substitute (u=y-v):
[
\boxed{
\max_{v\in[0,1]^N}\
-\sum_{i=1}^N\Big(v_i\log v_i + (1-v_i)\log(1-v_i)\Big)
-\frac{1}{2\lambda}|X^\top (y-v)|_2^2.
}
]
That is: maximize (entropy) minus (quadratic penalty).

### 14.6 Recover primal from dual (how you “complete solve”)

From the (w)-minimization step:
[
w^\star = \frac{1}{\lambda}X^\top u^\star = \frac{1}{\lambda}X^\top (y-v^\star).
]
So once you solve the dual for (v^\star), you get (w^\star) explicitly.

### 14.7 How to solve logistic regression in practice (options)

* **Primal Newton / L-BFGS**: best default for medium (d).
* **Stochastic gradient**: best for huge (N).
* **Dual coordinate ascent**: sometimes effective, especially with sparse (X).
* **Certificates**: if you compute both primal and dual feasible points, you can bound the gap.

---

# Part III — “Complete solving” examples: what the finished solution looks like

To show what “complete solve” means, here are 3 archetypes:

## Archetype A: Closed-form (Ridge)

* Derive KKT/FOC → linear system ((A^\top A+\lambda I)x=A^\top b).
* Solve by Cholesky (since PD).
* Done + numerical stability notes (condition number).

## Archetype B: KKT → scalar root (Trust region)

* KKT says (x=-(P+2\mu I)^{-1}q), (\mu\ge 0), (\mu(|x|^2-1)=0).
* Either (\mu=0) works (check norm), else solve the scalar equation (|x(\mu)|=1) by monotone 1D root finding.
* Certificate: compute dual value at (\mu) and primal value at (x), check gap.

## Archetype C: KKT → sorting threshold (Simplex projection)

* KKT yields (x=\max(z-\nu,0)), (\sum x=1).
* Solve (\nu) by sorting/prefix sums.
* That’s a full algorithm + proof of correctness.

---

# If you want the pack *fully finished-finished*

Two more appendices are usually the final “completion”:

1. **SOCP self-duality proof** (why (Q^*=Q)) — pure Cauchy–Schwarz geometry.
2. **A “gap certificate cookbook”**: for each problem above, what counts as dual-feasible and how to compute the dual objective numerically.

If you want, I’ll append those next in the same no-gaps style.

Below are the two appendices, in the same “no gaps” style:

1. **Why the second-order cone is self-dual**: ((Q^{m+1})^* = Q^{m+1}).
2. **Gap-certificate cookbook**: for each problem in the pack, exactly what “primal feasible” and “dual feasible” mean, what the dual objective is, and how to compute a **duality gap** you can actually use as a stopping rule.

---

# Appendix 1 — Proof that the SOC is self-dual: ((Q^{m+1})^*=Q^{m+1})

## A1.0 Definitions (no ambiguity)

The (Lorentz / second-order) cone in (\mathbb R^{m+1}) is
[
Q^{m+1} := {(t,z)\in\mathbb R\times\mathbb R^m:\ t\ge |z|_2}.
]

Its dual cone (with respect to the standard Euclidean dot product) is
[
(Q^{m+1})^* := {(s,y)\in\mathbb R\times\mathbb R^m:\ (s,y)\cdot(t,z)\ge 0\ \forall (t,z)\in Q^{m+1}}.
]
Here the dot product is
[
(s,y)\cdot(t,z)=st+y^\top z.
]

We prove:
[
\boxed{(Q^{m+1})^* = Q^{m+1}.}
]

This is a **big deal** because it means SOCP dual variables live in the *same* type of cone.

---

## A1.1 First inclusion: (Q^{m+1}\subseteq (Q^{m+1})^*)

Take any ((s,y)\in Q^{m+1}). So (s\ge |y|).

We must show: for every ((t,z)\in Q^{m+1}) (so (t\ge |z|)),
[
st+y^\top z\ge 0.
]

### Step 1: Lower bound (y^\top z) using Cauchy–Schwarz

By Cauchy–Schwarz,
[
y^\top z \ge -|y|,|z|.
]
(Reason: (|y^\top z|\le |y||z|) implies (y^\top z \ge -|y||z|).)

### Step 2: Combine bounds

So
[
st+y^\top z \ge st - |y|,|z|.
]
Now use (s\ge |y|) and (t\ge |z|). Then (st\ge |y|,|z|). Therefore
[
st-|y|,|z|\ge 0.
]
Hence (st+y^\top z\ge 0) for all ((t,z)\in Q). This proves
[
(s,y)\in (Q^{m+1})^*.
]

So
[
\boxed{Q^{m+1}\subseteq (Q^{m+1})^*.}
]
∎

**Commentary:**
This direction is “easy”: you used nothing except CS and the cone inequalities (s\ge|y|), (t\ge|z|). It’s the “obvious” geometric direction: two vectors in the cone must have nonnegative inner product.

---

## A1.2 Second inclusion: ((Q^{m+1})^*\subseteq Q^{m+1})

Now assume ((s,y)\in (Q^{m+1})^*). That means:
[
st+y^\top z \ge 0 \quad \forall (t,z)\text{ with }t\ge |z|.
]

We must show:
[
s\ge |y|.
]

### Step 1: Show (s\ge 0)

Take ((t,z)=(1,0)). This is in (Q) since (1\ge 0).
Then the dual condition gives:
[
s\cdot 1 + y^\top 0 = s\ge 0.
]

### Step 2: Force a condition involving (|y|)

If (y=0), then (s\ge 0) already implies (s\ge |y|=0), done.

Assume (y\neq 0). Choose a particular ((t,z)\in Q) designed to make (y^\top z) very negative.

Let
[
z = -\alpha \frac{y}{|y|}\quad (\alpha\ge 0),
\qquad t = |z| = \alpha.
]
Then (t=|z|), so ((t,z)\in Q) (on the boundary).

Compute:
[
y^\top z = y^\top\left(-\alpha \frac{y}{|y|}\right)= -\alpha \frac{y^\top y}{|y|}= -\alpha |y|.
]

Now apply the dual condition:
[
st + y^\top z \ge 0
\quad\Rightarrow\quad
s\alpha - \alpha|y| \ge 0
\quad\Rightarrow\quad
\alpha(s-|y|)\ge 0.
]
This must hold for **all** (\alpha\ge 0). If (s-|y|<0), choosing large (\alpha) makes the left side negative, contradiction. Therefore:
[
s-|y|\ge 0\quad\Rightarrow\quad s\ge |y|.
]

Thus ((s,y)\in Q). So
[
\boxed{(Q^{m+1})^*\subseteq Q^{m+1}.}
]
∎

---

## A1.3 Conclusion

Both inclusions hold, hence
[
\boxed{(Q^{m+1})^* = Q^{m+1}.}
]

**Geometric punchline:**
The SOC is “exactly the set of vectors having nonnegative dot product with every SOC vector.” That’s what self-duality means.

---

# Appendix 2 — Duality-gap certificate cookbook (for the whole pack)

General principle (always):

* Any **primal feasible** point gives an **upper bound** on optimum (for minimization).
* Any **dual feasible** point gives a **lower bound** via the dual objective.
* Their difference is a **certificate**:
  [
  \text{gap} = p(x)-d(\text{dual vars})\ \ge 0.
  ]
  Stop when gap (\le \varepsilon).

I’ll list, for each problem, exactly what to compute.

---

## C1) Least squares (Problem 2)

Primal:
[
\min_x \tfrac12|Ax-b|^2.
]
There isn’t a standard separate dual unless you use residual form (Problem 3).

So use **Problem 3 dual**:

* Primal feasible: any (x) (always feasible).
* Dual feasible: any (y) satisfying (A^\top y=0).
* Primal objective:
  [
  p(x)=\tfrac12|Ax-b|^2.
  ]
* Dual objective:
  [
  d(y)=b^\top y-\tfrac12|y|^2.
  ]
* Gap:
  [
  \boxed{\mathrm{gap}(x,y)=\tfrac12|Ax-b|^2-\left(b^\top y-\tfrac12|y|^2\right).}
  ]
  A convenient dual-feasible choice from any (x): take residual (r=b-Ax) and project it onto (\mathcal N(A^\top)) if needed (so that (A^\top y=0)). The exact projection uses SVD; if you already have QR/SVD, it’s easy.

---

## C2) Ridge (Problem 4)

Primal:
[
\min_x \tfrac12|Ax-b|^2+\tfrac{\lambda}{2}|x|^2.
]
Dual:
[
\max_y\ b^\top y-\tfrac12|y|^2-\tfrac{1}{2\lambda}|A^\top y|^2.
]

* Primal feasible: any (x).
* Dual feasible: any (y) (always feasible because dual unconstrained).
* Primal objective (p(x)) obvious.
* Dual objective
  [
  d(y)=b^\top y-\tfrac12|y|^2-\tfrac{1}{2\lambda}|A^\top y|^2.
  ]
* Gap:
  [
  \boxed{\mathrm{gap}(x,y)=p(x)-d(y)\ge 0.}
  ]
  Good canonical pair from one another:
  [
  y = b-Ax\quad\text{or}\quad x=\frac{1}{\lambda}A^\top y.
  ]
  At optimality both hold simultaneously.

---

## C3) LASSO (Problem 5)

Primal:
[
\min_x \tfrac12|Ax-b|^2+\rho|x|*1.
]
Dual:
[
\max_y\ b^\top y-\tfrac12|y|^2\quad\text{s.t.}\ |A^\top y|*\infty\le \rho.
]

* Primal feasible: any (x).
* Dual feasible: any (y) with (|A^\top y|_\infty\le\rho).
* Primal objective:
  [
  p(x)=\tfrac12|Ax-b|^2+\rho|x|_1.
  ]
* Dual objective:
  [
  d(y)=b^\top y-\tfrac12|y|^2.
  ]
* Gap:
  [
  \boxed{\mathrm{gap}(x,y)=\tfrac12|Ax-b|^2+\rho|x|_1-\left(b^\top y-\tfrac12|y|^2\right).}
  ]

**How to build a dual-feasible (y) from a candidate (x):**
Take residual (r=b-Ax). Ideally (y=r) (since optimal has (y=b-Ax)). But (y=r) may violate (|A^\top y|*\infty\le\rho). Fix by scaling:
[
y := \theta r,\quad \theta := \min\left{1,\ \frac{\rho}{|A^\top r|*\infty}\right}.
]
Then (|A^\top y|*\infty = \theta|A^\top r|*\infty\le \rho). Now you have a valid dual certificate.

---

## C4) Basis pursuit (Problem 6)

Primal:
[
\min_x |x|*1\ \text{s.t. }Ax=b.
]
Dual:
[
\max_y b^\top y\ \text{s.t. }|A^\top y|*\infty\le 1.
]

* Primal feasible: any (x) with (Ax=b).
* Dual feasible: any (y) with (|A^\top y|_\infty\le 1).
* Primal objective (p(x)=|x|_1).
* Dual objective (d(y)=b^\top y).
* Gap:
  [
  \boxed{\mathrm{gap}(x,y)=|x|_1-b^\top y.}
  ]

---

## C5) Simplex projection (Problem 12)

This one is not typically expressed with a “dual problem” you maximize for certificates, because you solve it exactly via KKT. But if you want a certificate mindset:

* Primal feasible: any (x\ge 0) with (\mathbf 1^\top x=1).
* KKT multipliers: (\nu\in\mathbb R), (\lambda\ge 0) with stationarity (x-z-\lambda+\nu\mathbf 1=0) and (\lambda_i x_i=0).
  When you compute the sorting-threshold solution, you can explicitly produce (\nu) and (\lambda=\nu\mathbf 1 - z + x), and then verify:
  [
  \lambda\ge 0,\ x\ge 0,\ \mathbf 1^\top x=1,\ \lambda_i x_i=0.
  ]
  Those checks are a full correctness certificate.

---

## C6) SVM (Problem 8)

Primal objective:
[
p(w,b,\xi)=\tfrac12|w|^2 + C\sum_i\xi_i
]
with feasibility constraints.
Dual objective:
[
d(\alpha)=\sum_i\alpha_i-\tfrac12\sum_{i,j}\alpha_i\alpha_j y_iy_j x_i^\top x_j
]
with feasibility (0\le\alpha_i\le C), (\sum_i\alpha_i y_i=0).

* Primal feasible: any ((w,b,\xi)) satisfying constraints.
* Dual feasible: any (\alpha) satisfying box + equality.
* Gap:
  [
  \boxed{\mathrm{gap} = p(w,b,\xi)-d(\alpha)\ge 0.}
  ]
  In practice, solvers maintain both; coordinate ascent gives a feasible (\alpha) and you can construct (w=\sum_i\alpha_i y_i x_i) and choose (b) from KKT on support vectors.

---

## C7) Trust region (Problem 9)

Primal feasible: any (x) with (|x|^2\le 1).
Dual feasible: any (\mu\ge 0). Dual objective:
[
d(\mu)=r-\mu-\tfrac12 q^\top (P+2\mu I)^{-1}q.
]
Primal objective:
[
p(x)=\tfrac12 x^\top Px + q^\top x + r.
]
Gap:
[
\boxed{\mathrm{gap}(x,\mu)=p(x)-d(\mu)\ge 0.}
]
At optimum, the gap goes to 0.

---

## C8) SOCP conic form (Problem 11)

Primal conic:
[
\min c^\top x\ \text{s.t. }Fx=g,\ \mathcal A x+\beta\in K.
]
Dual:
[
\max g^\top y+\beta^\top u\ \text{s.t. }F^\top y-\mathcal A^\top u=c,\ u\in K^*.
]

* Primal feasible: any (x) satisfying equality and cone membership.
* Dual feasible: any ((y,u)) satisfying equality and cone membership.
* Gap:
  [
  \boxed{\mathrm{gap}=c^\top x-(g^\top y+\beta^\top u)\ge 0.}
  ]

---

## C9) SDP (Problem 10)

Primal:
[
p(X)=\langle C,X\rangle,\ \langle A_i,X\rangle=b_i,\ X\succeq 0.
]
Dual:
[
d(y)=b^\top y,\ S(y):=C-\sum_i y_iA_i\succeq 0.
]

* Primal feasible: (X\succeq 0), equalities hold.
* Dual feasible: (S(y)\succeq 0).
* Gap:
  [
  \boxed{\mathrm{gap}(X,y)=\langle C,X\rangle-b^\top y\ge 0.}
  ]
  At optimum with KKT, (\mathrm{tr}(S^\star X^\star)=0) and gap is zero.

---

# One final “complete solving” mantra (worth memorizing)

For convex problems with Slater:

1. Find candidate (x) (numerical or closed form).
2. Construct feasible dual vars (or a feasible relaxation of them).
3. Report:

* (p(x)) (upper bound),
* (d(\cdot)) (lower bound),
* gap (=p-d) (certificate).

That’s not just solving — it’s *proving you solved*.

If you want, I can turn this whole pack into a **drill sheet**: each problem as “derive dual + KKT” exercises, with solutions hidden/expandable, plus a checklist of the exact feasibility/gap computations.
