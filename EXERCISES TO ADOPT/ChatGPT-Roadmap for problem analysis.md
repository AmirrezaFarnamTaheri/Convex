# Roadmap for problem analysis

**User:** Anonymous (meqrvsl88948@hotmail.com)  
**Created:** 12/13/2025 11:44:07  
**Updated:** 12/14/2025 11:32:40  
**Exported:** 12/16/2025 13:52:32  
**Link:** [https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3-expanded/c/693d204c-8b88-8329-91a4-d596cd890176](https://chatgpt.com/g/g-p-693c475fdf788191a00d9dc0fb4c40b3-expanded/c/693d204c-8b88-8329-91a4-d596cd890176)  

## Prompt:
ChatGPT-Breakdown of convexity examples.md

File

Give me a roadmap to make me ready for problems in this document. List and state all problems completely. GIve me a detailed, complete, granular roadmap.

## Response:
Thought for 4m 25s

1) Full inventory: every problem/example in your document (stated completely)
-----------------------------------------------------------------------------

### Example 3.10 — maximum eigenvalue is convex

**Statement.** For symmetric  $X\in\mathbb S^n$ , define  $f(X)=\lambda_{\max}(X)$ . Show  $f$  is convex on  $\mathbb S^n$ .

ChatGPT-Breakdown of convexity …

* * *

### Example 3.11 — induced/“operator” matrix norms are convex

**Statement.** For vector norms  $\|\cdot\|_a,\|\cdot\|_b$ , define the induced matrix norm

$$
\|X\|_{a,b}=\sup_{\|v\|_b=1}\|Xv\|_a.
$$

Show  $\|X\|_{a,b}$  is convex in  $X$ , and also show the bilinear variational form

\\|X\\|\_{a,b}=\\sup\\{u^\\top Xv\\mid \\|u\\|\_{a^\\\*}=1,\\ \\|v\\|\_b=1\\}. \\\] :contentReference\[oaicite:1\]{index=1} --- ### Example 3.14 — vector composition “machine” (5 sub-problems) This example is a bundle of “outer \\(h\\) + inner \\(g\_i\\)” constructions. \*\*Core composition rule (convex case).\*\* If each \\(g\_i\\) is convex and \\(h:\\mathbb R^k\\to\\mathbb R\\) is convex and \*\*nondecreasing in each coordinate\*\*, then \\(f(x)=h(g\_1(x),\\dots,g\_k(x))\\) is convex. :contentReference\[oaicite:2\]{index=2} Now the five bullets you must be able to prove/use: 1. \*\*(i) Sum of the \\(r\\) largest components.\*\* \\(h(z)=z\_{\[1\]}+\\cdots+z\_{\[r\]}\\) is convex and nondecreasing; conclude “sum of the \\(r\\) largest \\(g\_i(x)\\)” is convex if the \\(g\_i\\) are convex. :contentReference\[oaicite:3\]{index=3} 2. \*\*(ii) Log-sum-exp.\*\* \\(h(z)=\\log(\\sum\_i e^{z\_i})\\) is convex and nondecreasing; conclude \\(\\log(\\sum\_i e^{g\_i(x)})\\) is convex when \\(g\_i\\) are convex. :contentReference\[oaicite:4\]{index=4} 3. \*\*(iii) \\(p\\)-aggregation for \\(0<p\\le 1\\) (concavity on \\(\\mathbb R\_+^k\\)).\*\* \\(h(z)=(\\sum\_i z\_i^p)^{1/p}\\) is concave on \\(\\mathbb R\_+^k\\) (with a monotone extension); conclude \\((\\sum\_i g\_i(x)^p)^{1/p}\\) is concave if \\(g\_i\\) are concave and nonnegative. :contentReference\[oaicite:5\]{index=5} 4. \*\*(iv) \\(p\\)-aggregation for \\(p\\ge 1\\) (convexity with nonnegativity).\*\* For \\(p\\ge 1\\) and convex nonnegative \\(g\_i\\), show \\((\\sum\_i g\_i(x)^p)^{1/p}\\) is convex (via the “positive-part” trick). :contentReference\[oaicite:6\]{index=6} 5. \*\*(v) Geometric mean is concave.\*\* \\(h(z)=(\\prod\_i z\_i)^{1/k}\\) is concave on \\(\\mathbb R\_+^k\\) and (with monotone extension) composes with nonnegative concave \\(g\_i\\). :contentReference\[oaicite:7\]{index=7} --- ### Example 3.17 — partial minimization over a linear equality preserves convexity \*\*Statement.\*\* If \\(h\\) is convex, then \\\[ g(x)=\\inf\\{h(y)\\mid Ay=x\\}

is convex.

ChatGPT-Breakdown of convexity …

* * *

### Example 3.20 — perspective + affine map construction

**Statement.** If  $f:\mathbb R^m\to\mathbb R\cup\{+\infty\}$  is convex, define its perspective  $g(z,t)=t\,f(z/t)$  (for  $t>0$ ). With  $z(x)=Ax+b$ ,  $t(x)=c^\top x+d$ , define

$$
h(x)=t(x)\,f\!\left(\frac{z(x)}{t(x)}\right).
$$

Show  $h$  is convex on  $\{x\mid t(x)>0\}$ .

ChatGPT-Breakdown of convexity …

* * *

### Exercise 3.22 — prove convexity of each function (5 parts)

**(a)**

f(x,t)=-t\\log\\!\\left(1-\\frac{x^\\top x}{t}\\right),\\qquad \\mathrm{dom}f=\\{(x,t)\\mid t>\\|x\\|\_2^2\\}. \\\] :contentReference\[oaicite:10\]{index=10} \*\*(b)\*\* \\\[ f(x,u,v)=-\\sqrt{uv-x^\\top x},\\qquad \\mathrm{dom}f=\\{(x,u,v)\\mid u>0,\\ v>0,\\ uv>x^\\top x\\}. \\\] :contentReference\[oaicite:11\]{index=11} \*\*(c)\*\* \\\[ f(x,u,v)=-\\log(uv-x^\\top x),\\qquad \\mathrm{dom}f=\\{(x,u,v)\\mid u>0,\\ v>0,\\ uv>x^\\top x\\}. \\\] :contentReference\[oaicite:12\]{index=12} \*\*(d)\*\* (with \\(p>1\\)) \\\[ f(x,t)=-(t^p-\\|x\\|\_p^p)^{1/p},\\qquad \\mathrm{dom}f=\\{(x,t)\\mid t\\ge \\|x\\|\_p\\}. \\\] :contentReference\[oaicite:13\]{index=13} \*\*(e)\*\* (with \\(p>1\\)) \\\[ f(x,t)=-\\log(t^p-\\|x\\|\_p^p),\\qquad \\mathrm{dom}f=\\{(x,t)\\mid t>\\|x\\|\_p\\}. \\\] :contentReference\[oaicite:14\]{index=14} --- ### Exercise 3.23 — perspective practice (2 parts) \*\*(a)\*\* For \\(p\\ge 1\\), show \\\[ q(x,t)=\\frac{\\|x\\|\_p^p}{t^{p-1}}

is convex on  $t>0$ .

ChatGPT-Breakdown of convexity …

**(b)** Show

$$
f(x)=\frac{\|Ax+b\|_2^2}{c^\top x+d}
$$

is convex on  $\{x\mid c^\top x+d>0\}$ .

ChatGPT-Breakdown of convexity …

* * *

### Example 3.30 — convex envelope via convex hull of the epigraph

**Statement.** Let  $C=\mathrm{conv}(\mathrm{epi}\,f)$ . Define

$$
g(x)=\inf\{t\mid (x,t)\in C\}.
$$

Show  $g$  is convex and  $\mathrm{epi}\,g=C$  (i.e., “convexify the epigraph = epigraph of the convex envelope”).

ChatGPT-Breakdown of convexity …

* * *

### Example 3.31 — homogenization trick

**Statement.** Define

$$
g(x)=\inf_{\alpha>0}\frac{f(\alpha x)}{\alpha}.
$$

Show  $g$  is convex (and interpret it as a homogenized/“cone-ified” version of  $f$ ).

ChatGPT-Breakdown of convexity …

* * *

### Example 3.35 — cardinality is quasiconcave on  $\mathbb R_+^n$ 

**Statement.** For  $x\in\mathbb R_+^n$ ,  $\mathrm{card}(x)$  (number of nonzeros) is quasiconcave; equivalently, superlevel sets  $\{x\in\mathbb R_+^n\mid \mathrm{card}(x)\ge k\}$  are convex.

ChatGPT-Breakdown of convexity …

* * *

### Example 3.36 — rank is quasiconcave on the PSD cone

**Statement.** On  $\mathbb S_+^n$ ,  $\mathrm{rank}(X)$  is quasiconcave; i.e.  $\{X\succeq 0\mid \mathrm{rank}(X)\ge r\}$  is convex.

ChatGPT-Breakdown of convexity …

* * *

### Exercise 3.47 — log-concavity ↔ Hessian test

**Statement.** For  $f>0$ , prove:  $f$  is log-concave    $\iff\ \log f$  is concave    $\iff\ \nabla^2\log f(x)\preceq 0$  (when  $f$  is twice differentiable).

ChatGPT-Breakdown of convexity …

* * *

### Exercise 3.48 — subtracting a constant preserves log-concavity on the right domain

**Statement.** If  $f$  is log-concave and  $a\ge 0$ , then  $f-a$  is log-concave on  $\{x\mid f(x)>a\}$ .

ChatGPT-Breakdown of convexity …

* * *

### Problem 15 — Hessian of  $\log f$ 

**Statement.** If  $f:\mathbb R^n\to\mathbb R$  is  $C^2$  and  $f(x)>0$ , define  $h(x)=\log f(x)$ . Prove

\\nabla^2 h(x)=\\frac{1}{f(x)}\\nabla^2 f(x)-\\frac{1}{f(x)^2}\\nabla f(x)\\nabla f(x)^\\top. \\\] :contentReference\[oaicite:23\]{index=23} --- ## 2) Roadmap: the minimal toolkit that makes \*all\* of the above feel routine Think of this as “learn 6 proof patterns; everything collapses into them.” ### Module 0 — Notation + “don’t die on definitions” You need these so you don’t waste brain cycles mid-proof: - Convex set, convex function, epigraph \\(\\mathrm{epi}\\,f=\\{(x,t)\\mid f(x)\\le t\\}\\). - Extended-value functions (allow \\(+\\infty\\)); indicator \\(I\_C(x)\\) of a set. - PSD order: \\(X\\succeq 0\\), \\(X\\preceq Y\\), and what “Hessian \\(\\succeq 0\\)” really means. \*\*Micro-drills (do until automatic):\*\* 1. Prove: \\(f\\) convex \\(\\iff\\ \\mathrm{epi}\\,f\\) convex. 2. Prove: pointwise supremum of affine (or convex) functions is convex. 3. Prove: if \\(C\\) is convex then \\(I\_C\\) is convex. \*\*This module feeds:\*\* Example 3.17, 3.20, 3.30, 3.31, and every “sup/inf” trick. --- ### Module 1 — The “big three” convexity-preserving operations These are the workhorses. #### (A) Affine precomposition If \\(f\\) convex, then \\(x\\mapsto f(Ax+b)\\) is convex. #### (B) Pointwise maximum / supremum If each \\(f\_i\\) convex, then \\(\\max\_i f\_i\\) convex; and \\(\\sup\_\\theta f\_\\theta\\) convex. #### (C) Partial minimization (projection of epigraph) If \\(F(x,y)\\) is jointly convex, then \\(g(x)=\\inf\_y F(x,y)\\) is convex. \*\*Micro-drills:\*\* - Prove each of (A)(B)(C) from epigraph geometry (one clean proof style). - Then prove them again from Jensen inequalities (second proof style). This doubles your robustness. \*\*This module feeds:\*\* Example 3.17 (it \*is\* (C)), Example 3.30 (epigraph + convex hull + “inf over \\(t\\)”), Example 3.31, plus half of Exercise 3.22. --- ### Module 2 — Variational representations: turning “weird” functions into sup of linear things This is how you make eigenvalues and norms convex without calculus. 1. \*\*Rayleigh quotient identity\*\* \\\[ \\lambda\_{\\max}(X)=\\max\_{\\|u\\|\_2=1}u^\\top Xu

(for symmetric  $X$ ). Key point: for fixed  $u$ ,  $u^\top Xu$  is _linear in  $X$ _.

2.  **Induced norm identities**
    $$
    \|X\|_{a,b}=\sup_{\|v\|_b=1}\|Xv\|_a =\sup_{\|u\|_{a^\*}=1,\ \|v\|_b=1}u^\top Xv.
    $$
    Key point: for fixed  $u,v$ ,  $u^\top Xv$  is linear in  $X$ .
3.  **“Sup of linear ⇒ convex”** becomes your reflex.

**Micro-drills:**

*   Derive the dual-norm identity  $\|z\|_a=\sup_{\|u\|_{a^\*}=1}u^\top z$ .
*   Prove the bilinear form for induced norms (swap the two suprema carefully).

**This module feeds:** Example 3.10 and Example 3.11 directly, and also Example 3.14(i).

* * *

### Module 3 — Composition rules (the “outer  $h$  + inner  $g$ ” machine)

You need two versions:

#### Version 1: convex + coordinatewise nondecreasing outer

If each  $g_i$  is convex and  $h$  is convex and nondecreasing in each coordinate, then  $h(g(x))$  is convex.

#### Version 2: convex + coordinatewise nonincreasing outer

If  $h$  is convex and **nonincreasing** in some coordinate, then you need that inner coordinate to be **concave** to preserve convexity.

This is exactly what bites people in Exercise 3.22(d,e): the outer function is convex but decreasing in arguments, so you must feed it concave pieces.

**Micro-drills:**

*   Prove both versions from scratch (componentwise inequalities + monotonicity).
*   Practice “monotonicity audit”: given  $h(a,b)$ , compute signs of  $\partial h/\partial a$ ,  $\partial h/\partial b$  and decide what inner curvature you need.

**This module feeds:** all of Example 3.14, plus Exercise 3.22(d,e) in a very direct way.

* * *

### Module 4 — Perspective transform + fractional forms

This is the hidden engine behind Example 3.20 and Exercise 3.23.

1.  **Perspective of a convex function is convex:**  
     $g(z,t)=t f(z/t)$  on  $t>0$ .
2.  **Affine insertion:**  
     $h(x)=t(x)f(z(x)/t(x))$  stays convex when  $z(x)$  affine and  $t(x)>0$ .
3.  **Fraction patterns to recognize instantly:**
    *    $ \|x\|^p / t^{p-1}$  (Exercise 3.23(a)).
*   Quadratic-over-linear:  $ \|Ax+b\|_2^2 / (c^\top x + d)$  (Exercise 3.23(b)).

**Micro-drills:**

*   Prove “quadratic-over-linear” convexity two ways:
    *   as a perspective of  $\|y\|_2^2$ ,
    *   via epigraph + Schur complement (optional but powerful).

**This module feeds:** Example 3.20, Exercise 3.23(a,b), and Exercise 3.22(d,e) (because you reuse 3.23(a) inside 3.22(d,e)).

* * *

### Module 5 — Quasi-convexity / quasi-concavity via level sets (no derivatives needed)

You need the definition in your bones:

*    $f$  quasiconvex    $\iff$  all **sublevel** sets  $\{x\mid f(x)\le \alpha\}$  are convex.
*    $f$  quasiconcave    $\iff$  all **superlevel** sets  $\{x\mid f(x)\ge \alpha\}$  are convex.

Then you prove Example 3.35 and 3.36 by _directly characterizing superlevel sets_.

**Micro-drills:**

*   For  $\mathrm{card}(x)$ , write  $\{\mathrm{card}(x)\ge k\}$  explicitly and prove convexity by showing it’s closed under convex combinations on  $\mathbb R_+^n$ .
*   For  $\mathrm{rank}(X)$ , learn the PSD geometry fact: mixing PSD matrices can’t decrease rank “too much” in the relevant direction; the superlevel set has a clean geometric description.

**This module feeds:** Example 3.35 and 3.36.

* * *

### Module 6 — Log-concavity + calculus identities (the “smooth” track)

Exercises 3.47, 3.48, and Problem 15 are this track.

1.  **Definition:**  $f$  log-concave    $\iff\ \log f$  concave (on  $f>0$ ).
2.  **Second-order test:** for  $C^2$  functions, concavity means Hessian  $\preceq 0$ .
3.  **Derivative algebra:** gradient/Hessian of  $\log f$  (Problem 15) is the algebra you reuse in 3.47 and 3.48.

**Micro-drills:**

*   Compute  $\nabla \log f = (\nabla f)/f$ .
*   Compute  $\nabla^2 \log f$  carefully and factor it into the “Hessian minus outer product” form.
*   Practice the “domain restriction” move: log-concavity statements always live on where the function is positive.

**This module feeds:** Exercise 3.47, Exercise 3.48, Problem 15.

* * *

3) “Which module do I need for which problem?” (fast dependency map)
--------------------------------------------------------------------

*   **Example 3.10:** Module 2 (Rayleigh quotient = sup of linear forms) + Module 1(B).
*   **Example 3.11:** Module 2 (dual norms + bilinear sup) + Module 1(B).
*   **Example 3.14(i–v):** Module 3 (composition) + (for specific bullets)
    *   (i) also Module 1(B) (max of linear)
    *   (ii) optionally Module 6 (Hessian PSD)
    *   (iii,v) need the “log-concave + 1-homogeneous ⇒ concave” lemma style
*   **Example 3.17:** Module 1(C) (partial minimization / projection of epigraph).
*   **Example 3.20:** Module 4 (perspective + affine insertion).
*   **Exercise 3.22(a–c):** Module 4 (perspective-ish thinking) + Module 1/3 (composition) + (for (c)) Schur complement intuition helps.
*   **Exercise 3.22(d–e):** Module 4 + Module 3 (outer decreasing + inner concave) + reuse Exercise 3.23(a).
*   **Exercise 3.23(a–b):** Module 4 (perspective) (+ optional Schur complement for (b)).
*   **Example 3.30:** Module 1(C) + epigraph geometry (conv hull + “inf over  $t$ ”).
*   **Example 3.31:** Module 1(C) style “inf over  $\alpha$ ” + convexity checks.
*   **Example 3.35 & 3.36:** Module 5 (level sets).
*   **Exercise 3.47, 3.48, Problem 15:** Module 6 (log-concavity + Hessians) + clean domain handling.

* * *

4) Sanity checks that prevent 80% of mistakes (use these like a checklist)
--------------------------------------------------------------------------

1.  **Domain first.** Many of these functions are convex only on a _convex domain_ (e.g.  $t>0$ ,  $c^\top x+d>0$ ,  $uv>x^\top x$ ). Always prove the domain is convex before anything else.
2.  **If you use composition:** explicitly write whether the outer function is increasing/decreasing in each argument. One wrong monotonicity sign breaks the proof.
3.  **If you claim “sup/inf preserves convexity”:**
    *    $\sup$  of convex functions is convex (good).
    *    $\inf$  of convex functions is **not** convex in general unless it’s _partial minimization of a jointly convex function_ (Module 1(C)).
4.  **For log-concavity:** never forget you’re working on  $\{x\mid f(x)>0\}$ . Exercise 3.48 is _all about_ restricting to  $\{f>a\}$ .

That’s the whole machine: if you build these modules in your head, every item in your document becomes a recognizable pattern-match instead of a bespoke struggle-session.

## Prompt:
Start from 3.10. Unpack me everything completely, from first principle. Explain from scratch, step-by-step. Explain interpretations, intuitions. Take granular steps. Make everything crystal clear.

## Response:
Example 3.10 (BV):  $f(X)=\lambda_{\max}(X)$  is convex on  $\mathbb S^n$ 
--------------------------------------------------------------------------

We’re proving a statement about a function whose input is a **matrix** (a symmetric one), and whose output is a **number**: the _largest eigenvalue_. The claim “convex” means: if you linearly mix two matrices, the largest eigenvalue of the mixture is at most the same mixture of the largest eigenvalues.

I’ll build every piece from scratch, then do the proof in a way that’s clean and unforgettable.

* * *

0) What is being proved, exactly?
=================================

Let  $\mathbb S^n$  be the set of real  $n\times n$  **symmetric** matrices:  $X=X^\top$ .

Define

$$
f(X) = \lambda_{\max}(X),
$$

where  $\lambda_{\max}(X)$  is the **largest eigenvalue** of  $X$ .

### Convexity claim

For all symmetric matrices  $X,Y\in\mathbb S^n$  and all  $\theta\in[0,1]$ ,

 $$
\boxed{\ \lambda_{\max}(\theta X + (1-\theta)Y) \ \le\ \theta\,\lambda_{\max}(X) + (1-\theta)\,\lambda_{\max}(Y)\ }.
$$

That’s the entire target.

* * *

1) Eigenvalues/eigenvectors from first principles (what they _mean_)
====================================================================

A nonzero vector  $v\neq 0$  is an **eigenvector** of  $X$  with **eigenvalue**  $\lambda$  if

$$
Xv = \lambda v.
$$

Interpretation (core intuition):

*    $X$  is a linear transformation.
*   Usually it _rotates + stretches_ vectors.
*   An eigenvector is a “special direction” that **does not rotate** under  $X$ ; it only stretches (or flips) by factor  $\lambda$ .

For symmetric matrices, life is especially nice:

*   Eigenvalues are real.
*   There exists an orthonormal basis of eigenvectors.
*   So  $X$  can be thought of as: choose orthogonal axes (eigenvectors), scale along each axis by the corresponding eigenvalue.

So  $\lambda_{\max}(X)$  is “the maximum stretch factor along some orthogonal axis.”

* * *

2) The key tool: Rayleigh quotient (why it exists, what it measures)
====================================================================

For a symmetric matrix  $X$  and a nonzero vector  $u$ , define the **Rayleigh quotient**

$$
R_X(u) = \frac{u^\top X u}{u^\top u}.
$$

### Why does this expression matter?

*    $u^\top Xu$  is a scalar (a “quadratic form”).
*   When  $X$  is symmetric,  $u^\top Xu$  measures how much  $X$  “pushes” in direction  $u$ , averaged appropriately.

If  $\|u\|_2 = 1$ , then  $u^\top u = 1$  and

$$
R_X(u)=u^\top Xu.
$$

So on the unit sphere,  $u^\top Xu$  is the Rayleigh quotient.

* * *

3) Fundamental fact: for symmetric  $X$ ,
=========================================

 $$
\boxed{\ \lambda_{\max}(X) \;=\; \max_{\|u\|_2=1} u^\top X u\ }.
$$

This is the entire engine behind convexity.

I’ll prove it from scratch.

* * *

3.1) Spectral theorem (the “diagonal in the right coordinates” picture)
-----------------------------------------------------------------------

Because  $X$  is symmetric, there exist orthonormal eigenvectors  $q_1,\dots,q_n$  and real eigenvalues  $\lambda_1,\dots,\lambda_n$  such that

$$
X q_i = \lambda_i q_i,\qquad q_i^\top q_j = \delta_{ij}.
$$

Let  $Q=[q_1\ \cdots\ q_n]$  (orthonormal columns, so  $Q^\top Q=I$ ). Then

$$
X = Q \Lambda Q^\top,
$$

where  $\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n)$ .

We can order eigenvalues so  $\lambda_1\le \cdots \le \lambda_n$ . Then  $\lambda_n=\lambda_{\max}(X)$ .

* * *

3.2) Compute  $u^\top Xu$  in eigen-coordinates
-----------------------------------------------

Take any unit vector  $u$  with  $\|u\|_2=1$ .

Because  $Q$  is an orthonormal basis, we can write

$$
u = \sum_{i=1}^n \alpha_i q_i,
$$

where  $\alpha_i = q_i^\top u$ .

Now compute  $\|u\|_2^2$ :

$$
\|u\|_2^2 = u^\top u = \left(\sum_i \alpha_i q_i\right)^\top \left(\sum_j \alpha_j q_j\right) = \sum_{i,j} \alpha_i\alpha_j q_i^\top q_j = \sum_i \alpha_i^2.
$$

Since  $\|u\|_2=1$ , we have

$$
\sum_{i=1}^n \alpha_i^2 = 1.
$$

Now compute  $u^\top Xu$ :

$$
u^\top Xu = \left(\sum_i \alpha_i q_i\right)^\top X \left(\sum_j \alpha_j q_j\right) = \sum_{i,j} \alpha_i\alpha_j q_i^\top X q_j.
$$

But  $Xq_j=\lambda_j q_j$ , so

$$
q_i^\top X q_j = q_i^\top (\lambda_j q_j)=\lambda_j q_i^\top q_j=\lambda_j \delta_{ij}.
$$

Thus all cross terms vanish and we get:

$$
u^\top Xu = \sum_{j=1}^n \alpha_j^2 \lambda_j.
$$

**Pause and interpret:**  
This is a weighted average of eigenvalues  $\lambda_j$  with weights  $\alpha_j^2\ge 0$  summing to 1. So

$$
u^\top Xu \in [\lambda_{\min}(X),\lambda_{\max}(X)].
$$

* * *

3.3) Upper bound:  $u^\top Xu \le \lambda_{\max}(X)$ 
-----------------------------------------------------

Since  $\lambda_j \le \lambda_{\max}(X)$  for every  $j$ ,

$$
u^\top Xu = \sum_j \alpha_j^2 \lambda_j \le \sum_j \alpha_j^2\,\lambda_{\max}(X) = \lambda_{\max}(X)\sum_j \alpha_j^2 = \lambda_{\max}(X).
$$

So for every unit  $u$ ,

$$
u^\top Xu \le \lambda_{\max}(X),
$$

hence

$$
\max_{\|u\|_2=1} u^\top Xu \le \lambda_{\max}(X).
$$

* * *

3.4) Achievability: there exists  $u$  with equality
----------------------------------------------------

Take  $u=q_{\max}$ , an eigenvector corresponding to  $\lambda_{\max}(X)$ , normalized to  $\|u\|_2=1$ . Then

$$
u^\top Xu = u^\top (\lambda_{\max} u) = \lambda_{\max} u^\top u = \lambda_{\max}.
$$

So

$$
\max_{\|u\|_2=1} u^\top Xu \ge \lambda_{\max}(X).
$$

Combine with the earlier inequality, we conclude

 $$
\boxed{\ \lambda_{\max}(X) = \max_{\|u\|_2=1} u^\top Xu\ }.
$$

That’s the Rayleigh characterization.

* * *

4) The convexity proof (now it’s basically one line… but I’ll expand every step)
================================================================================

We want:

$$
\lambda_{\max}(\theta X+(1-\theta)Y)\le \theta\lambda_{\max}(X)+(1-\theta)\lambda_{\max}(Y).
$$

Start from the Rayleigh formula applied to  $\theta X+(1-\theta)Y$ :

$$
\lambda_{\max}(\theta X+(1-\theta)Y) = \max_{\|u\|_2=1} u^\top(\theta X+(1-\theta)Y)u.
$$

### Step 1: expand the quadratic form (linearity)

For any fixed  $u$ ,

$$
u^\top(\theta X+(1-\theta)Y)u = \theta\,u^\top Xu + (1-\theta)\,u^\top Yu.
$$

So

$$
\lambda_{\max}(\theta X+(1-\theta)Y) = \max_{\|u\|_2=1}\left[\theta\,u^\top Xu + (1-\theta)\,u^\top Yu\right].
$$

### Step 2: “max of a sum” ≤ “sum of maxes”

This is a standard inequality:

For any functions  $a(u), b(u)$  and  $\theta\in[0,1]$ ,

$$
\max_u\left(\theta a(u)+(1-\theta)b(u)\right) \le \theta \max_u a(u) + (1-\theta)\max_u b(u).
$$

**Why is it true?**  
Because for every specific  $u$ ,

*    $a(u)\le \max a$ 
*    $b(u)\le \max b$ 

Multiply by nonnegative weights  $\theta,(1-\theta)$  and add:

$$
\theta a(u)+(1-\theta)b(u) \le \theta \max a + (1-\theta)\max b.
$$

This holds for all  $u$ , so it holds for the maximum over  $u$  of the left-hand side.

Apply with  $a(u)=u^\top Xu$ ,  $b(u)=u^\top Yu$ , and constraint  $\|u\|_2=1$ :

$$
\max_{\|u\|_2=1}\left[\theta u^\top Xu+(1-\theta)u^\top Yu\right] \le \theta\max_{\|u\|_2=1} u^\top Xu + (1-\theta)\max_{\|u\|_2=1} u^\top Yu.
$$

### Step 3: replace each max by  $\lambda_{\max}$  using Rayleigh again

$$
\max_{\|u\|_2=1}u^\top Xu=\lambda_{\max}(X), \qquad \max_{\|u\|_2=1}u^\top Yu=\lambda_{\max}(Y).
$$

Therefore

$$
\lambda_{\max}(\theta X+(1-\theta)Y) \le \theta\lambda_{\max}(X)+(1-\theta)\lambda_{\max}(Y).
$$

That is exactly convexity. ✅

* * *

5) Why this proof is so conceptually satisfying (intuition)
===========================================================

There are two deep ideas hiding here:

### (I) “Largest eigenvalue” is a supremum of linear functions

For each unit vector  $u$ , the map

$$
X \mapsto u^\top X u
$$

is **linear in  $X$ ** (it’s a bilinear form in entries of  $X$ , but linear as a function of the matrix).

Then

$$
\lambda_{\max}(X)=\max_{\|u\|=1} u^\top X u
$$

is the **pointwise supremum** of a family of linear functions of  $X$ .

**Big theorem you can memorize:**

> The pointwise supremum of affine (hence linear) functions is convex.

So convexity is basically “sup of linear.”

### (II) Geometric picture: supporting hyperplanes to a convex set

The set

$$
\{X\in\mathbb S^n : \lambda_{\max}(X)\le t\}
$$

is convex (it’s equivalent to  $X\preceq tI$ , a convex LMI set). The function  $\lambda_{\max}$  is the “smallest  $t$ ” that makes that inequality true.

That’s another “convex geometry” way of seeing the same phenomenon.

* * *

6) Useful corollaries (these will come back in later problems)
==============================================================

1.  **Lipschitz bound in spectral norm:**
    $$
    |\lambda_{\max}(X)-\lambda_{\max}(Y)| \le \|X-Y\|_2.
    $$
    (This is because eigenvalues can confirm via Rayleigh + norm inequalities.)
2.  **Subgradient (when eigenvalue is simple):**  
    If  $\lambda_{\max}(X)$  has a unique unit eigenvector  $q$ , then
    $$
    \nabla \lambda_{\max}(X) = qq^\top
    $$
    in the matrix-gradient sense. If it’s not unique, the subdifferential is the convex hull of  $qq^\top$  over top-eigenvectors.
3.  **Semidefinite representation:**
    $$
    \lambda_{\max}(X)=\min\{t\in\mathbb R:\ X\preceq tI\}.
    $$
    This also screams convexity because it’s a minimum over a convex feasible set in  $(X,t)$ .

* * *

What you should now _feel_ in your bones
----------------------------------------

*   A symmetric matrix stretches space differently along orthogonal directions.
*   The largest eigenvalue is the maximum “stretch” you can get.
*   The Rayleigh quotient literally asks: “If I pick a direction  $u$ , how much do I stretch along it?”
*   Taking the best direction (a max over  $u$ ) makes  $\lambda_{\max}$  a **maximum of linear functions**, and maxima of linear functions are convex.

* * *

Next in your document is Example 3.11 (induced/operator norm convexity). It’s the _same proof pattern_ (“sup over something of something linear”), but you’ll need dual norms to make it crisp.

## Prompt:
Next.

## Response:
Example 3.11 (BV): induced/operator matrix norms are convex — from first principles
-----------------------------------------------------------------------------------

You said “Next”, so we go to **Example 3.11**.

### What we must show (two claims)

Given two vector norms  $\|\cdot\|_a$  on  $\mathbb R^m$  and  $\|\cdot\|_b$  on  $\mathbb R^n$ , define the **induced (operator) norm**

$$
\|X\|_{a,b} \;=\; \sup_{\|v\|_b=1}\; \|Xv\|_a.
$$

We prove:

1.   $\|X\|_{a,b}$  is **convex** in  $X$ .
2.  Variational/bilinear form:
    
$$
\|X\|_{a,b} \;=\; \sup\{u^\top Xv \mid \|u\|_{a^\*}=1,\ \|v\|_b=1\},
$$

where  $\|\cdot\|_{a^\*}$  is the **dual norm** of  $\|\cdot\|_a$ .

This will mirror Example 3.10: “a scary function = a supremum of linear functions  $\Rightarrow$  convex.”

* * *

0) Before anything: what is an induced/operator norm (meaning)
==============================================================

A matrix  $X:\mathbb R^n\to\mathbb R^m$  is a linear map. A norm  $\|\cdot\|_b$  measures input size;  $\|\cdot\|_a$  measures output size.

$$
\|X\|_{a,b}=\sup_{\|v\|_b=1}\|Xv\|_a
$$

means:

> Look at **every** input vector of “unit size” (in the  $b$ \-norm), apply  $X$ , measure output size (in the  $a$ \-norm), and take the **largest** possible output size.

So  $\|X\|_{a,b}$  is the **maximum stretch factor** of the linear map  $X$  from the  $(\mathbb R^n,\|\cdot\|_b)$  world to the  $(\mathbb R^m,\|\cdot\|_a)$  world.

If  $a=b=2$ , this is the familiar spectral/operator norm: largest singular value.

* * *

1) Dual norms from scratch (because the bilinear form depends on them)
======================================================================

1.1 Definition
--------------

Given any norm  $\|\cdot\|_a$  on  $\mathbb R^m$ , define its **dual norm**

$$
\|u\|_{a^\*} \;:=\; \sup_{\|z\|_a \le 1} u^\top z.
$$

Interpretation:

*   The quantity  $u^\top z$  is “how much  $u$  aligns with  $z$ ”.
*   Over all vectors  $z$  of  $a$ \-norm at most 1, the maximum alignment is  $\|u\|_{a^\*}$ .

This definition is not random: it’s exactly the right constant in Hölder/Cauchy-Schwarz type inequalities.

1.2 Fundamental inequality (general Hölder)
-------------------------------------------

For all  $u,z$ ,

$$
u^\top z \le \|u\|_{a^\*}\,\|z\|_a.
$$

**Proof (one line, but fully justified):**

*   If  $z=0$ , trivial.
*   If  $z\neq 0$ , write  $z = \|z\|_a \cdot \tilde z$  with  $\|\tilde z\|_a = 1$ .  
    Then
    
$$
u^\top z = \|z\|_a \, u^\top \tilde z \le \|z\|_a \sup_{\|w\|_a=1} u^\top w = \|z\|_a \|u\|_{a^\*}.
$$

Done.

1.3 Crucial representation of a norm via its dual
-------------------------------------------------

For any  $z$ ,

 $$
\boxed{\ \|z\|_a = \sup_{\|u\|_{a^\*}\le 1} u^\top z\ }.
$$

This is the key identity we will plug into  $\|Xv\|_a$ .

**Why is it true?** Two inequalities:

### (≤) direction

For any  $u$  with  $\|u\|_{a^\*}\le 1$ , Hölder gives

$$
u^\top z \le \|u\|_{a^\*}\|z\|_a \le \|z\|_a.
$$

So taking supremum over such  $u$ ,

$$
\sup_{\|u\|_{a^\*}\le 1} u^\top z \le \|z\|_a.
$$

### (≥) direction (the “supporting hyperplane” fact)

This is the one that people handwave; here’s the clean geometric reason.

Let  $B=\{w:\|w\|_a\le 1\}$  be the unit ball of  $\|\cdot\|_a$ . It is convex, closed, contains 0.

Take  $z\neq 0$ . Consider the boundary point

$$
\bar z := \frac{z}{\|z\|_a},
$$

which lies on  $\partial B$  because  $\|\bar z\|_a=1$ .

A standard theorem in convex analysis (supporting hyperplane theorem) says: at a boundary point of a closed convex set, there exists a nonzero vector  $u$  such that

$$
u^\top w \le u^\top \bar z \quad \text{for all } w\in B.
$$

That inequality means  $u$  defines a hyperplane “supporting” the unit ball at  $\bar z$ .

Now take supremum of  $u^\top w$  over  $w\in B$ : it equals  $u^\top \bar z$ . But by definition of dual norm,

$$
\|u\|_{a^\*} = \sup_{w\in B} u^\top w = u^\top \bar z.
$$

Normalize  $u$  by dividing by  $\|u\|_{a^\*}$  to get  $u'$  with  $\|u'\|_{a^\*}=1$  and

$$
u'^\top \bar z = 1.
$$

Multiply by  $\|z\|_a$ :

$$
u'^\top z = \|z\|_a.
$$

So the supremum is at least  $\|z\|_a$ . Combine with the ≤ direction and we get equality.

If you don’t want to invoke supporting hyperplanes yet: accept this identity as a known fact about dual norms; BV uses it constantly.

* * *

2) Derive the bilinear/saddle representation of the induced norm
================================================================

Start from the definition:

$$
\|X\|_{a,b} = \sup_{\|v\|_b=1}\|Xv\|_a.
$$

Use the dual representation of the  $a$ \-norm with  $z=Xv$ :

$$
\|Xv\|_a = \sup_{\|u\|_{a^\*}\le 1} u^\top (Xv).
$$

So

$$
\|X\|_{a,b} = \sup_{\|v\|_b=1}\ \sup_{\|u\|_{a^\*}\le 1} u^\top X v.
$$

Now note:  $\sup\sup = \sup$  over the product set:

$$
\sup_{\|v\|_b=1}\sup_{\|u\|_{a^\*}\le 1} (\cdot) = \sup_{\substack{\|v\|_b=1\\ \|u\|_{a^\*}\le 1}} (\cdot).
$$

Also, “ $\le 1$ ” can be replaced by “ $=1$ ” unless the optimum is 0, because if  $u^\top Xv$  is positive, scaling  $u$  up increases it until it hits the boundary. More formally:

$$
\sup_{\|u\|_{a^\*}\le 1} u^\top Xv = \sup_{\|u\|_{a^\*}=1} u^\top Xv
$$

since the objective is linear in  $u$  and the feasible set is a compact convex set whose maximum occurs at an extreme point on the boundary. (If the max is 0, boundary still achieves it.)

Thus we obtain the promised bilinear form:

 $$
\boxed{\ \|X\|_{a,b}=\sup\{u^\top Xv:\ \|u\|_{a^\*}=1,\ \|v\|_b=1\}\ }.
$$

That proves claim (2).

* * *

3) Prove convexity of  $X\mapsto \|X\|_{a,b}$ 
==============================================

Now we use the “supremum of linear functions is convex” principle, but I’ll prove it directly with Jensen-style inequality to keep it first-principles.

Take any  $X,Y\in\mathbb R^{m\times n}$ ,  $\theta\in[0,1]$ . Let

$$
Z := \theta X + (1-\theta)Y.
$$

We want:

$$
\|Z\|_{a,b}\le \theta\|X\|_{a,b}+(1-\theta)\|Y\|_{a,b}.
$$

Start from definition:

$$
\|Z\|_{a,b} = \sup_{\|v\|_b=1}\|Zv\|_a.
$$

Fix an arbitrary  $v$  with  $\|v\|_b=1$ . Then

$$
Zv = (\theta X + (1-\theta)Y)v = \theta(Xv)+(1-\theta)(Yv).
$$

Now use **convexity of the norm  $\|\cdot\|_a$ ** in its argument:

### Fact: every norm is convex

For any vectors  $p,q$  and  $\theta\in[0,1]$ ,

$$
\|\theta p+(1-\theta)q\|_a \le \theta\|p\|_a+(1-\theta)\|q\|_a.
$$

**Proof:** triangle inequality + homogeneity:

$$
\|\theta p+(1-\theta)q\|_a \le \|\theta p\|_a+\|(1-\theta)q\|_a = \theta\|p\|_a+(1-\theta)\|q\|_a.
$$

Apply this with  $p=Xv$ ,  $q=Yv$ :

$$
\|Zv\|_a = \|\theta Xv + (1-\theta)Yv\|_a \le \theta\|Xv\|_a+(1-\theta)\|Yv\|_a.
$$

Now take supremum over all  $\|v\|_b=1$  on both sides.

Left-hand side:

$$
\sup_{\|v\|_b=1}\|Zv\|_a = \|Z\|_{a,b}.
$$

Right-hand side: use the same “sup of sum ≤ sum of sups” trick:

$$
\sup_{\|v\|_b=1}\left[\theta\|Xv\|_a+(1-\theta)\|Yv\|_a\right] \le \theta \sup_{\|v\|_b=1}\|Xv\|_a +(1-\theta)\sup_{\|v\|_b=1}\|Yv\|_a.
$$

But those sups are exactly  $\|X\|_{a,b}$  and  $\|Y\|_{a,b}$ . Therefore

$$
\|Z\|_{a,b} \le \theta\|X\|_{a,b}+(1-\theta)\|Y\|_{a,b}.
$$

So  $X\mapsto \|X\|_{a,b}$  is convex. ✅

* * *

4) Deep intuition: why convexity is inevitable here
===================================================

### The “maximum stretch” lens

 $\|X\|_{a,b}$  is a worst-case amplification:

$$
\text{gain}(X) = \max_{\text{unit inputs}} \text{output size}.
$$

When you average two systems  $X$  and  $Y$ , you’re literally building a system that on each input  $v$  produces an averaged output:

$$
Zv = \theta(Xv) + (1-\theta)(Yv).
$$

The size of an averaged output can’t exceed the averaged sizes (triangle inequality). Then taking “worst case over inputs” preserves that inequality. That’s the entire story.

### The “sup of linear functionals” lens (even more structural)

From the bilinear form,

$$
\|X\|_{a,b} = \sup_{\|u\|_{a^\*}=1,\ \|v\|_b=1} u^\top Xv.
$$

For each fixed  $(u,v)$ , the map

$$
X \mapsto u^\top X v
$$

is **linear** in  $X$  (it’s just a weighted sum of entries).

Supremum of linear functions is always convex. So convexity is baked into the definition.

This is exactly the same pattern as Example 3.10:

*    $\lambda_{\max}(X) = \sup_{\|u\|=1} u^\top Xu$  (sup of linear-in- $X$  maps).
*    $\|X\|_{a,b} = \sup_{u,v} u^\top Xv$  (sup of linear-in- $X$  maps).

Same skeleton, different costume.

* * *

5) Sanity checks + special cases you should recognize instantly
===============================================================

1.  If  $a=b=2$ :
    
$$
\|X\|_{2,2} = \sigma_{\max}(X),
$$

largest singular value (the spectral norm). Convex.

2.  If  $a=b=\infty$ :
    
$$
\|X\|_{\infty,\infty} = \max_i \sum_j |X_{ij}|
$$

(max row-sum norm). Convex because it’s max of convex functions of entries.

3.  If  $a=b=1$ :
    
$$
\|X\|_{1,1} = \max_j \sum_i |X_{ij}|
$$

(max column-sum norm). Also convex.

4.  Dual norm examples (so you don’t get lost later):
    *   Dual of  $\|\cdot\|_2$  is  $\|\cdot\|_2$ .
*   Dual of  $\|\cdot\|_1$  is  $\|\cdot\|_\infty$ .
*   Dual of  $\|\cdot\|_\infty$  is  $\|\cdot\|_1$ .

These matter when you explicitly compute the bilinear representation.

* * *

If we continue, the next in your list is **Example 3.14 (vector composition)**, which is a whole “composition rules toolbox” with multiple bullets. The style shifts: it becomes _monotonicity + convexity/concavity + composition logic_ rather than “sup of linear.”

## Prompt:
Further unpack, breakdown, explain more granularm add interpretations and intuitions also.

## Response:
Alright. Let’s take Example 3.11 and peel it like an onion until it’s basically transparent. I’ll do four layers:

1.  What the induced norm is **really** measuring (geometric + operational meaning).
2.  Why the definition uses a **supremum over unit vectors** (and why “ $\|v\|_b=1$ ” vs “ $\le 1$ ” doesn’t matter).
3.  Dual norm: what it is, why it exists, and how it turns “a norm” into a **sup of dot-products**.
4.  How all of that makes convexity basically inevitable (with multiple intuitive proof angles).

* * *

1) What  $\|X\|_{a,b}$  actually _means_
========================================

You have a linear map

$$
X:\ (\mathbb R^n,\|\cdot\|_b)\to (\mathbb R^m,\|\cdot\|_a).
$$

The induced norm is

$$
\|X\|_{a,b}=\sup_{\|v\|_b=1}\|Xv\|_a.
$$

### Interpretation A: “Worst-case gain / amplification”

Think of  $v$  as an input signal. Its “size” is measured by  $\|\cdot\|_b$ . The output  $Xv$  has size measured by  $\|\cdot\|_a$ .

Then

$$
\|X\|_{a,b} = \text{largest possible output size when input size is 1}.
$$

So it’s literally the “gain knob” of the system: maximum amplification.

### Interpretation B: “Smallest Lipschitz constant”

A function  $T$  is  $L$ \-Lipschitz if

$$
\|T(v)-T(w)\|_a \le L\|v-w\|_b \quad \forall v,w.
$$

For a linear map  $T(v)=Xv$ ,

$$
T(v)-T(w) = X(v-w),
$$

so the condition becomes

$$
\|Xh\|_a \le L\|h\|_b \quad \forall h.
$$

The smallest such  $L$  is exactly  $\|X\|_{a,b}$ . Why?

*   If  $\|h\|_b\neq 0$ , divide by  $\|h\|_b$ :
    $$
    \frac{\|Xh\|_a}{\|h\|_b} \le L.
    $$
*   Taking supremum over all nonzero  $h$ ,
    $$
    \sup_{h\neq 0}\frac{\|Xh\|_a}{\|h\|_b} \le L.
    $$
*   The left side is exactly  $\|X\|_{a,b}$  (see the “unit vector reduction” below).  
    So  $\|X\|_{a,b}$  is the “best possible” Lipschitz constant.

### Interpretation C: “How  $X$  maps one unit ball into another”

Let

$$
B_b := \{v:\|v\|_b\le 1\},\qquad B_a := \{y:\|y\|_a\le 1\}.
$$

Then  $\|X\|_{a,b}\le t$  means:

$$
\|Xv\|_a\le t \quad \text{for every } v \text{ with } \|v\|_b\le 1.
$$

Equivalently:

$$
X(B_b) \subseteq t\,B_a.
$$

So  $\|X\|_{a,b}$  is the **smallest scaling factor**  $t$  such that the image of the  $b$ \-unit ball fits inside a scaled  $a$ \-unit ball.

This is a _pure geometric containment_ statement.

* * *

2) Why do we only look at  $\|v\|_b=1$ ? (and not all  $v$ )
============================================================

This is a “homogeneity” trick: linear maps and norms both scale nicely.

2.1 The ratio form
------------------

For any  $v\neq 0$ ,

$$
\frac{\|Xv\|_a}{\|v\|_b}.
$$

This ratio says: “output per unit input” for that  $v$ .

Now rewrite  $v$  as  $\|v\|_b \cdot \hat v$ , where

$$
\hat v = \frac{v}{\|v\|_b},\quad \|\hat v\|_b=1.
$$

Then

$$
\|Xv\|_a = \|X(\|v\|_b\hat v)\|_a = \|\|v\|_b \,X\hat v\|_a = \|v\|_b\,\|X\hat v\|_a
$$

(using linearity of  $X$  and homogeneity of norms).  
So the ratio becomes

$$
\frac{\|Xv\|_a}{\|v\|_b}=\|X\hat v\|_a.
$$

Meaning: the ratio depends only on the **direction**  $\hat v$  on the  $b$ \-unit sphere.

Therefore

$$
\sup_{v\neq 0}\frac{\|Xv\|_a}{\|v\|_b} = \sup_{\|v\|_b=1}\|Xv\|_a.
$$

So the “unit sphere” is not arbitrary—it’s “all directions, normalized.”

2.2 Why “ $\|v\|_b=1$ ” equals “ $\|v\|_b\le 1$ ” here
------------------------------------------------------

Because if  $\|v\|_b<1$ , you can scale  $v$  up to the boundary:

$$
\tilde v = \frac{v}{\|v\|_b} \quad (\|\tilde v\|_b=1).
$$

Then

$$
\|X\tilde v\|_a = \frac{1}{\|v\|_b}\|Xv\|_a \ge \|Xv\|_a.
$$

So the worst case always occurs on the boundary (unless everything is zero).

Geometric translation: maxima of homogeneous functions over a ball occur on the sphere.

* * *

3) Dual norm: what it _is_ and why it’s the perfect tool
========================================================

The “bilinear form” in the example is:

$$
\|X\|_{a,b}=\sup_{\|u\|_{a^\*}=1,\ \|v\|_b=1} u^\top Xv.
$$

So we need to understand the dual norm  $\|\cdot\|_{a^\*}$ .

3.1 Why the dot product is the universal measuring stick
--------------------------------------------------------

The dot product  $u^\top z$  measures alignment: if  $u$  points in the same direction as  $z$ ,  $u^\top z$  is large.

If you want to “measure the size” of  $z$ , you can ask:

> what is the maximum possible alignment of  $z$  with a unit vector  $u$ ?

But “unit” depends on the norm you choose. If your unit vectors are  $\|u\|_{a^\*}\le 1$ , you get exactly  $\|z\|_a$ .

That’s the duality: the norm  $\|\cdot\|_a$  is recovered as a supremum of dot products against the dual unit ball.

3.2 Dual norm definition (again, but now intuitive)
---------------------------------------------------

$$
\|u\|_{a^\*}:=\sup_{\|z\|_a\le 1}u^\top z.
$$

This means: take the  $a$ \-unit ball; ask “how far in direction  $u$  does it extend?” That “support function” is  $\|u\|_{a^\*}$ .

So:

*    $\|\cdot\|_a$ : describes the ball in primal space
*    $\|\cdot\|_{a^\*}$ : describes the same ball by its supporting hyperplanes

This is convex geometry in disguise.

3.3 The killer identity: norm as a supremum of linear functionals
-----------------------------------------------------------------

 $$
\boxed{\ \|z\|_a = \sup_{\|u\|_{a^\*}\le 1} u^\top z\ }.
$$

Interpretation:

*   A norm is a convex, positively homogeneous function.
*   Such functions are precisely “suprema of linear functionals” (support functions / Minkowski functionals).
*   This identity makes the norm “linearizable”:  $\|z\|_a$  becomes “maximize a dot product.”

### Concrete examples to anchor this

*   If  $\|\cdot\|_a=\|\cdot\|_2$ , then  $a^\*=2$ , and
    $$
    \|z\|_2 = \sup_{\|u\|_2\le 1} u^\top z
    $$
    (Cauchy–Schwarz; max achieved at  $u=z/\|z\|_2$ ).
*   If  $\|\cdot\|_a=\|\cdot\|_1$ , then  $a^\*=\infty$ , and
    $$
    \|z\|_1=\sup_{\|u\|_\infty\le 1}u^\top z.
    $$
    Achieved by choosing  $u_i=\mathrm{sign}(z_i)$ .
*   If  $\|\cdot\|_a=\|\cdot\|_\infty$ , then  $a^\*=1$ , and
    $$
    \|z\|_\infty=\sup_{\|u\|_1\le 1}u^\top z.
    $$
    Achieved by putting all mass on the largest coordinate.

These are _perfect_ for intuition: dual norms “pick out” extremal coordinates/directions.

* * *

4) Deriving the bilinear form: step-by-step and intuitive
=========================================================

Start:

$$
\|X\|_{a,b}=\sup_{\|v\|_b=1}\|Xv\|_a.
$$

Replace  $\|Xv\|_a$  using the dual identity with  $z=Xv$ :

$$
\|Xv\|_a=\sup_{\|u\|_{a^\*}\le 1}u^\top (Xv).
$$

So:

$$
\|X\|_{a,b} = \sup_{\|v\|_b=1}\sup_{\|u\|_{a^\*}\le 1} u^\top Xv.
$$

Now interpret this:

*   Inner supremum over  $u$  chooses the “best measuring direction” in output space to evaluate the output vector  $Xv$ .
*   Outer supremum over  $v$  chooses the input direction that makes that best-measured output as large as possible.

So it’s literally a two-player game:

*   Player V picks input direction  $v$ 
*   Player U picks output “probe” direction  $u$ 
*   Payoff is  $u^\top Xv$ 

Finally:

$$
\sup_{\|v\|=1}\sup_{\|u\|\le 1}(\cdot) = \sup_{\|u\|\le 1,\|v\|=1}(\cdot).
$$

Also, because the objective is linear in  $u$ , maximum over a convex compact set  $\{u:\|u\|_{a^\*}\le 1\}$  occurs on the boundary, so we can write  $\|u\|_{a^\*}=1$  (same value).

Thus:

 $$
\boxed{\ \|X\|_{a,b}=\sup\{u^\top Xv:\ \|u\|_{a^\*}=1,\ \|v\|_b=1\}\ }.
$$

* * *

5) Convexity: multiple angles, all intuitive
============================================

We want: for  $Z=\theta X+(1-\theta)Y$ ,

$$
\|Z\|_{a,b}\le \theta\|X\|_{a,b}+(1-\theta)\|Y\|_{a,b}.
$$

Angle 1 (triangle inequality “engineering view”)
------------------------------------------------

For any unit  $v$  ( $\|v\|_b=1$ ):

$$
\|Zv\|_a = \|\theta Xv+(1-\theta)Yv\|_a \le \theta\|Xv\|_a+(1-\theta)\|Yv\|_a
$$

(norm convexity = triangle inequality + homogeneity).  
Now take worst-case  $v$ :

$$
\sup_{\|v\|_b=1}\|Zv\|_a \le \sup_{\|v\|_b=1}\left(\theta\|Xv\|_a+(1-\theta)\|Yv\|_a\right) \le \theta \sup_{\|v\|_b=1}\|Xv\|_a + (1-\theta)\sup_{\|v\|_b=1}\|Yv\|_a.
$$

So  $\|Z\|_{a,b}\le \theta\|X\|_{a,b}+(1-\theta)\|Y\|_{a,b}$ . Done.

**Intuition:** mixing two systems mixes their outputs; output size is subadditive → worst-case output size is convex.

Angle 2 (“sup of linear functionals” pure convexity view)
---------------------------------------------------------

From the bilinear form:

$$
\|X\|_{a,b}=\sup_{(u,v)\in\mathcal U\times\mathcal V} u^\top Xv
$$

where  $\mathcal U=\{u:\|u\|_{a^\*}=1\}$ ,  $\mathcal V=\{v:\|v\|_b=1\}$ .

For fixed  $u,v$ , the map  $X\mapsto u^\top Xv$  is linear in  $X$ . A supremum of linear functions is convex. This is the structural reason.

**Intuition:** “worst-case of a bunch of linear scores” is a convex “upper envelope.”

Angle 3 (geometric containment again)
-------------------------------------

 $\|X\|_{a,b}\le t$  iff  $X(B_b)\subseteq tB_a$ .  
Containment constraints behave convexly under mixing  $X$ ’s, because

$$
(\theta X+(1-\theta)Y)(B_b) \subseteq \theta X(B_b) + (1-\theta)Y(B_b),
$$

and Minkowski sums preserve containment inside scaled convex sets. This is a convex-geometry explanation.

* * *

6) A super concrete mental model: “stretching a ball into a blob”
=================================================================

Picture  $B_b$  as your “input unit ball.” Apply  $X$ : it becomes some centrally symmetric convex blob in  $\mathbb R^m$  (because linear map of a convex set is convex).

Now  $\|X\|_{a,b}$  asks:

> how big must I scale the output unit ball  $B_a$  so it fully contains that blob?

That is a “smallest scaling factor to contain” question, which is naturally convex.

* * *

7) Tiny sanity example (2D) to make it tactile
==============================================

Let  $a=b=2$ . Then  $\|X\|_{2,2}$  is the largest singular value: maximum stretch of the Euclidean unit circle into an ellipse.

*   If  $X$  stretches most along some direction by factor 5, then  $\|X\|_{2,2}=5$ .
*   If  $Y$  stretches most by factor 1, then  $\|Y\|_{2,2}=1$ .
*   The mixture  $Z=\tfrac12(X+Y)$  cannot suddenly have max stretch >  $\tfrac12(5+1)=3$ . Why? Because any output of  $Z$  is an average of outputs of  $X$  and  $Y$ , and Euclidean length is convex.

This is “convexity in physical form.”

* * *

The meta-pattern you should memorize (because it repeats forever in BV)
-----------------------------------------------------------------------

**Pattern A:**  
If you can write  $F(X)=\sup_{\alpha\in A} \langle L_\alpha, X\rangle$  (supremum of linear functionals), then  $F$  is convex.

*   Example 3.10:  $\lambda_{\max}(X)=\sup_{\|u\|=1} u^\top Xu$ .
*   Example 3.11:  $\|X\|_{a,b}=\sup_{\|u\|_{a^\*}=1,\|v\|_b=1} u^\top Xv$ .

Same skeleton. Different costume.

* * *

Next in your document is Example 3.14 (composition rules). That’s a different skeleton: “outer convex + monotone + inner convex” (and the concave variants).

2/2

## Prompt:
3.14

## Response:
Example 3.14 (BV): composition with a vector of functions — the whole machine, from scratch
-------------------------------------------------------------------------------------------

This example is one of the most important “automation rules” in convex analysis: it tells you when a function built like

$$
f(x)=h\big(g_1(x),\dots,g_k(x)\big)
$$

is convex (or concave), based on:

*   curvature of the inner functions  $g_i$ ,
*   curvature of the outer function  $h$ ,
*   **monotonicity** of  $h$  in each coordinate.

You can think of it as: **curvature + monotonicity = safe composition**.

Your document highlights the standard rule (convex case):

> If each  $g_i$  is convex and  $h$  is convex and **nondecreasing in each coordinate**, then  
>    $\;x\mapsto h(g_1(x),\dots,g_k(x))$  is convex.
> 
> ChatGPT-Breakdown of convexity …

Then it gives five important outer functions  $h$ : (i) sum of top  $r$ , (ii) log-sum-exp, (iii)  $p$ \-aggregation  $0<p\le 1$  concave, (iv)  $p\ge 1$  convex, (v) geometric mean concave.

I’ll do this in layers:

1.  Build the **general theorem** carefully and prove it from first principles.
2.  Explain the **monotonicity logic** (why it’s the make-or-break).
3.  Then go through (i)–(v): show each  $h$  has the needed properties, and what that implies for compositions.
4.  Give strong intuition: “envelopes,” “softmax,” “Minkowski,” “power means,” etc.

* * *

1) Setup: notation and what “nondecreasing in each argument” means
==================================================================

Let  $g:\mathbb R^n\to\mathbb R^k$  be the vector-valued map

$$
g(x)=\big(g_1(x),\dots,g_k(x)\big).
$$

Let  $h:\mathbb R^k\to\mathbb R$ .

Define

$$
f(x)=h(g(x)).
$$

### Coordinatewise monotonicity

We say  $h$  is **nondecreasing in each argument** (also called **componentwise nondecreasing**) if:

$$
z\le z' \;\;(\text{componentwise})\quad\Rightarrow\quad h(z)\le h(z').
$$

Componentwise means:  $z_i\le z'_i$  for all  $i$ .

This is strictly stronger than “nondecreasing along some direction”; it’s monotone in **every coordinate separately**.

* * *

2) The core convex composition theorem (and proof)
==================================================

Theorem (Convex + nondecreasing outer)
--------------------------------------

Assume:

*   Each  $g_i:\mathbb R^n\to\mathbb R$  is **convex**.
*    $h:\mathbb R^k\to\mathbb R$  is **convex**.
*    $h$  is **nondecreasing in each argument**.

Then  $f(x)=h(g_1(x),\dots,g_k(x))$  is convex.

### What we must prove

For all  $x,y\in\mathbb R^n$  and  $\theta\in[0,1]$ ,

$$
f(\theta x+(1-\theta)y)\le \theta f(x)+(1-\theta)f(y).
$$

* * *

Proof from first principles (Jensen-style)
------------------------------------------

Let  $x,y$  and  $\theta\in[0,1]$  be arbitrary. Set

$$
\bar x = \theta x+(1-\theta)y.
$$

### Step 1: apply convexity of each inner function  $g_i$ 

Because  $g_i$  is convex,

$$
g_i(\bar x) = g_i(\theta x+(1-\theta)y) \le \theta g_i(x)+(1-\theta)g_i(y).
$$

This is true for each  $i=1,\dots,k$ .

Collect these inequalities into a **vector inequality**. Define vectors in  $\mathbb R^k$ :

$$
u := g(\bar x) = (g_1(\bar x),\dots,g_k(\bar x)),
$$
 
$$
v := \theta g(x)+(1-\theta)g(y) = (\theta g_1(x)+(1-\theta)g_1(y),\dots).
$$

Then we have

$$
u \le v \quad\text{componentwise}.
$$

### Step 2: use monotonicity of  $h$ 

Since  $h$  is nondecreasing in each coordinate, componentwise inequality implies:

$$
h(u)\le h(v).
$$

So

$$
h(g(\bar x))\le h(\theta g(x)+(1-\theta)g(y)).
$$

That is:

$$
f(\bar x)\le h(\theta g(x)+(1-\theta)g(y)).
$$

### Step 3: use convexity of the outer function  $h$ 

Because  $h$  is convex, Jensen gives:

$$
h(\theta g(x)+(1-\theta)g(y)) \le \theta h(g(x))+(1-\theta)h(g(y)).
$$

That is:

$$
h(\theta g(x)+(1-\theta)g(y)) \le \theta f(x)+(1-\theta)f(y).
$$

### Step 4: chain the inequalities

Combine Step 2 and Step 3:

$$
f(\bar x)=h(g(\bar x)) \le h(\theta g(x)+(1-\theta)g(y)) \le \theta h(g(x))+(1-\theta)h(g(y)).
$$

So

$$
f(\theta x+(1-\theta)y)\le \theta f(x)+(1-\theta)f(y).
$$

Therefore  $f$  is convex. ✅

* * *

3) Why monotonicity is the crucial “polarity switch”
====================================================

Notice the flow:

*   Inner convexity gives:  $g(\bar x)\le \theta g(x)+(1-\theta)g(y)$ .
*   To push  $h$  through this inequality, we need  $h$  to preserve the inequality direction.
    *   If  $h$  is nondecreasing, inequality direction stays the same.
    *   If  $h$  were decreasing in some coordinate, the inequality would flip in that coordinate and the chain breaks.

So: **convex inner gives “≤”.**  
To continue, **outer must not reverse “≤”.**

That’s the whole reason monotonicity appears.

There’s also a sibling theorem:

### Variant (convex outer, nonincreasing in some coordinates)

If  $h$  is convex and **nonincreasing** in coordinate  $i$ , then you need  $g_i$  to be **concave** so that the inequality from inner step goes the other way and flips back. BV uses this constantly later (e.g., in those log-barrier-ish forms).

* * *

4) Now the five special outer functions  $h$  in Example 3.14
=============================================================

The point of the example: it gives you “standard building blocks” for  $h$ , so you can create convex/concave functions quickly.

I’ll go (i)–(v).

* * *

(i) Sum of the  $r$  largest components is convex and nondecreasing

ChatGPT-Breakdown of convexity …

-------------------------------------------------------------------------------------------------------

### Definition

Given  $z\in\mathbb R^k$ , let  $z_{[1]}\ge z_{[2]}\ge \cdots\ge z_{[k]}$  be the components sorted in **descending** order.

Define

$$
h(z) := \sum_{j=1}^r z_{[j]}.
$$

This is “sum of the top  $r$  entries.”

### Why it’s nondecreasing in each coordinate (intuitive)

If you increase any one component of  $z$ , the top  $r$  values cannot go down. At worst, that component wasn’t in the top  $r$  and becomes relevant; still can’t reduce the sum.

Formally: if  $z\le z'$  componentwise, then every coordinate increased, so every order statistic  $z_{[j]}\le z'_{[j]}$ , hence sums increase.

### Why it’s convex (key representation)

This is a classic: “sum of top  $r$ ” is the supremum of linear functionals.

One clean formula:

$$
\sum_{j=1}^r z_{[j]} = \max\left\{\sum_{i=1}^k \alpha_i z_i \;\middle|\; 0\le \alpha_i\le 1,\ \sum_{i=1}^k \alpha_i=r \right\}.
$$

Interpretation:

*    $\alpha_i$  “selects” coordinates with weights between 0 and 1.
*   To maximize, you put  $\alpha_i=1$  on the  $r$  largest coordinates and 0 elsewhere, giving exactly the top- $r$  sum.
*   The right side is a max of linear functions in  $z$ , hence convex.

### Composition consequence

If  $g_i(x)$  are convex, then

$$
x \mapsto \sum_{j=1}^r \text{(top \(r\) values among } g_1(x),\dots,g_k(x))
$$

is convex by the theorem (convex + nondecreasing outer).

**Intuition:** “take the worst  $r$  penalties and add them” is a convex “risk measure”-ish aggregation.

* * *

(ii) Log-sum-exp is convex and nondecreasing

ChatGPT-Breakdown of convexity …

--------------------------------------------------------------------------------

### Definition

$$
h(z)=\log\left(\sum_{i=1}^k e^{z_i}\right).
$$

### Why it’s nondecreasing

Each  $z_i$  appears inside an exponential, and exponential is increasing. If any  $z_i$  increases, the sum increases, log increases.

More formally: the partial derivative exists and

$$
\frac{\partial h}{\partial z_i}=\frac{e^{z_i}}{\sum_j e^{z_j}}\ge 0.
$$

### Why it’s convex (two intuitive proofs)

#### Proof A (softmax as smooth max)

A deep intuition:

$$
\max_i z_i \;\le\; \log\left(\sum_i e^{z_i}\right)\;\le\;\max_i z_i+\log k.
$$

So  $h$  is a smooth approximation to  $\max z_i$ , and  $\max$  is convex. Smooth approximation keeps convexity.

#### Proof B (Hessian is PSD)

The gradient is the softmax vector  $p$ , with  $p_i\ge 0$ ,  $\sum p_i=1$ .  
The Hessian is

$$
\nabla^2 h(z)=\mathrm{Diag}(p)-pp^\top,
$$

which is a covariance matrix of a categorical distribution, hence PSD.

### Composition consequence

If each  $g_i$  is convex, then

$$
x\mapsto \log\Big(\sum_{i=1}^k e^{g_i(x)}\Big)
$$

is convex.

**Intuition:** This is a convex way to “aggregate penalties” that behaves like a “soft max” — it emphasizes the largest terms but is smoother than max.

* * *

(iii) Power mean with  $0<p\le 1$ : concave on  $\mathbb R_+^k$ 

ChatGPT-Breakdown of convexity …

----------------------------------------------------------------------------------------------------

### Definition

$$
h(z)=\left(\sum_{i=1}^k z_i^p\right)^{1/p},\quad z\in\mathbb R_+^k,\quad 0<p\le 1.
$$

This is essentially an  $\ell_p$ \-type aggregate (but for  $p<1$  it’s not a norm; it becomes “concave-ish” on the positive orthant).

### Why concavity is plausible

For  $0<p<1$ , the map  $t\mapsto t^p$  is concave on  $t\ge 0$ . Concave functions “prefer mixing”:  $(\theta a+(1-\theta)b)^p \ge \theta a^p+(1-\theta)b^p$ .

Then you sum concave things → concave. Then  $(\cdot)^{1/p}$  with  $1/p\ge 1$  is increasing and convex, so you must be careful: it’s not “concave after concave” automatically. The actual result is a known theorem: these power means are concave for  $p\in(0,1]$  on  $\mathbb R_+^k$ .

### Composition consequence (concave version)

If  $g_i(x)$  are **concave and nonnegative**, then  $h(g(x))$  is concave (because  $h$  is concave and nondecreasing on  $\mathbb R_+^k$ ).

**Intuition:** for  $p<1$ , the aggregation gives “diminishing returns,” a hallmark of concavity.

* * *

(iv) Power mean with  $p\ge 1$ : convex (with nonnegativity)

ChatGPT-Breakdown of convexity …

------------------------------------------------------------------------------------------------

### Definition

Same formula:

$$
h(z)=\left(\sum_{i=1}^k z_i^p\right)^{1/p},
$$

but now  $p\ge 1$ .

On  $\mathbb R_+^k$ , this is the usual  $\ell_p$  norm (restricted to nonnegative vectors). Norms are convex.

So  $h$  is convex and nondecreasing on  $\mathbb R_+^k$ .

### Composition consequence

If each  $g_i$  is convex and **nonnegative**, then

$$
x\mapsto \left(\sum_{i=1}^k g_i(x)^p\right)^{1/p}
$$

is convex.

**Why the “nonnegative” caveat?**  
Because for real inputs,  $z_i^p$  is problematic for non-integer  $p$ , and monotonicity of  $t\mapsto t^p$  is easiest on  $t\ge 0$ . BV often handles this by replacing  $g_i$  with  $(g_i)_+ := \max\{g_i,0\}$  (the “positive-part trick”), which is convex and ensures nonnegativity.

**Intuition:** for  $p\ge 1$ , this is a convex way to combine magnitudes, like “Euclidean length” generalizations.

* * *

(v) Geometric mean is concave on  $\mathbb R_+^k$ 

ChatGPT-Breakdown of convexity …

--------------------------------------------------------------------------------------

### Definition

$$
h(z)=\left(\prod_{i=1}^k z_i\right)^{1/k},\quad z\in\mathbb R_+^k.
$$

### Why concave (cleanest intuition)

Take logs:

$$
\log h(z) = \frac{1}{k}\sum_{i=1}^k \log z_i.
$$
*    $\log z_i$  is concave.
*   Sum of concave functions is concave.
*   Scaling preserves concavity.

So  $\log h$  is concave. That means  $h$  is **log-concave**. But we actually want **concavity** of  $h$ . For geometric mean, it’s a stronger fact: it is concave on  $\mathbb R_+^k$  (classic inequality: AM ≥ GM implies concavity structure).

### Composition consequence (concave version)

If  $g_i(x)$  are concave and positive, then

$$
x\mapsto \left(\prod_{i=1}^k g_i(x)\right)^{1/k}
$$

is concave.

**Intuition:** geometric mean is a “fair” aggregation that punishes imbalance; concavity reflects diminishing returns.

* * *

5) The “composition checklist” you should literally run every time
==================================================================

Given  $f(x)=h(g_1(x),\dots,g_k(x))$ :

### Step A: Determine curvature of inner functions

Each  $g_i$  is convex or concave?

### Step B: Determine curvature of outer function

Is  $h$  convex or concave on the relevant domain?

### Step C: Determine monotonicity coordinate-by-coordinate

For each coordinate  $i$ , is  $h$  increasing or decreasing in  $z_i$ ?

### Step D: Match signs

*   If  $h$  is **convex** and **nondecreasing** in  $z_i$ , you need  $g_i$  **convex**.
*   If  $h$  is **convex** and **nonincreasing** in  $z_i$ , you need  $g_i$  **concave**.
*   If  $h$  is **concave** and **nondecreasing** in  $z_i$ , you need  $g_i$  **concave**.
*   If  $h$  is **concave** and **nonincreasing** in  $z_i$ , you need  $g_i$  **convex**.

Monotonicity tells you whether inequalities flip.

* * *

6) Why BV gives you (i)–(v): they are “standard aggregators”
============================================================

Each one corresponds to a common modeling choice:

*   (i) Sum of top  $r$ : robust / “pay attention to worst offenders.”
*   (ii) Log-sum-exp: smooth max; appears in statistics, ML, entropy, log-partition functions.
*   (iii)  $p\in(0,1]$ : concave “diminishing returns” aggregation (economics utility vibes).
*   (iv)  $p\ge 1$ : convex magnitude aggregation (norm-like).
*   (v) Geometric mean: multiplicative aggregation, fairness, proportional growth.

They’re like LEGO bricks: once you know their curvature + monotonicity, you can generate lots of convex/concave functions instantly.

* * *

If you want the truly masochistic next layer: I can **prove** convexity/concavity for each  $h$  (i)–(v) in full detail (especially (i), (ii), (v)), and then show 2–3 real examples where you plug in  $g_i(x)$  (norms, affine functions, exponentials) to build new convex objectives.

## Prompt:
![Uploaded image](https://chatgpt.com/backend-api/estuary/content?id=file_00000000969472439ea8b559a981bf15&ts=490522&p=fs&cid=1&sig=ee23778c2a4ac1f68ac6f694671a192182f4447f7773df7e7bf9b0523372acac&v=0)

Unpack this.

## Response:
Good. Now we will **unpack exactly what’s written there**, line by line, with **no shortcuts**, and I’ll constantly tell you _why_ each property is true and _why BV made that move_. Think of this as “reverse-engineering the author’s brain”.

I’ll follow the bullets **in the exact order of the screenshot**, but I’ll expand every hidden step.

* * *

Example 3.14 — Vector composition examples
==========================================

_(What this example is really about)_

BV is not trying to prove one theorem here.  
They are **training your pattern recognition**.

The pattern is:

> Build complicated convex/concave functions by  
> **(i)** stacking scalar functions into a vector  
> **(ii)** applying a carefully chosen outer aggregator  $h$ 

Each bullet is:

*   “Here is a useful outer function  $h$ ”
*   “Here is its curvature + monotonicity”
*   “Therefore, when you plug in convex/concave  $g_i$ , the result behaves nicely”

So the _only_ things you must check each time are:

1.  Is  $h$  convex or concave?
2.  Is  $h$  nondecreasing in each argument?
3.  Are the  $g_i$  convex or concave?
4.  Is the domain consistent (e.g. nonnegativity)?

* * *

Bullet 1
--------

### **Sum of the  $r$  largest components**

> Let  $h(z) = z_{[1]} + \cdots + z_{[r]}$ , the sum of the  $r$  largest components of  $z \in \mathbb{R}^k$ .  
> Then  $h$  is convex and nondecreasing in each argument.

### Step 1: What does  $z_{[i]}$  mean?

Given a vector  $z = (z_1,\dots,z_k)$ , reorder its components:

$$
z_{[1]} \ge z_{[2]} \ge \cdots \ge z_{[k]}.
$$

So:

*    $z_{[1]}$  = largest entry
*    $z_{[2]}$  = second largest
*   …
*    $z_{[r]}$  =  $r$ \-th largest

Then  $h(z)$  adds the **top  $r$ ** values.

* * *

### Step 2: Why is this **nondecreasing in each argument**?

Take any coordinate  $z_i$ .

If you increase  $z_i$ :

*   Either it was already in the top  $r$  → the sum increases.
*   Or it wasn’t, but might enter the top  $r$  → the sum increases or stays the same.

**It can never decrease the sum.**

Formally:  
If  $z \le z'$  componentwise, then after sorting,

$$
z_{[j]} \le z'_{[j]} \quad \forall j
$$

so

$$
h(z) \le h(z').
$$

* * *

### Step 3: Why is this **convex**?

This is the key hidden fact BV assumes you know:

$$
\boxed{ \sum_{j=1}^r z_{[j]} = \max \left\{ \sum_{i=1}^k \alpha_i z_i \;\middle|\; 0 \le \alpha_i \le 1,\; \sum_{i=1}^k \alpha_i = r \right\} }
$$

**Interpretation**:

*    $\alpha_i$  “selects” components
*   To maximize the weighted sum, you put weight 1 on the largest  $r$  components
*   This is a **maximum of linear functions in  $z$ **

Maximum of linear functions ⇒ convex.

* * *

### Step 4: Why does the composition become convex?

Now assume  $g_1,\dots,g_k$  are convex functions of  $x$ .

Define

$$
f(x) = h(g_1(x),\dots,g_k(x))
$$

This is literally:

> “Take the top  $r$  largest values among  $g_i(x)$  and add them.”

Because:

*   each  $g_i$  is convex
*    $h$  is convex
*    $h$  is nondecreasing

⇒ **composition theorem applies**

So  $f$  is convex.

* * *

### Intuition

This models:

*   “worst-case  $r$  penalties”
*   “top  $r$  losses”
*   “robust aggregation”

Convexity matches intuition: averaging inputs can’t make worst-case penalties worse than averaging penalties.

* * *

Bullet 2
--------

### **Log-sum-exp**

> The function  $h(z)=\log\left(\sum_{i=1}^k e^{z_i}\right)$  is convex and nondecreasing in each argument.

* * *

### Step 1: Why nondecreasing?

Fix all  $z_j$  except  $z_i$ .

If  $z_i$  increases:

*    $e^{z_i}$  increases
*   the sum increases
*   log of sum increases

Formally:

$$
\frac{\partial h}{\partial z_i} = \frac{e^{z_i}}{\sum_j e^{z_j}} \ge 0
$$

* * *

### Step 2: Why convex?

Two equivalent ways (BV expects you to know both):

#### Way A: Hessian (analytic)

The Hessian is:

$$
\nabla^2 h = \mathrm{diag}(p) - pp^\top, \quad p_i = \frac{e^{z_i}}{\sum_j e^{z_j}}
$$

This is a covariance matrix ⇒ PSD ⇒ convex.

#### Way B: “Soft max” intuition (important)

$$
\max_i z_i \;\le\; \log\left(\sum_i e^{z_i}\right) \;\le\; \max_i z_i + \log k
$$

So log-sum-exp is a **smooth approximation of max**.  
Max is convex ⇒ smoothing preserves convexity.

* * *

### Step 3: Composition

If each  $g_i$  is convex,

$$
f(x)=\log\left(\sum_{i=1}^k e^{g_i(x)}\right)
$$

is convex.

This function appears **everywhere**:

*   log-likelihoods
*   partition functions
*   softmax losses
*   entropy duals

* * *

Bullet 3
--------

### **Power aggregation for  $0<p\le1$ ** (concave case)

> For  $0<p\le1$ ,  
>  $h(z) = \left(\sum_{i=1}^k z_i^p\right)^{1/p}$  on  $\mathbb{R}_+^k$  is concave.

* * *

### Step 1: Why restrict to  $\mathbb{R}_+^k$ ?

Because:

*    $z^p$  for  $0<p<1$  is only real-valued and well-behaved for  $z \ge 0$ 
*   monotonicity also holds only on  $\mathbb{R}_+$ 

* * *

### Step 2: Why concave?

Key facts:

*    $t \mapsto t^p$  is **concave** on  $t \ge 0$  when  $0<p\le1$ 
*   sum of concave functions is concave
*   the outer power  $1/p \ge 1$  preserves concavity here (nontrivial theorem: power means)

This function is a **concave power mean**.

* * *

### Step 3: Why nondecreasing?

Each coordinate appears as  $z_i^p$ , which is increasing on  $\mathbb{R}_+$ .

* * *

### Step 4: Composition

If:

*   each  $g_i$  is **concave**
*   each  $g_i \ge 0$ 

Then:

$$
f(x)=\left(\sum_{i=1}^k g_i(x)^p\right)^{1/p}
$$

is concave.

* * *

### Intuition

This is a **diminishing returns** aggregator:

*   spreading mass increases value
*   encourages balance
*   classic in economics (utility aggregation)

* * *

Bullet 4
--------

### **Power aggregation for  $p \ge 1$ ** (convex case)

> Suppose  $p\ge1$  and  $g_i$  are convex and nonnegative.  
> Then  $\left(\sum g_i(x)^p\right)^{1/p}$  is convex.

This is more subtle — BV pauses to explain it.

* * *

### Step 1: Why not directly apply the composition theorem?

Problem:

*    $z \mapsto z^p$  is **convex**, but
*   composition  $g_i(x)^p$  is **not guaranteed convex** unless  $g_i \ge 0$ 

Hence the nonnegativity requirement.

* * *

### Step 2: BV’s trick — extend the function

They define:

$$
h(z) = \left(\sum_{i=1}^k \max\{z_i,0\}^p\right)^{1/p}
$$

Why?

*    $z \mapsto \max\{z,0\}$  is convex
*   raising to power  $p \ge 1$  preserves convexity on  $\mathbb{R}_+$ 
*   sum preserves convexity
*   outer  $1/p$  keeps convexity (this is the  $\ell_p$ \-norm structure)

So  $h$  is:

*   convex
*   nondecreasing
*   defined on all  $\mathbb{R}^k$ 

* * *

### Step 3: Apply composition

Now:

$$
f(x)=h(g_1(x),\dots,g_k(x))
$$

is convex since:

*   each  $g_i$  is convex
*    $h$  is convex and nondecreasing

Finally, since  $g_i(x)\ge0$ , the max disappears:

$$
h(g(x))=\left(\sum g_i(x)^p\right)^{1/p}
$$

* * *

### Intuition

This is:

*   Euclidean norm ( $p=2$ )
*   max norm ( $p\to\infty$ )
*   convex magnitude aggregation

BV uses the extension trick to **force monotonicity globally**.

* * *

Bullet 5
--------

### **Geometric mean**

>  $h(z) = (\prod_{i=1}^k z_i)^{1/k}$  on  $\mathbb{R}_+^k$  is concave.

* * *

### Step 1: Why concave?

Take logs:

$$
\log h(z) = \frac{1}{k}\sum_{i=1}^k \log z_i
$$

Each  $\log z_i$  is concave ⇒ sum concave ⇒ average concave.

Thus  $h$  is **log-concave**, and in this special case also concave.

* * *

### Step 2: Why nondecreasing?

If any  $z_i$  increases, the product increases.

* * *

### Step 3: Composition

If each  $g_i(x)$  is concave and nonnegative, then:

$$
f(x)=\left(\prod_{i=1}^k g_i(x)\right)^{1/k}
$$

is concave.

* * *

### Intuition

Geometric mean:

*   rewards proportional growth
*   penalizes imbalance
*   fundamental in economics, information theory, inequality measures

* * *

Final mental model (this is the takeaway)
-----------------------------------------

Example 3.14 is teaching you **how to manufacture curvature**.

Each bullet answers:

> “If I want to combine many scalar functions into one objective, what outer function keeps convexity or concavity intact?”

Once you internalize:

*   curvature of  $h$ 
*   monotonicity of  $h$ 
*   curvature of  $g_i$ 

you can **build objectives mechanically** without re-proving convexity every time.

If you want next:

*   we can **prove each  $h$ ’s convexity/concavity rigorously**
*   or jump to **Example 3.17 (partial minimization)** which is a completely different but equally important pattern.

## Prompt:
Example 3.20

## Response:
Example 3.20 (BV): Perspective + affine composition preserves convexity
-----------------------------------------------------------------------

### What the example states (verbatim structure)

Let  $f:\mathbb R^m\to\mathbb R\cup\{+\infty\}$  be convex. Define its **perspective**

$$
g(z,t)=t\,f(z/t)\quad \text{for }t>0.
$$

Let  $z(x)=Ax+b$  and  $t(x)=c^\top x+d$  be affine functions, and define

$$
h(x)=t(x)\,f\!\left(\frac{z(x)}{t(x)}\right).
$$

Claim:  $h$  is convex on the domain  $\{x\mid t(x)>0\}$ .

ChatGPT-Breakdown of convexity …

This is a _super important pattern_: it’s how you prove convexity of “fractional-looking” expressions like quadratic-over-linear, norm-over-linear, etc.

* * *

0) First principles: what “perspective” is doing geometrically
==============================================================

Think of  $f$  as a function on  $\mathbb R^m$ . Its epigraph is

$$
\mathrm{epi}\,f=\{(u,s)\in\mathbb R^m\times\mathbb R\mid s\ge f(u)\},
$$

a convex set when  $f$  is convex.

Now the perspective introduces a new scalar  $t>0$  and forms  $(z/t,\, s/t)$ \-type ratios. Intuitively, it’s a way to turn “ $u$ ” into “ $z/t$ ” and scale the function value by  $t$ . This is exactly the right transformation to preserve epigraph convexity when you move to a higher-dimensional space  $(z,t)$ .

A key mental picture:

*   Points  $(u,s)$  in  $\mathrm{epi}\,f$  become points  $(z,t,s)$  with
    $$
    u=\frac{z}{t},\qquad s = t\cdot(\text{something}).
    $$
*   So the perspective “cones” the epigraph: it creates the **conic hull** of  $\mathrm{epi}\,f$  (more on that below).

* * *

1) Step 1: Prove the perspective  $g(z,t)=t f(z/t)$  is convex (on  $t>0$ )
===========================================================================

There are two clean proofs. I’ll give both because each teaches a different instinct.

Proof A (epigraph geometry: the cleanest BV-style proof)
--------------------------------------------------------

### Claim

$$
g(z,t)=t f(z/t)\ \text{is convex on }\{(z,t)\mid t>0\}.
$$

### Key move: characterize  $\mathrm{epi}\,g$ 

By definition,

$$
(z,t,s)\in \mathrm{epi}\,g \quad\Longleftrightarrow\quad s\ge g(z,t)=t f(z/t),\ \ t>0.
$$

Divide both sides by  $t>0$ :

$$
\frac{s}{t}\ge f\!\left(\frac{z}{t}\right).
$$

That is exactly:

$$
\left(\frac{z}{t},\frac{s}{t}\right)\in \mathrm{epi}\,f.
$$

So we can rewrite:

$$
\boxed{ \mathrm{epi}\,g = \left\{(z,t,s)\ \middle|\ t>0,\ \left(\frac{z}{t},\frac{s}{t}\right)\in \mathrm{epi}\,f\right\}. }
$$

Now make a substitution:  
Let  $(u,r)=(z/t,\ s/t)$ . Then  $z=tu$ ,  $s=tr$ , with  $t>0$ . Therefore

$$
\mathrm{epi}\,g = \left\{(tu,\ t,\ tr)\mid t>0,\ (u,r)\in \mathrm{epi}\,f\right\}.
$$

### Interpret that set

It’s the set of all **positive scalings** of points  $(u,1,r)$  where  $(u,r)\in \mathrm{epi}f$ . That is a conic construction.

### Why is  $\mathrm{epi}\,g$  convex?

Take two points in  $\mathrm{epi}\,g$ :

$$
(z_1,t_1,s_1)=(t_1u_1,\ t_1,\ t_1r_1),\quad (u_1,r_1)\in \mathrm{epi}\,f
$$
 
$$
(z_2,t_2,s_2)=(t_2u_2,\ t_2,\ t_2r_2),\quad (u_2,r_2)\in \mathrm{epi}\,f
$$

with  $t_1,t_2>0$ .

Consider their convex combination with  $\theta\in[0,1]$ :

$$
(z,t,s)=\theta(z_1,t_1,s_1)+(1-\theta)(z_2,t_2,s_2).
$$

So

$$
t=\theta t_1+(1-\theta)t_2>0,
$$

and

$$
z=\theta t_1u_1+(1-\theta)t_2u_2,\qquad s=\theta t_1r_1+(1-\theta)t_2r_2.
$$

Now define weights

$$
\alpha=\frac{\theta t_1}{t},\qquad \beta=\frac{(1-\theta)t_2}{t}.
$$

Check:

*    $\alpha,\beta\ge 0$  because everything is nonnegative,
*    $\alpha+\beta=1$  because
    $$
    \alpha+\beta=\frac{\theta t_1+(1-\theta)t_2}{t}=\frac{t}{t}=1.
    $$

Then rewrite:

$$
\frac{z}{t}=\alpha u_1+\beta u_2,\qquad \frac{s}{t}=\alpha r_1+\beta r_2.
$$

Since  $(u_1,r_1)$  and  $(u_2,r_2)$  lie in  $\mathrm{epi}\,f$ , and  $\mathrm{epi}\,f$  is convex (because  $f$  is convex), the convex combination

$$
\left(\frac{z}{t},\frac{s}{t}\right)=\alpha(u_1,r_1)+\beta(u_2,r_2)
$$

also lies in  $\mathrm{epi}\,f$ . Therefore  $(z,t,s)\in \mathrm{epi}\,g$ .

So  $\mathrm{epi}\,g$  is convex, hence  $g$  is convex. ✅

* * *

Proof B (algebraic Jensen proof: same idea, different outfit)
-------------------------------------------------------------

Take  $(z_1,t_1)$ ,  $(z_2,t_2)$  with  $t_1,t_2>0$ . Let

$$
(z,t)=\theta(z_1,t_1)+(1-\theta)(z_2,t_2),\quad t>0.
$$

We want:

$$
g(z,t)\le \theta g(z_1,t_1)+(1-\theta)g(z_2,t_2).
$$

Compute

$$
g(z,t)=t f(z/t).
$$

Now note

$$
\frac{z}{t}=\frac{\theta z_1+(1-\theta)z_2}{\theta t_1+(1-\theta)t_2} =\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2},
$$

with  $\alpha=\frac{\theta t_1}{t}$ ,  $\beta=\frac{(1-\theta)t_2}{t}$ , same as before.

By convexity of  $f$ ,

$$
f(z/t)\le \alpha f(z_1/t_1)+\beta f(z_2/t_2).
$$

Multiply both sides by  $t$ :

$$
t f(z/t)\le t\alpha f(z_1/t_1)+t\beta f(z_2/t_2) =\theta t_1 f(z_1/t_1)+(1-\theta)t_2 f(z_2/t_2).
$$

That is

$$
g(z,t)\le \theta g(z_1,t_1)+(1-\theta)g(z_2,t_2).
$$

So  $g$  is convex. ✅

**The only “trick”** is those weights  $\alpha,\beta$ . They’re the heart of perspective proofs.

* * *

2) Step 2: Affine composition preserves convexity
=================================================

Now define

$$
z(x)=Ax+b,\qquad t(x)=c^\top x+d.
$$

Affine maps are of the form  $Mx+q$ . A key fact:

> If  $g$  is convex, then  $x\mapsto g(Mx+q)$  is convex.

That’s because convexity inequality survives under affine substitution (you can check directly).

So if we already know  $g(z,t)$  is convex in  $(z,t)$ , then

$$
h(x)=g(z(x),t(x)) = g(Ax+b,\ c^\top x+d)
$$

is convex on the set where it’s defined, i.e. where  $t(x)>0$ .

This proves Example 3.20. ✅

* * *

3) Why the domain is exactly  $\{x\mid t(x)>0\}$ 
=================================================

Because  $g(z,t)$  uses  $z/t$ . Division by  $t$  forces  $t>0$ .

BV often extends the definition to  $t=0$  or  $t<0$  using  $+\infty$  to keep convexity in extended-value sense, but the “clean” domain for finite values is  $t>0$ . In your statement, they explicitly restrict to  $\{x\mid t(x)>0\}$ .

ChatGPT-Breakdown of convexity …

* * *

4) Intuitions you should actually keep
======================================

Intuition 1: “Perspective = conic hull of the epigraph”
-------------------------------------------------------

From the epigraph identity,

$$
(z,t,s)\in \mathrm{epi}\,g \iff t>0,\ (z/t,\ s/t)\in\mathrm{epi}\,f.
$$

So  $\mathrm{epi}\,g$  is (essentially) the set of positive scalings of points in  $\mathrm{epi}\,f$ . That is exactly how you make a **cone** from a set: take all positive scalings.

So: _perspective convexity_ is really _cone convexity_.

Intuition 2: Why this proves “fractional” functions are convex
--------------------------------------------------------------

Many scary expressions look like:

$$
\text{(something convex)}\ /\ \text{(something positive affine)}.
$$

Those are perspectives.

Classic one (you will see immediately in Exercise 3.23(b)):

$$
\frac{\|Ax+b\|_2^2}{c^\top x+d}
$$

is the perspective of  $f(u)=\|u\|_2^2$  with  $z=Ax+b$ ,  $t=c^\top x+d$ , because

$$
t f(z/t) = (c^\top x+d)\left\|\frac{Ax+b}{c^\top x+d}\right\|_2^2 = \frac{\|Ax+b\|_2^2}{c^\top x+d}.
$$

So Example 3.20 is the “factory machine” behind those results.

Intuition 3: The weight trick is “renormalized convex combination”
------------------------------------------------------------------

In both proofs, we needed to rewrite

$$
\frac{\theta z_1+(1-\theta)z_2}{\theta t_1+(1-\theta)t_2}
$$

as a convex combination of  $z_1/t_1$  and  $z_2/t_2$ . The weights become  $\alpha=\theta t_1/t$ ,  $\beta=(1-\theta)t_2/t$ . This is why perspective works: it turns linear mixing in  $(z,t)$  into **convex mixing** in the ratios  $(z/t)$ .

* * *

5) Practical checklist for using Example 3.20 (so you don’t get trapped)
========================================================================

When you see  $h(x)=t(x)\,f(z(x)/t(x))$ , do:

1.  Verify  $f$  is convex.
2.  Ensure the domain includes  $t(x)>0$  (and note it’s a convex domain if  $t$  is affine: it’s a halfspace).
3.  Recognize  $h=g\circ (z,t)$  where  $g$  is perspective of  $f$ .
4.  Conclude  $h$  convex.

That’s it. It’s a very “industrial” theorem.

* * *

If you want the next natural step, it’s **Exercise 3.23**, which is basically “use Example 3.20 twice” to prove two key convex fractional forms.

## Prompt:
Whats the general theorem used in 3.14?

## Response:
Good question — and this is one of those places where BV **uses a theorem without naming it loudly**, so it’s worth extracting it cleanly and _once and for all_.

I’ll give you:

1.  the **exact general theorem** (with hypotheses spelled precisely),
2.  a **first-principles proof** (so it’s not a black box),
3.  the **sign-flip variants** (why concave/convex swap when monotonicity flips),
4.  how **every bullet in Example 3.14** is just an instantiation of it.

No handwaving.

* * *

The General Theorem Behind Example 3.14
---------------------------------------

### (Vector Composition Rule)

Let

$$
g(x) = (g_1(x),\dots,g_k(x)) : \mathbb R^n \to \mathbb R^k, \quad h:\mathbb R^k \to \mathbb R.
$$

* * *

### **Theorem (Convex Composition, Coordinatewise Form)**

Assume:

1.  **Inner functions**  
    Each  $g_i : \mathbb R^n \to \mathbb R$  is **convex**.
2.  **Outer function curvature**  
     $h$  is **convex** on  $\mathbb R^k$ .
3.  **Outer function monotonicity**  
     $h$  is **nondecreasing in each coordinate**, i.e.
    $$
    z \le z' \ (\text{componentwise}) \;\Rightarrow\; h(z) \le h(z').
    $$

Then the composition

$$
f(x) = h(g_1(x),\dots,g_k(x))
$$

is **convex**.

This is the theorem being used in **every bullet of Example 3.14**.

* * *

Proof from First Principles (No Black Boxes)
--------------------------------------------

Take arbitrary  $x,y \in \mathbb R^n$  and  $\theta \in [0,1]$ .

We must show:

$$
f(\theta x + (1-\theta)y) \;\le\; \theta f(x) + (1-\theta) f(y).
$$

* * *

### Step 1 — Use convexity of the inner functions

For each  $i$ :

$$
g_i(\theta x + (1-\theta)y) \;\le\; \theta g_i(x) + (1-\theta) g_i(y).
$$

Collect these into a vector inequality:

$$
g(\theta x + (1-\theta)y) \;\le\; \theta g(x) + (1-\theta) g(y) \quad (\text{componentwise}).
$$

* * *

### Step 2 — Use monotonicity of the outer function

Because  $h$  is **nondecreasing in each coordinate**, applying  $h$  preserves the inequality:

$$
h(g(\theta x + (1-\theta)y)) \;\le\; h(\theta g(x) + (1-\theta) g(y)).
$$

This is the **critical step**.  
Without monotonicity, the inequality could flip and the proof would die.

* * *

### Step 3 — Use convexity of the outer function

By convexity of  $h$ :

$$
h(\theta g(x) + (1-\theta) g(y)) \;\le\; \theta h(g(x)) + (1-\theta) h(g(y)).
$$

* * *

### Step 4 — Chain inequalities

$$
f(\theta x + (1-\theta)y) = h(g(\theta x + (1-\theta)y)) \le \theta h(g(x)) + (1-\theta) h(g(y)).
$$

So  $f$  is convex. ■

* * *

Why This Theorem Is Subtle (and Why Monotonicity Is Non-Negotiable)
-------------------------------------------------------------------

Notice the direction of inequalities:

*   Inner convexity gives **“≤”**
*   To pass that through  $h$ ,  $h$  must **not reverse inequalities**

This is why BV always checks _coordinatewise monotonicity_.

### Counterexample (why monotonicity matters)

Let:

*    $g(x)=x^2$  (convex)
*    $h(z)=-z$  (convex but **decreasing**)

Then:

$$
h(g(x)) = -x^2
$$

which is **concave**, not convex.

So convex ∘ convex **fails** without monotonicity.

* * *

The Other Variants (Implicitly Used Later in BV)
------------------------------------------------

The theorem has **sign-flipped siblings**.

### Variant 1 — Convex outer, nonincreasing in some coordinates

If:

*    $h$  is convex
*    $h$  is **nonincreasing** in coordinate  $i$ 

Then  $g_i$  must be **concave**, not convex, to preserve inequality direction.

* * *

### Variant 2 — Concave outer, nondecreasing

If:

*    $h$  is concave
*    $h$  is nondecreasing in each coordinate
*    $g_i$  are concave

Then  $h(g(x))$  is concave.

This is exactly what BV uses for:

*   geometric mean
*   power means with  $0<p\le1$ 

* * *

### Master Rule (memorize this)

For each coordinate  $i$ :

| Outer  $h$  | Monotonicity in  $z_i$  | Inner  $g_i$  must be |
| --- | --- | --- |
| convex | nondecreasing | convex |
| convex | nonincreasing | concave |
| concave | nondecreasing | concave |
| concave | nonincreasing | convex |

This table is the **real theorem** behind Example 3.14.

* * *

How Each Bullet of Example 3.14 Uses This Theorem
-------------------------------------------------

| Bullet | Outer  $h$  | Monotone? | Inner  $g_i$  | Result |
| --- | --- | --- | --- | --- |
| sum of top- $r$  | convex | ↑ | convex | convex |
| log-sum-exp | convex | ↑ | convex | convex |
|  $p\le1$  power mean | concave | ↑ | concave | concave |
|  $p\ge1$  power mean | convex | ↑ | convex + nonneg | convex |
| geometric mean | concave | ↑ | concave + nonneg | concave |

Nothing else is happening.

* * *

The Big Picture (Why BV cares)
------------------------------

This theorem is what lets you:

*   **build objectives mechanically**
*   avoid recomputing Hessians
*   reason about convexity structurally, not computationally

It is one of the **core abstraction layers** of convex analysis.

If you want next, the natural continuation is **Example 3.17 (partial minimization)**, which introduces a _different_ abstraction: convexity preserved under projection.

## Prompt:
Let's go back to 3.20. FOcus on Jensen version.

## Response:
Great — Example 3.20, **Jensen proof only**, but done _surgically_ and from first principles.

We want to prove:

*   If  $f:\mathbb R^m\to\mathbb R\cup\{+\infty\}$  is **convex**, then its **perspective**
    $$
    g(z,t)=t\,f(z/t)\qquad (t>0)
    $$
    is **convex** in  $(z,t)$ .
*   Then  $h(x)=g(Ax+b,\ c^\top x+d)$  is convex on  $\{x: c^\top x+d>0\}$  (affine precomposition).

You asked to focus on the **Jensen version**, i.e. prove convexity by directly checking the convexity inequality.

* * *

0) Convexity inequality we must prove
=====================================

Take any two points  $(z_1,t_1)$ ,  $(z_2,t_2)$  with  $t_1>0,t_2>0$ , and any  $\theta\in[0,1]$ .

Define the convex combination:

$$
(z,t)=\theta(z_1,t_1)+(1-\theta)(z_2,t_2) =(\theta z_1+(1-\theta)z_2,\ \theta t_1+(1-\theta)t_2).
$$

Note  $t>0$  because it’s a convex combination of positive numbers.

We must show:

$$
\boxed{ g(z,t)\le \theta g(z_1,t_1)+(1-\theta)g(z_2,t_2) }
$$

i.e.

$$
t\,f(z/t)\le \theta\,t_1 f(z_1/t_1) + (1-\theta)\,t_2 f(z_2/t_2).
$$

Everything hinges on one trick: rewrite  $z/t$  as a convex combination of  $z_1/t_1$  and  $z_2/t_2$ , but with **new weights**.

* * *

1) The key algebraic trick: “ratio of convex combos” becomes convex combo of ratios
===================================================================================

We have

$$
z=\theta z_1+(1-\theta)z_2,\qquad t=\theta t_1+(1-\theta)t_2.
$$

We want to express

$$
\frac{z}{t}
$$

in terms of  $\frac{z_1}{t_1}$  and  $\frac{z_2}{t_2}$ .

### Define new weights

Set

$$
\alpha := \frac{\theta t_1}{t},\qquad \beta := \frac{(1-\theta)t_2}{t}.
$$

#### Check they are valid convex weights

*   Nonnegativity:  $\theta\ge 0$ ,  $t_1>0$ ,  $t>0$  ⇒  $\alpha\ge 0$ . Similarly  $\beta\ge 0$ .
*   Sum to 1:
    $$
    \alpha+\beta =\frac{\theta t_1}{t}+\frac{(1-\theta)t_2}{t} =\frac{\theta t_1+(1-\theta)t_2}{t} =\frac{t}{t} =1.
    $$

So  $\alpha,\beta\in[0,1]$  and  $\alpha+\beta=1$ .

### Now rewrite  $z/t$ 

Compute:

$$
\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2} = \frac{\theta t_1}{t}\frac{z_1}{t_1} +\frac{(1-\theta)t_2}{t}\frac{z_2}{t_2} = \frac{\theta z_1+(1-\theta)z_2}{t} = \frac{z}{t}.
$$

So we have the crucial identity:

$$
\boxed{ \frac{z}{t} = \alpha\frac{z_1}{t_1} +\beta\frac{z_2}{t_2} \quad\text{where }\alpha=\frac{\theta t_1}{t},\ \beta=\frac{(1-\theta)t_2}{t}. }
$$

**Interpretation (very important):**

*   The convex combination in  $(z,t)$ \-space induces a _different_ convex combination in ratio-space.
*   The weights are proportional to “how much  $t$ \-mass” each point contributes.

This is the entire “perspective magic”.

* * *

2) Apply convexity of  $f$  (this is the Jensen step)
=====================================================

Since  $f$  is convex and  $\alpha,\beta$  are convex weights,

$$
f\!\left(\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}\right) \le \alpha f(z_1/t_1) + \beta f(z_2/t_2).
$$

But the left argument is exactly  $z/t$ . Therefore:

$$
\boxed{ f(z/t)\le \alpha f(z_1/t_1)+\beta f(z_2/t_2). }
$$

This is Jensen’s inequality applied to  $f$  at the points  $z_1/t_1$  and  $z_2/t_2$  with weights  $\alpha,\beta$ .

* * *

3) Multiply by  $t$  and simplify (this is where perspective appears)
=====================================================================

Multiply both sides by  $t>0$  (inequality direction preserved):

$$
t f(z/t) \le t\alpha f(z_1/t_1) + t\beta f(z_2/t_2).
$$

Now substitute  $t\alpha=\theta t_1$  and  $t\beta=(1-\theta)t_2$  from the definitions:

*    $t\alpha = t\cdot \frac{\theta t_1}{t} = \theta t_1$ 
*    $t\beta = t\cdot \frac{(1-\theta)t_2}{t} = (1-\theta)t_2$ 

So:

$$
t f(z/t) \le \theta t_1 f(z_1/t_1) + (1-\theta)t_2 f(z_2/t_2).
$$

Recognize  $g$ :

$$
g(z,t)=t f(z/t),\quad g(z_1,t_1)=t_1 f(z_1/t_1),\quad g(z_2,t_2)=t_2 f(z_2/t_2).
$$

Thus:

$$
\boxed{ g(z,t)\le \theta g(z_1,t_1)+(1-\theta)g(z_2,t_2). }
$$

So  $g$  is convex on  $\{(z,t)\mid t>0\}$ . ✅

That’s the full Jensen proof.

* * *

4) Why the weights  $\alpha,\beta$  are “inevitable” (intuition)
================================================================

A common confusion: “Why can’t I just use  $\theta$  and  $1-\theta$  as weights inside  $f$ ?”

Because you are not averaging the **arguments**  $z/t$  linearly in  $\theta$ . You are averaging  $(z,t)$  linearly, and the map  $(z,t)\mapsto z/t$  is nonlinear.

The correct weights must satisfy:

$$
\frac{\theta z_1+(1-\theta)z_2}{\theta t_1+(1-\theta)t_2} = \alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}.
$$

Solving for  $\alpha,\beta$  forces:

$$
\alpha\propto \theta t_1,\qquad \beta\propto (1-\theta)t_2.
$$

So they are literally “ $\theta$ ” times “how much denominator mass you have.”

* * *

5) Finish Example 3.20: affine composition step (quick but exact)
=================================================================

Now let

$$
z(x)=Ax+b,\qquad t(x)=c^\top x+d.
$$

Define

$$
h(x)=t(x)\,f\!\left(\frac{z(x)}{t(x)}\right)=g(z(x),t(x)).
$$

Since:

*    $g$  is convex in  $(z,t)$  for  $t>0$ ,
*    $(z(x),t(x))$  is an affine map of  $x$ ,

the composition  $x\mapsto g(z(x),t(x))$  is convex on the set where it’s defined:

$$
\{x\mid t(x)>0\}.
$$

(That last set is a halfspace, hence convex — also important.)

* * *

6) A tight “one-line memory” version
====================================

If  $f$  is convex, then for  $t>0$ :

$$
(z,t)\mapsto t f(z/t)
$$

is convex because

$$
\frac{\theta z_1+(1-\theta)z_2}{\theta t_1+(1-\theta)t_2} = \frac{\theta t_1}{t}\frac{z_1}{t_1} + \frac{(1-\theta)t_2}{t}\frac{z_2}{t_2},
$$

so Jensen applies to  $f$ , then you multiply by  $t$ .

* * *

If you want to cement it, the best immediate exercise is **3.23(b)** (quadratic-over-linear). It is literally “Example 3.20 with  $f(u)=\|u\|_2^2$ ”.

## Prompt:
Didn't yet understand! FOCUS on solution of 3.20

 Example 3.20, **Jensen proof only**, but done *surgically* and from first principles.

We want to prove:

* If (f:\mathbb R^m\to\mathbb R\cup{+\infty}) is **convex**, then its **perspective**
  [
  g(z,t)=t,f(z/t)\qquad (t>0)
  ]
  is **convex** in ((z,t)).
* Then (h(x)=g(Ax+b,\ c^\top x+d)) is convex on ({x: c^\top x+d>0}) (affine precomposition).

You asked to focus on the **Jensen version**, i.e. prove convexity by directly checking the convexity inequality.

---

# 0) Convexity inequality we must prove

Take any two points ((z_1,t_1)), ((z_2,t_2)) with (t_1>0,t_2>0), and any (\theta\in[0,1]).

Define the convex combination:
[
(z,t)=\theta(z_1,t_1)+(1-\theta)(z_2,t_2)
=(\theta z_1+(1-\theta)z_2,\ \theta t_1+(1-\theta)t_2).
]
Note (t>0) because it’s a convex combination of positive numbers.

We must show:
[
\boxed{
g(z,t)\le \theta g(z_1,t_1)+(1-\theta)g(z_2,t_2)
}
]
i.e.
[
t,f(z/t)\le \theta,t_1 f(z_1/t_1) + (1-\theta),t_2 f(z_2/t_2).
]

Everything hinges on one trick: rewrite (z/t) as a convex combination of (z_1/t_1) and (z_2/t_2), but with **new weights**.

---

# 1) The key algebraic trick: “ratio of convex combos” becomes convex combo of ratios

We have
[
z=\theta z_1+(1-\theta)z_2,\qquad
t=\theta t_1+(1-\theta)t_2.
]

We want to express
[
\frac{z}{t}
]
in terms of (\frac{z_1}{t_1}) and (\frac{z_2}{t_2}).

### Define new weights

Set
[
\alpha := \frac{\theta t_1}{t},\qquad
\beta := \frac{(1-\theta)t_2}{t}.
]

#### Check they are valid convex weights

* Nonnegativity: (\theta\ge 0), (t_1>0), (t>0) ⇒ (\alpha\ge 0). Similarly (\beta\ge 0).
* Sum to 1:
  [
  \alpha+\beta
  =\frac{\theta t_1}{t}+\frac{(1-\theta)t_2}{t}
  =\frac{\theta t_1+(1-\theta)t_2}{t}
  =\frac{t}{t}
  =1.
  ]

So (\alpha,\beta\in[0,1]) and (\alpha+\beta=1).

### Now rewrite (z/t)

Compute:
[
\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}
==========================================

\frac{\theta t_1}{t}\frac{z_1}{t_1}
+\frac{(1-\theta)t_2}{t}\frac{z_2}{t_2}
=======================================

# \frac{\theta z_1+(1-\theta)z_2}{t}

\frac{z}{t}.
]

So we have the crucial identity:
[
\boxed{
\frac{z}{t}
===========

\alpha\frac{z_1}{t_1}
+\beta\frac{z_2}{t_2}
\quad\text{where }\alpha=\frac{\theta t_1}{t},\ \beta=\frac{(1-\theta)t_2}{t}.
}
]

**Interpretation (very important):**

* The convex combination in ((z,t))-space induces a *different* convex combination in ratio-space.
* The weights are proportional to “how much (t)-mass” each point contributes.

This is the entire “perspective magic”.

---

# 2) Apply convexity of (f) (this is the Jensen step)

Since (f) is convex and (\alpha,\beta) are convex weights,
[
f!\left(\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}\right)
\le
\alpha f(z_1/t_1) + \beta f(z_2/t_2).
]

But the left argument is exactly (z/t). Therefore:
[
\boxed{
f(z/t)\le \alpha f(z_1/t_1)+\beta f(z_2/t_2).
}
]

This is Jensen’s inequality applied to (f) at the points (z_1/t_1) and (z_2/t_2) with weights (\alpha,\beta).

---

# 3) Multiply by (t) and simplify (this is where perspective appears)

Multiply both sides by (t>0) (inequality direction preserved):

[
t f(z/t)
\le
t\alpha f(z_1/t_1) + t\beta f(z_2/t_2).
]

Now substitute (t\alpha=\theta t_1) and (t\beta=(1-\theta)t_2) from the definitions:

* (t\alpha = t\cdot \frac{\theta t_1}{t} = \theta t_1)
* (t\beta = t\cdot \frac{(1-\theta)t_2}{t} = (1-\theta)t_2)

So:
[
t f(z/t)
\le
\theta t_1 f(z_1/t_1) + (1-\theta)t_2 f(z_2/t_2).
]

Recognize (g):
[
g(z,t)=t f(z/t),\quad g(z_1,t_1)=t_1 f(z_1/t_1),\quad g(z_2,t_2)=t_2 f(z_2/t_2).
]

Thus:
[
\boxed{
g(z,t)\le \theta g(z_1,t_1)+(1-\theta)g(z_2,t_2).
}
]

So (g) is convex on ({(z,t)\mid t>0}). ✅

That’s the full Jensen proof.

---

# 4) Why the weights (\alpha,\beta) are “inevitable” (intuition)

A common confusion: “Why can’t I just use (\theta) and (1-\theta) as weights inside (f)?”

Because you are not averaging the **arguments** (z/t) linearly in (\theta). You are averaging ((z,t)) linearly, and the map ((z,t)\mapsto z/t) is nonlinear.

The correct weights must satisfy:
[
\frac{\theta z_1+(1-\theta)z_2}{\theta t_1+(1-\theta)t_2}
= \alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}.
]
Solving for (\alpha,\beta) forces:
[
\alpha\propto \theta t_1,\qquad \beta\propto (1-\theta)t_2.
]
So they are literally “(\theta)” times “how much denominator mass you have.”

---

# 5) Finish Example 3.20: affine composition step (quick but exact)

Now let
[
z(x)=Ax+b,\qquad t(x)=c^\top x+d.
]
Define
[
h(x)=t(x),f!\left(\frac{z(x)}{t(x)}\right)=g(z(x),t(x)).
]

Since:

* (g) is convex in ((z,t)) for (t>0),
* ((z(x),t(x))) is an affine map of (x),

the composition (x\mapsto g(z(x),t(x))) is convex on the set where it’s defined:
[
{x\mid t(x)>0}.
]

(That last set is a halfspace, hence convex — also important.)

---

# 6) A tight “one-line memory” version

If (f) is convex, then for (t>0):
[
(z,t)\mapsto t f(z/t)
]
is convex because
[
\frac{\theta z_1+(1-\theta)z_2}{\theta t_1+(1-\theta)t_2}
=========================================================

\frac{\theta t_1}{t}\frac{z_1}{t_1}
+
\frac{(1-\theta)t_2}{t}\frac{z_2}{t_2},
]
so Jensen applies to (f), then you multiply by (t).

---

If you want to cement it, the best immediate exercise is **3.23(b)** (quadratic-over-linear). It is literally “Example 3.20 with (f(u)=|u|_2^2)”.

3/3

## Response:
Let’s now walk **surgically and from first principles** through the **Jensen-style proof** of **Example 3.20** in Boyd & Vandenberghe, focusing entirely on what’s happening in each step — algebraically, geometrically, and logically.

* * *

🚧 Goal: Prove Convexity of the Perspective Function
----------------------------------------------------

Let:

*    $f: \mathbb{R}^m \to \mathbb{R} \cup \{+\infty\}$  be **convex**.
*   Define its **perspective**:
    $$
    g(z, t) = t f(z/t),\quad \text{defined on } \{(z, t) \in \mathbb{R}^m \times \mathbb{R}_{++}\}.
    $$

We want to **prove that  $g(z,t)$  is convex** on its domain.

This will be done directly via the **definition of convexity** — i.e., via the **Jensen inequality** style, not epi-characterizations or second-order conditions.

* * *

### Step 0: Convexity Inequality We Need to Prove

By the definition of convexity, we must show that for all:

*    $(z_1, t_1), (z_2, t_2) \in \mathbb{R}^m \times \mathbb{R}_{++}$ ,
*   and all  $\theta \in [0,1]$ ,

the following inequality holds:

$$
g(\theta z_1 + (1 - \theta) z_2, \ \theta t_1 + (1 - \theta) t_2) \leq \theta g(z_1, t_1) + (1 - \theta) g(z_2, t_2).
$$

Unpacking both sides:

$$
\boxed{ \left[ \theta t_1 + (1 - \theta) t_2 \right] \cdot f\left( \frac{ \theta z_1 + (1 - \theta) z_2 }{ \theta t_1 + (1 - \theta) t_2 } \right) \leq \theta t_1 f(z_1 / t_1) + (1 - \theta) t_2 f(z_2 / t_2). }
$$

This is the central inequality to prove.

Let’s denote:

*    $t = \theta t_1 + (1 - \theta) t_2$  (still positive),
*    $z = \theta z_1 + (1 - \theta) z_2$ ,
*   So:  $\frac{z}{t} = \frac{ \theta z_1 + (1 - \theta) z_2 }{ \theta t_1 + (1 - \theta) t_2 }$ .

Now, we want to relate  $z/t$  to a convex combination of  $z_1 / t_1$  and  $z_2 / t_2$ , to use the convexity of  $f$ .

* * *

Step 1: Rewriting the Ratio  $\frac{z}{t}$ 
-------------------------------------------

We define weights  $\alpha, \beta \in [0,1]$  as follows:

$$
\alpha = \frac{ \theta t_1 }{ t }, \qquad \beta = \frac{ (1 - \theta) t_2 }{ t }.
$$

🧠 **Why these weights?** Because they add up to 1:

$$
\alpha + \beta = \frac{ \theta t_1 + (1 - \theta) t_2 }{ t } = \frac{ t }{ t } = 1.
$$

And:

$$
\alpha \ge 0, \quad \beta \ge 0 \quad \text{since } \theta \in [0,1],\ t_1, t_2 > 0,\ t > 0.
$$

Now we can express:

$$
\frac{z}{t} = \frac{ \theta z_1 + (1 - \theta) z_2 }{ t } = \alpha \cdot \frac{z_1}{t_1} + \beta \cdot \frac{z_2}{t_2}.
$$

🧠 **Geometric interpretation:**

*   You’re combining two “points in spacetime”  $(z_1, t_1)$  and  $(z_2, t_2)$ ,
*   But because division is nonlinear, you must adjust the **weights** when moving from spacetime to the “normalized space”  $z/t$ .
*   The weights become proportional to **how much t-mass** you contribute to the average  $t$ .

* * *

Step 2: Jensen’s Inequality (Convexity of  $f$ )
------------------------------------------------

Now since:

*    $f$  is convex on  $\mathbb{R}^m$ ,
*   and  $\frac{z}{t} = \alpha \cdot \frac{z_1}{t_1} + \beta \cdot \frac{z_2}{t_2}$ ,
*   with  $\alpha, \beta \in [0,1]$ ,  $\alpha + \beta = 1$ ,

we can directly apply Jensen’s inequality:

$$
f\left( \frac{z}{t} \right) = f\left( \alpha \frac{z_1}{t_1} + \beta \frac{z_2}{t_2} \right) \le \alpha f\left( \frac{z_1}{t_1} \right) + \beta f\left( \frac{z_2}{t_2} \right).
$$

* * *

Step 3: Multiply Both Sides by  $t > 0$ 
----------------------------------------

Multiply both sides by  $t$ , which is strictly positive, so the inequality direction is preserved:

$$
t f\left( \frac{z}{t} \right) \le t \alpha f\left( \frac{z_1}{t_1} \right) + t \beta f\left( \frac{z_2}{t_2} \right).
$$

But recall:

$$
t \alpha = \theta t_1, \qquad t \beta = (1 - \theta) t_2.
$$

Hence:

$$
t f(z / t) \le \theta t_1 f(z_1 / t_1) + (1 - \theta) t_2 f(z_2 / t_2).
$$

And this is:

$$
g(z, t) \le \theta g(z_1, t_1) + (1 - \theta) g(z_2, t_2).
$$

🚀 **Q.E.D.** —  $g$  is convex on its domain  $\{(z,t) \mid t > 0\}$ .

* * *

🧠 Intuition: Why the “α and β” Trick is Necessary
--------------------------------------------------

Let’s emphasize this point: **you cannot just apply  $f$  to the convex combination of  $z_1 / t_1$  and  $z_2 / t_2$  with weights  $\theta, 1 - \theta$ **.

The function  $(z,t) \mapsto z / t$  is **not linear**.

So:

$$
\frac{ \theta z_1 + (1 - \theta) z_2 }{ \theta t_1 + (1 - \theta) t_2 } \ne \theta \cdot \frac{z_1}{t_1} + (1 - \theta) \cdot \frac{z_2}{t_2}.
$$

Instead, you derive new weights  $\alpha = \frac{ \theta t_1 }{t}$ , etc., so that:

$$
\frac{z}{t} = \alpha \cdot \frac{z_1}{t_1} + \beta \cdot \frac{z_2}{t_2},
$$

and this unlocks Jensen’s inequality.

* * *

Step 4: Affine Composition — The Final Wrap-Up
----------------------------------------------

We’re often interested in a composite form:

$$
h(x) = g(z(x), t(x)) = t(x) f\left( \frac{z(x)}{t(x)} \right),
$$

where:

*    $z(x) = A x + b$ ,
*    $t(x) = c^\top x + d$ .

Because:

*    $g$  is convex on its domain,
*    $z(x), t(x)$  are affine functions of  $x$ ,
*   and domain restriction  $\{ x \mid t(x) > 0 \}$  is convex (half-space),

we conclude:

$$
h(x) = t(x) f(z(x)/t(x)) \quad \text{is convex on } \{ x \mid c^\top x + d > 0 \}.
$$

This wraps up **Example 3.20 Jensen-style proof** in maximal granularity.

* * *

✅ Final Summary (Memory Version)
--------------------------------

**Perspective is convex because:**

1.  You average  $(z,t)$  linearly (with  $\theta$ ),
2.  That induces **new weights**  $\alpha, \beta$  in the ratio  $z/t$ ,
3.  Jensen applies to  $f$ ,
4.  Multiply back by  $t$ ,
5.  You get the desired convexity of  $g(z,t) = t f(z/t)$ .

* * *

Let me know if you want:

*   **An interactive diagram** to visualize the perspective map,
*   A breakdown of **why this matters for modeling (e.g. quadratic-over-linear, entropy)**,
*   Or follow-up on **epigraph-based proofs or second-order conditions**.

## Prompt:
![Uploaded image](https://chatgpt.com/backend-api/estuary/content?id=file_000000009ccc7243b6193e6ab7b028db&ts=490522&p=fs&cid=1&sig=8364a7898b87aae76cd8af34d44087dad870a9769c75bd5fe59110148303e4f0&v=0)

Prove this versioN!

## Response:
Let’s rigorously **prove Example 3.20**, now in its **full general form** as shown in the image.

This is the **affine composition of a perspective function**, and we’ll show from first principles that:

* * *

🔲 Theorem Statement (from image)
---------------------------------

Let:

*    $f : \mathbb{R}^m \to \mathbb{R} \cup \{ +\infty \}$  be **convex**,
*    $A \in \mathbb{R}^{m \times n}$ ,  $b \in \mathbb{R}^m$ ,
*    $c \in \mathbb{R}^n$ ,  $d \in \mathbb{R}$ .

Define:

$$
g(x) = (c^\top x + d) \cdot f\left( \frac{Ax + b}{c^\top x + d} \right),
$$

with domain:

$$
\mathrm{dom}\ g = \left\{ x \in \mathbb{R}^n\ \middle|\ c^\top x + d > 0,\ \frac{Ax + b}{c^\top x + d} \in \mathrm{dom}\ f \right\}.
$$

Then:

$$
\boxed{g(x)\ \text{is convex on its domain.}}
$$

* * *

🧠 Strategy
-----------

We will **reduce this to the Jensen-style perspective proof** from earlier.

We define:

*    $z(x) := Ax + b \in \mathbb{R}^m$ 
*    $t(x) := c^\top x + d \in \mathbb{R}$ 

Then:

$$
g(x) = t(x) \cdot f\left( \frac{z(x)}{t(x)} \right) = g(x) = g_{\text{perspective}}(z(x), t(x))
$$

**We already proved** (via Jensen) that if  $f$  is convex, then:

$$
g_{\text{persp}}(z, t) := t f(z/t)
$$

is convex over the domain  $\{ (z,t) \mid t > 0,\ z/t \in \mathrm{dom}\ f \}$ .

Now we want to **precompose** this with an affine map:

$$
x \mapsto (z(x), t(x)) = (Ax + b,\ c^\top x + d).
$$

So the proof follows from **two facts**:

1.  **Perspective function is convex** on  $t > 0$ ,
2.  **Affine precomposition** of a convex function is convex (on the pre-image of its domain).

Let’s now write this step-by-step.

* * *

✅ Step-by-Step Proof
--------------------

### Step 1: Define perspective function

Define:

$$
\tilde{g}(z,t) := t f(z/t),
$$

with domain:

$$
\mathrm{dom}\ \tilde{g} = \{ (z, t) \in \mathbb{R}^m \times \mathbb{R}_{++} \mid z/t \in \mathrm{dom}\ f \}.
$$

By **previous Jensen-style proof**,  $\tilde{g}$  is **convex** on its domain.

* * *

### Step 2: Define affine map

Define:

$$
\phi(x) := (z(x), t(x)) = (Ax + b,\ c^\top x + d).
$$

This is an affine map from  $\mathbb{R}^n \to \mathbb{R}^m \times \mathbb{R}$ .

So:

$$
g(x) = \tilde{g} \circ \phi(x) = (c^\top x + d) f\left( \frac{Ax + b}{c^\top x + d} \right).
$$

* * *

### Step 3: Apply affine composition rule

**Theorem**: If  $\tilde{g}$  is convex and  $\phi$  is affine, then  $\tilde{g} \circ \phi$  is convex on:

$$
\phi^{-1}( \mathrm{dom}\ \tilde{g} ) = \{ x \in \mathbb{R}^n \mid c^\top x + d > 0,\ (Ax + b)/(c^\top x + d) \in \mathrm{dom}\ f \}.
$$

But this is exactly the domain given for  $g(x)$  in the statement.

* * *

### ✅ Conclusion:

Hence:

$$
g(x) = (c^\top x + d) f\left( \frac{Ax + b}{c^\top x + d} \right) \quad\text{is convex on its domain.}
$$

Q.E.D. ✅

* * *

🧠 Geometric Intuition
----------------------

This function:

$$
g(x) = t(x) \cdot f(z(x)/t(x))
$$

is the result of applying the **perspective transformation** to a convex function, then **warping the space via an affine map**  $x \mapsto (z(x), t(x))$ .

So the function is "convexity-preserving", just like:

*   affine precomposition,
*   pointwise supremum,
*   expectation under convexity,
*   and perspective (as we proved earlier).

This is a **canonical trick** used to prove convexity of:

*   **quadratic-over-linear** functions,
*   **entropy scaling** (e.g.,  $x \log(x/y)$ ),
*   **robust loss** functions (like  $\frac{|Ax + b|}{c^\top x + d}$ ),
*   and **fractional programming** reductions.

* * *

🧪 Want to practice?
--------------------

Try proving **Exercise 3.23(b)**: show that

$$
g(x) = \frac{ \|Ax + b\|^2 }{ c^\top x + d }
$$

is convex on  $\{ x \mid c^\top x + d > 0 \}$ .

Hint: Use this exact same structure with  $f(u) = \|u\|^2$ , which is convex. Done. 🔁

* * *

Let me know if you want:

*   A **diagram** for the geometric meaning of perspective,
*   A **symbolic decomposition** of the gradient and Hessian of  $g$ ,
*   Or an **epigraph proof** as an alternative to the Jensen-style proof.

2/2

## Prompt:
Merge the two and write completed proof!

2/2

## Response:
Here's the **fully merged, rigorous, from-first-principles proof** of **Example 3.20** — combining both:

1.  the **Jensen-style proof** of the **perspective function’s convexity**, and
2.  the **affine composition step** applied to that perspective.

We will make everything **explicit, detailed, structured**, and **pedagogical** — unpacking every step algebraically and geometrically.

* * *

🧭 Roadmap of the Proof
-----------------------

We aim to prove the following:

* * *

🔲 Theorem (Example 3.20)
-------------------------

Let:

*    $f : \mathbb{R}^m \to \mathbb{R} \cup \{+\infty\}$  be convex,
*    $A \in \mathbb{R}^{m \times n},\ b \in \mathbb{R}^m,\ c \in \mathbb{R}^n,\ d \in \mathbb{R}$ ,

Define:

$$
g(x) := (c^\top x + d) \cdot f\left( \frac{Ax + b}{c^\top x + d} \right),
$$

with domain:

$$
\mathrm{dom}\ g = \left\{ x \in \mathbb{R}^n\ \middle|\ c^\top x + d > 0,\ \frac{Ax + b}{c^\top x + d} \in \mathrm{dom}\ f \right\}.
$$

Then:

$$
\boxed{g(x)\ \text{is convex on its domain.}}
$$

* * *

🧠 Key Insight
--------------

This function  $g(x)$  is a **composition** of:

*   The **perspective transform** of a convex function  $f$ ,
*   with an **affine map**  $x \mapsto (Ax + b,\ c^\top x + d)$ .

So the proof proceeds in two stages:

1.  Show that the **perspective function**  $(z,t) \mapsto t f(z/t)$  is convex.
2.  Show that **composing** this with an affine map preserves convexity.

* * *

✅ Step-by-Step Merged Proof
---------------------------

* * *

### 🔹 Step 1: Convexity of the Perspective Function  $g(z,t) = t f(z/t)$ 

We define:

$$
g(z, t) := t f(z / t),\quad \text{with } t > 0.
$$

We want to prove that  $g$  is convex on:

$$
\mathrm{dom}\ g = \{ (z, t) \in \mathbb{R}^m \times \mathbb{R}_{++} \mid z/t \in \mathrm{dom}\ f \}.
$$

Let:

*    $(z_1, t_1), (z_2, t_2) \in \mathrm{dom}\ g$ , with  $t_1, t_2 > 0$ ,
*    $\theta \in [0,1]$ ,
*   Define:
    $$
    z = \theta z_1 + (1 - \theta) z_2,\quad t = \theta t_1 + (1 - \theta) t_2.
    $$

Then  $t > 0$  (as convex combination of positive values).

* * *

#### 🧮 Step 1A: Key Trick — Rewriting  $\frac{z}{t}$ 

We want to express  $\frac{z}{t}$  as a convex combination of  $\frac{z_1}{t_1}$  and  $\frac{z_2}{t_2}$ .

Define:

$$
\alpha = \frac{ \theta t_1 }{ t },\quad \beta = \frac{ (1 - \theta) t_2 }{ t }.
$$

✅ **Check**  $\alpha, \beta \in [0,1]$  and  $\alpha + \beta = 1$ :

$$
\alpha + \beta = \frac{ \theta t_1 + (1 - \theta) t_2 }{ t } = \frac{ t }{ t } = 1.
$$

Now compute:

$$
\alpha \cdot \frac{z_1}{t_1} + \beta \cdot \frac{z_2}{t_2} = \frac{ \theta z_1 + (1 - \theta) z_2 }{ t } = \frac{ z }{ t }.
$$

So we have:

$$
\frac{z}{t} = \alpha \cdot \frac{z_1}{t_1} + \beta \cdot \frac{z_2}{t_2}.
$$

* * *

#### 🧠 Interpretation of Trick

This is the key geometric idea:

> The perspective map  $(z, t) \mapsto z/t$  **does not preserve** linearity, so we must "correct" the weights. These new weights are proportional to the amount of "time"  $t$  each point contributes.

* * *

#### 🧮 Step 1B: Apply Convexity of  $f$ 

Now use convexity of  $f$ :

$$
f(z / t) = f\left( \alpha \cdot \frac{z_1}{t_1} + \beta \cdot \frac{z_2}{t_2} \right) \leq \alpha f(z_1 / t_1) + \beta f(z_2 / t_2).
$$

Multiply both sides by  $t > 0$ :

$$
t f(z / t) \le t \alpha f(z_1 / t_1) + t \beta f(z_2 / t_2).
$$

But recall:

$$
t \alpha = \theta t_1,\quad t \beta = (1 - \theta) t_2.
$$

Hence:

$$
t f(z / t) \le \theta t_1 f(z_1 / t_1) + (1 - \theta) t_2 f(z_2 / t_2).
$$

This is:

$$
g(z, t) \le \theta g(z_1, t_1) + (1 - \theta) g(z_2, t_2).
$$

✅ Thus,  $g(z, t) = t f(z/t)$  is convex over its domain  $\{ (z,t) \mid t > 0,\ z/t \in \mathrm{dom}\ f \}$ .

* * *

### 🔹 Step 2: Affine Composition — Define  $g(x)$  as Composition

We now define the function:

$$
g(x) := (c^\top x + d) f\left( \frac{Ax + b}{c^\top x + d} \right),
$$

which is:

$$
g(x) = \underbrace{g(z(x), t(x))}_{\text{composition}},
$$

with:

*    $z(x) := Ax + b \in \mathbb{R}^m$ ,
*    $t(x) := c^\top x + d \in \mathbb{R}$ .

That is:

$$
g(x) = \tilde{g}(z(x), t(x)), \quad \text{with } \tilde{g}(z, t) = t f(z/t).
$$

* * *

### 🧠 Step 2A: Apply Composition Rule

We now invoke the following theorem:

> **Theorem (Affine Composition):**  
> If  $\tilde{g}$  is convex on a set  $D$ , and  $\phi(x)$  is affine, then  
>  $g(x) := \tilde{g}(\phi(x))$  is convex on  $\phi^{-1}(D)$ .

Here:

*    $\phi(x) = (z(x), t(x)) = (Ax + b, c^\top x + d)$  is affine,
*    $\tilde{g}$  is convex on  $t > 0, z/t \in \mathrm{dom} f$ ,
*   So  $g(x) = \tilde{g}(\phi(x))$  is convex on:
    $$
    \left\{ x \in \mathbb{R}^n \ \middle|\ c^\top x + d > 0,\ \frac{Ax + b}{c^\top x + d} \in \mathrm{dom}\ f \right\}.
    $$

✅ This is exactly the domain stated in the example.

* * *

✅ Final Conclusion
------------------

We have shown that:

1.   $\tilde{g}(z, t) := t f(z / t)$  is convex via Jensen’s inequality,
2.   $x \mapsto (Ax + b, c^\top x + d)$  is affine,
3.  So the composition:
    $$
    g(x) := (c^\top x + d) \cdot f\left( \frac{Ax + b}{c^\top x + d} \right)
    $$
    is convex on:
    $$
    \mathrm{dom}\ g = \left\{ x \in \mathbb{R}^n\ \middle|\ c^\top x + d > 0,\ \frac{Ax + b}{c^\top x + d} \in \mathrm{dom}\ f \right\}.
    $$
    
$$
\boxed{g(x)\ \text{is convex on its domain.} \quad \blacksquare}
$$

* * *

📌 Summary
----------

| Step | What we did | Core idea |
| --- | --- | --- |
| 1 | Proved that  $t f(z/t)$  is convex | Jensen inequality with transformed weights |
| 2 | Precomposed with affine map  $x \mapsto (Ax+b, c^\top x + d)$  | Convexity preserved under affine precomposition |
| ✅ | Final result |  $g(x) = (c^\top x + d) f((Ax+b)/(c^\top x + d))$  is convex |

* * *

Let me know if you want:

*   an **illustrated diagram** of this transformation,
*   a **symbolic computation** of gradient/Hessian for special cases,
*   or to explore **common examples** using this form (e.g., quadratic-over-linear, KL-divergence, entropy, etc).

## Prompt:
Lemme explain like this:

First the function is defined on z,t. so we write convex comb for z1,z2 and t1,t2.

Then we write the convexity of f via two random multipliers alpha, beta.

After that we rewrite alpha , beta based on tetha, t or z (tetha t1/t  and 1-tetha t2/t) So their sum becomes 1.

Then we weill mutliply both sides by t, and g (z,t) will be proved to be convex.

Then just by simply, use component wise composition via affines, the final affine prepective will become convex.

## Response:
Yes — that’s the right skeleton. Now let me **tighten it into a correct, fully rigorous proof**, while also fixing two subtle points:

*    $\alpha,\beta$  are **not “random”**: they’re _chosen_ so that  $z/t$  becomes a convex combination of  $z_1/t_1$  and  $z_2/t_2$ .
*   The last step is **not componentwise composition** (that phrase belongs to Example 3.14). Here it’s **affine precomposition** of a convex function in  $(z,t)$ .

Below is the merged, final proof in the exact spirit of what you wrote.

* * *

Example 3.20 — Complete Jensen-style proof (merged)
===================================================

Statement
---------

Let  $f:\mathbb R^m\to \mathbb R\cup\{+\infty\}$  be convex. Let  
 $A\in\mathbb R^{m\times n}$ ,  $b\in\mathbb R^m$ ,  $c\in\mathbb R^n$ ,  $d\in\mathbb R$ .  
Define

$$
g(x)=(c^\top x+d)\; f\!\left(\frac{Ax+b}{c^\top x+d}\right),
$$

with domain

$$
\mathrm{dom}\, g=\left\{x\mid c^\top x+d>0,\ \frac{Ax+b}{c^\top x+d}\in \mathrm{dom}\,f\right\}.
$$

Claim:  $g$  is convex on  $\mathrm{dom}\,g$ .

* * *

Part I: Prove the **perspective** is convex (Jensen proof)
----------------------------------------------------------

Define the perspective function

$$
\tilde g(z,t)=t\, f(z/t),\qquad t>0,
$$

with domain  $\{(z,t)\mid t>0,\ z/t\in\mathrm{dom} f\}$ .

### Step 1: Start from the convexity inequality we need

Take any  $(z_1,t_1)$ ,  $(z_2,t_2)$  in the domain, so  $t_1,t_2>0$ , and any  $\theta\in[0,1]$ .  
Set the convex combination

$$
z=\theta z_1+(1-\theta)z_2,\qquad t=\theta t_1+(1-\theta)t_2.
$$

Then  $t>0$ .

We want to show:

$$
\tilde g(z,t)\le \theta \tilde g(z_1,t_1)+(1-\theta)\tilde g(z_2,t_2),
$$

i.e.

$$
t f(z/t)\le \theta t_1 f(z_1/t_1)+(1-\theta)t_2 f(z_2/t_2).
$$

### Step 2: Choose  $\alpha,\beta$  so that  $z/t$  becomes a convex combination

Define

$$
\alpha=\frac{\theta t_1}{t},\qquad \beta=\frac{(1-\theta)t_2}{t}.
$$

Then:

*    $\alpha,\beta\ge 0$  since  $t,t_1,t_2>0$ ,  $\theta\in[0,1]$ ,
*   and
    
$$
\alpha+\beta=\frac{\theta t_1+(1-\theta)t_2}{t}=\frac{t}{t}=1.
$$

So  $\alpha,\beta$  are valid convex weights.

Now compute:

$$
\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2} =\frac{\theta t_1}{t}\frac{z_1}{t_1}+\frac{(1-\theta)t_2}{t}\frac{z_2}{t_2} =\frac{\theta z_1+(1-\theta)z_2}{t} =\frac{z}{t}.
$$

So we have the key identity:

 $$
\boxed{\ \frac{z}{t}=\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}\ }.
$$

### Step 3: Apply convexity of  $f$  (this is the Jensen step)

Since  $f$  is convex and  $\alpha+\beta=1$ ,

$$
f(z/t)=f\!\left(\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}\right) \le \alpha f(z_1/t_1)+\beta f(z_2/t_2).
$$

### Step 4: Multiply by  $t>0$  and simplify

Multiply both sides by  $t$ :

$$
t f(z/t)\le t\alpha f(z_1/t_1)+t\beta f(z_2/t_2).
$$

But  $t\alpha=\theta t_1$  and  $t\beta=(1-\theta)t_2$ . Hence

$$
t f(z/t)\le \theta t_1 f(z_1/t_1)+(1-\theta)t_2 f(z_2/t_2).
$$

That is exactly:

$$
\tilde g(z,t)\le \theta \tilde g(z_1,t_1)+(1-\theta)\tilde g(z_2,t_2).
$$

So  $\tilde g$  is convex on its domain. ✅

* * *

Part II: Apply **affine precomposition** to get the stated  $g(x)$ 
-------------------------------------------------------------------

Define the affine maps

$$
z(x)=Ax+b,\qquad t(x)=c^\top x+d.
$$

Then the given function is exactly

$$
g(x)=\tilde g(z(x),t(x)).
$$

### Why convexity carries over

Take any  $x_1,x_2\in \mathrm{dom}\,g$  and  $\theta\in[0,1]$ .  
Let  $x=\theta x_1+(1-\theta)x_2$ .  
Because  $t(x)=c^\top x+d$  is affine,

$$
t(x)=\theta t(x_1)+(1-\theta)t(x_2)>0.
$$

Also  $z(x)=\theta z(x_1)+(1-\theta)z(x_2)$  (affinity again).  
So

$$
(z(x),t(x))=\theta (z(x_1),t(x_1))+(1-\theta)(z(x_2),t(x_2)).
$$

Now apply convexity of  $\tilde g$  (proven in Part I):

$$
g(x)=\tilde g(z(x),t(x)) \le \theta \tilde g(z(x_1),t(x_1))+(1-\theta)\tilde g(z(x_2),t(x_2)) =\theta g(x_1)+(1-\theta)g(x_2).
$$

Therefore  $g$  is convex on  $\mathrm{dom}\,g$ . ✅

$$
\boxed{\text{Example 3.20 is proved.}}
$$

* * *

Quick “truth table” for your summary (so it sticks)
---------------------------------------------------

Your outline is right; just replace the last phrase:

*   ✅ “Define on  $(z,t)$ , take convex combinations.”
*   ✅ “Pick  $\alpha,\beta$  to use Jensen on  $f$ .”
*   ✅ “Show  $\alpha+\beta=1$ , apply convexity of  $f$ .”
*   ✅ “Multiply by  $t$ , conclude perspective is convex.”
*   ✅ “Precompose with affine  $(Ax+b,\ c^\top x+d)$ , convexity preserved.”
*   ❌ Not “componentwise composition” (that’s Example 3.14).  
    ✅ It’s “affine precomposition of a convex function in  $(z,t)$ .”

* * *

If you want, I can also show a **1D numeric toy example** (pick specific  $f,z_1,t_1,z_2,t_2,\theta$ ) so you can literally see the  $\alpha,\beta$  weights “snap into place.”

## Prompt:
Next example 3.36

## Response:
Thought for 14s

Alright — **Example 3.36** next: **rank is quasiconcave on the PSD cone**.

The document’s statement is: on  $\mathbf S_+^n$  (symmetric PSD matrices), the function  $f(X)=\mathrm{rank}(X)$  is **quasiconcave**, i.e. it satisfies the **modified Jensen inequality**

$$
\mathrm{rank}\!\big(\theta X+(1-\theta)Y\big)\ \ge\ \min\{\mathrm{rank}(X),\mathrm{rank}(Y)\} \quad(\theta\in[0,1]) ,
$$

for all  $X,Y\succeq 0$ .

ChatGPT-Breakdown of convexity …

I’ll prove it from bedrock, and I’ll actually prove a _stronger_ inequality along the way (the one the document itself proves):

$$
\mathrm{rank}(X+Y)\ \ge\ \max\{\mathrm{rank}(X),\mathrm{rank}(Y)\}\qquad(X,Y\succeq 0),
$$

then specialize to convex combinations.

ChatGPT-Breakdown of convexity …

* * *

0) What “quasiconcave” means here (the exact test)
--------------------------------------------------

A function is **quasiconcave** iff all its **upper level sets** are convex; equivalently (and this is what BV calls “modified Jensen”):

$$
f(\theta x+(1-\theta)y)\ \ge\ \min\{f(x),f(y)\}.
$$

We’ll use exactly that form, with  $f(X)=\mathrm{rank}(X)$ .

ChatGPT-Breakdown of convexity …

So our target is:

$$
\boxed{\mathrm{rank}(\theta X+(1-\theta)Y)\ \ge\ \min\{\mathrm{rank}(X),\mathrm{rank}(Y)\}} \quad\text{for PSD }X,Y.
$$

* * *

1) Two subspaces you must keep straight: nullspace and rank
-----------------------------------------------------------

For a matrix  $X\in\mathbb R^{n\times n}$ :

*   **Nullspace**:  $\mathcal N(X)=\{v: Xv=0\}$ .
*   **Rank-nullity** (dimension theorem):
    
$$
\mathrm{rank}(X)=n-\dim\mathcal N(X).
$$

This is explicitly in the document and is the algebraic bridge from “nullspaces behave nicely” to “rank behaves nicely.”

ChatGPT-Breakdown of convexity …

So: **to prove a rank inequality, it’s enough to prove a nullspace containment / identity**.

* * *

2) The one PSD-only magic fact: “no cancellation in quadratic forms”
--------------------------------------------------------------------

### Lemma (PSD no-cancellation)

If  $X\succeq 0$  and  $v^\top Xv=0$ , then  $Xv=0$ .

ChatGPT-Breakdown of convexity …

**Proof (cleanest version).**  
Because  $X\succeq 0$ , it has a PSD square root  $X^{1/2}$  with  $X=X^{1/2}X^{1/2}$ . Then

$$
v^\top Xv = v^\top X^{1/2}X^{1/2}v = \|X^{1/2}v\|_2^2.
$$

A squared norm is  $0$  iff the vector is  $0$ . So  $v^\top Xv=0\Rightarrow X^{1/2}v=0\Rightarrow Xv=X^{1/2}(X^{1/2}v)=0$ .

ChatGPT-Breakdown of convexity …

**Intuition:** this is the matrix analogue of: if  $a\ge0$  and  $a=0$ , then  $a$  is “really zero” — PSD structure prevents positive and negative pieces from cancelling.

* * *

3) Nullspace of a PSD sum (or convex combo) becomes an intersection
-------------------------------------------------------------------

### Lemma (two matrices)

If  $X,Y\succeq 0$ , then

$$
\boxed{\mathcal N(X+Y)=\mathcal N(X)\cap \mathcal N(Y).}
$$

ChatGPT-Breakdown of convexity …

**Proof (both containments, no skipping).**

**( $\supseteq$ )** Take  $v\in \mathcal N(X)\cap\mathcal N(Y)$ .  
Then  $Xv=0$  and  $Yv=0$ . So  $(X+Y)v=Xv+Yv=0+0=0$ . Hence  $v\in\mathcal N(X+Y)$ .

ChatGPT-Breakdown of convexity …

**( $\subseteq$ )** Take  $v\in \mathcal N(X+Y)$ .  
Then  $(X+Y)v=0$ . Left-multiply by  $v^\top$ :

$$
0=v^\top(X+Y)v = v^\top Xv + v^\top Yv.
$$

Each term is  $\ge 0$  because  $X,Y\succeq 0$ . A sum of two nonnegative reals is  $0$  only if each is  $0$ , so  $v^\top Xv=0$  and  $v^\top Yv=0$ .  
Now apply the PSD no-cancellation lemma to each:  $v^\top Xv=0\Rightarrow Xv=0$ , similarly  $Yv=0$ . Hence  $v\in\mathcal N(X)\cap\mathcal N(Y)$ .

ChatGPT-Breakdown of convexity …

So equality holds.

### (Even sharper) Lemma for convex combinations

If  $Z=\sum_i \theta_i X_i$  with  $\theta_i>0$ ,  $\sum_i\theta_i=1$ , and all  $X_i\succeq 0$ , then

$$
\boxed{\mathcal N(Z)=\bigcap_i \mathcal N(X_i).}
$$

Same proof:  $0=v^\top Zv=\sum_i \theta_i v^\top X_iv$  forces each  $v^\top X_iv=0$ , then PSD no-cancellation gives each  $X_iv=0$ .

ChatGPT-Breakdown of convexity …

This is the _real_ structural reason rank behaves monotonically under mixing on the PSD cone.

* * *

4) Convert nullspace intersection into a rank inequality
--------------------------------------------------------

From the nullspace identity:

$$
\mathcal N(X+Y)=\mathcal N(X)\cap\mathcal N(Y),
$$

we immediately get a dimension inequality:

$$
\dim(\mathcal N(X)\cap\mathcal N(Y)) \le \min\{\dim\mathcal N(X),\dim\mathcal N(Y)\},
$$

because an intersection is a subset of each set.

ChatGPT-Breakdown of convexity …

Now use rank-nullity:

$$
\mathrm{rank}(X+Y)=n-\dim\mathcal N(X+Y) = n-\dim(\mathcal N(X)\cap\mathcal N(Y)).
$$

Combine with the dimension bound:

$$
\mathrm{rank}(X+Y) \ge n-\min\{\dim\mathcal N(X),\dim\mathcal N(Y)\} = \max\{n-\dim\mathcal N(X),\,n-\dim\mathcal N(Y)\} = \max\{\mathrm{rank}(X),\mathrm{rank}(Y)\}.
$$

Exactly the stronger inequality the document highlights.

ChatGPT-Breakdown of convexity …

* * *

5) Finally: the “modified Jensen” inequality → quasiconcavity
-------------------------------------------------------------

Take  $X,Y\succeq 0$  and  $\theta\in(0,1)$ . Define

$$
Z=\theta X+(1-\theta)Y.
$$

Because scaling by a nonzero scalar doesn’t change rank,  
 $\mathrm{rank}(\theta X)=\mathrm{rank}(X)$  and  $\mathrm{rank}((1-\theta)Y)=\mathrm{rank}(Y)$ .

ChatGPT-Breakdown of convexity …

Now apply the _sum_ inequality (Step 4) to the PSD matrices  $\theta X$  and  $(1-\theta)Y$ :

$$
\mathrm{rank}(Z) =\mathrm{rank}(\theta X+(1-\theta)Y) \ge \max\{\mathrm{rank}(\theta X),\mathrm{rank}((1-\theta)Y)\} = \max\{\mathrm{rank}(X),\mathrm{rank}(Y)\} \ge \min\{\mathrm{rank}(X),\mathrm{rank}(Y)\}.
$$

So modified Jensen holds, hence  $\mathrm{rank}$  is **quasiconcave** on  $\mathbf S_+^n$ .

ChatGPT-Breakdown of convexity …

**Intuition:** PSD convex combinations can’t “destroy directions.” In fact, the nullspace can only _shrink_ by intersection, so rank can only _grow_ (or stay same) under mixing. The doc even spells out this “no cancellation” moral.

ChatGPT-Breakdown of convexity …

* * *

6) Two sanity checks (so you don’t overgeneralize)
--------------------------------------------------

1.  **Why PSD matters**: if matrices aren’t PSD, cancellation can happen and quasiconcavity fails (e.g.  $1$  and  $-1$  average to  $0$ ).
    ChatGPT-Breakdown of convexity …
2.  **Not quasiconvex**: lower level sets of rank aren’t convex even in PSD cone (two different rank-1 projectors average to full-rank).
    ChatGPT-Breakdown of convexity …

* * *

When you’re ready, I can do the **“upper level sets  $U_r=\{X\succeq0:\mathrm{rank}(X)\ge r\}$  are convex”** proof _directly_ (it’s the same nullspace-intersection lemma packaged as set convexity), which the document also previews.

ChatGPT-Breakdown of convexity …

## Prompt:
Complete 3.36. Explain step-by-step, completer,

Alright — **Example 3.36** next: **rank is quasiconcave on the PSD cone**.

The document’s statement is: on (\mathbf S_+^n) (symmetric PSD matrices), the function (f(X)=\mathrm{rank}(X)) is **quasiconcave**, i.e. it satisfies the **modified Jensen inequality**
[
\mathrm{rank}!\big(\theta X+(1-\theta)Y\big)\ \ge\ \min{\mathrm{rank}(X),\mathrm{rank}(Y)}
\quad(\theta\in[0,1]) ,
]
for all (X,Y\succeq 0). 

I’ll prove it from bedrock, and I’ll actually prove a *stronger* inequality along the way (the one the document itself proves):
[
\mathrm{rank}(X+Y)\ \ge\ \max{\mathrm{rank}(X),\mathrm{rank}(Y)}\qquad(X,Y\succeq 0),
]
then specialize to convex combinations. 

---

## 0) What “quasiconcave” means here (the exact test)

A function is **quasiconcave** iff all its **upper level sets** are convex; equivalently (and this is what BV calls “modified Jensen”):
[
f(\theta x+(1-\theta)y)\ \ge\ \min{f(x),f(y)}.
]
We’ll use exactly that form, with (f(X)=\mathrm{rank}(X)). 

So our target is:
[
\boxed{\mathrm{rank}(\theta X+(1-\theta)Y)\ \ge\ \min{\mathrm{rank}(X),\mathrm{rank}(Y)}}
\quad\text{for PSD }X,Y.
]

---

## 1) Two subspaces you must keep straight: nullspace and rank

For a matrix (X\in\mathbb R^{n\times n}):

* **Nullspace**: (\mathcal N(X)={v: Xv=0}).
* **Rank-nullity** (dimension theorem):
  [
  \mathrm{rank}(X)=n-\dim\mathcal N(X).
  ]
  This is explicitly in the document and is the algebraic bridge from “nullspaces behave nicely” to “rank behaves nicely.” 

So: **to prove a rank inequality, it’s enough to prove a nullspace containment / identity**.

---

## 2) The one PSD-only magic fact: “no cancellation in quadratic forms”

### Lemma (PSD no-cancellation)

If (X\succeq 0) and (v^\top Xv=0), then (Xv=0). 

**Proof (cleanest version).**
Because (X\succeq 0), it has a PSD square root (X^{1/2}) with (X=X^{1/2}X^{1/2}). Then
[
v^\top Xv
= v^\top X^{1/2}X^{1/2}v
= |X^{1/2}v|_2^2.
]
A squared norm is (0) iff the vector is (0). So (v^\top Xv=0\Rightarrow X^{1/2}v=0\Rightarrow Xv=X^{1/2}(X^{1/2}v)=0). 

**Intuition:** this is the matrix analogue of: if (a\ge0) and (a=0), then (a) is “really zero” — PSD structure prevents positive and negative pieces from cancelling.

---

## 3) Nullspace of a PSD sum (or convex combo) becomes an intersection

### Lemma (two matrices)

If (X,Y\succeq 0), then
[
\boxed{\mathcal N(X+Y)=\mathcal N(X)\cap \mathcal N(Y).}
]

**Proof (both containments, no skipping).**

**((\supseteq))** Take (v\in \mathcal N(X)\cap\mathcal N(Y)).
Then (Xv=0) and (Yv=0). So ((X+Y)v=Xv+Yv=0+0=0). Hence (v\in\mathcal N(X+Y)). 

**((\subseteq))** Take (v\in \mathcal N(X+Y)).
Then ((X+Y)v=0). Left-multiply by (v^\top):
[
0=v^\top(X+Y)v = v^\top Xv + v^\top Yv.
]
Each term is (\ge 0) because (X,Y\succeq 0). A sum of two nonnegative reals is (0) only if each is (0), so (v^\top Xv=0) and (v^\top Yv=0).
Now apply the PSD no-cancellation lemma to each: (v^\top Xv=0\Rightarrow Xv=0), similarly (Yv=0). Hence (v\in\mathcal N(X)\cap\mathcal N(Y)). 

So equality holds.

### (Even sharper) Lemma for convex combinations

If (Z=\sum_i \theta_i X_i) with (\theta_i>0), (\sum_i\theta_i=1), and all (X_i\succeq 0), then
[
\boxed{\mathcal N(Z)=\bigcap_i \mathcal N(X_i).}
]
Same proof: (0=v^\top Zv=\sum_i \theta_i v^\top X_iv) forces each (v^\top X_iv=0), then PSD no-cancellation gives each (X_iv=0). 

This is the *real* structural reason rank behaves monotonically under mixing on the PSD cone.

---

## 4) Convert nullspace intersection into a rank inequality

From the nullspace identity:
[
\mathcal N(X+Y)=\mathcal N(X)\cap\mathcal N(Y),
]
we immediately get a dimension inequality:
[
\dim(\mathcal N(X)\cap\mathcal N(Y)) \le \min{\dim\mathcal N(X),\dim\mathcal N(Y)},
]
because an intersection is a subset of each set. 

Now use rank-nullity:
[
\mathrm{rank}(X+Y)=n-\dim\mathcal N(X+Y)
= n-\dim(\mathcal N(X)\cap\mathcal N(Y)).
]
Combine with the dimension bound:
[
\mathrm{rank}(X+Y)
\ge n-\min{\dim\mathcal N(X),\dim\mathcal N(Y)}
= \max{n-\dim\mathcal N(X),,n-\dim\mathcal N(Y)}
= \max{\mathrm{rank}(X),\mathrm{rank}(Y)}.
]
Exactly the stronger inequality the document highlights. 

---

## 5) Finally: the “modified Jensen” inequality → quasiconcavity

Take (X,Y\succeq 0) and (\theta\in(0,1)). Define
[
Z=\theta X+(1-\theta)Y.
]
Because scaling by a nonzero scalar doesn’t change rank,
(\mathrm{rank}(\theta X)=\mathrm{rank}(X)) and (\mathrm{rank}((1-\theta)Y)=\mathrm{rank}(Y)). 

Now apply the *sum* inequality (Step 4) to the PSD matrices (\theta X) and ((1-\theta)Y):
[
\mathrm{rank}(Z)
=\mathrm{rank}(\theta X+(1-\theta)Y)
\ge \max{\mathrm{rank}(\theta X),\mathrm{rank}((1-\theta)Y)}
= \max{\mathrm{rank}(X),\mathrm{rank}(Y)}
\ge \min{\mathrm{rank}(X),\mathrm{rank}(Y)}.
]
So modified Jensen holds, hence (\mathrm{rank}) is **quasiconcave** on (\mathbf S_+^n). 

**Intuition:** PSD convex combinations can’t “destroy directions.” In fact, the nullspace can only *shrink* by intersection, so rank can only *grow* (or stay same) under mixing. The doc even spells out this “no cancellation” moral. 

---

## 6) Two sanity checks (so you don’t overgeneralize)

1. **Why PSD matters**: if matrices aren’t PSD, cancellation can happen and quasiconcavity fails (e.g. (1) and (-1) average to (0)). 
2. **Not quasiconvex**: lower level sets of rank aren’t convex even in PSD cone (two different rank-1 projectors average to full-rank). 

---

When you’re ready, I can do the **“upper level sets (U_r={X\succeq0:\mathrm{rank}(X)\ge r}) are convex”** proof *directly* (it’s the same nullspace-intersection lemma packaged as set convexity), which the document also previews. 

2/2

## Response:
Thought for 9s

Got you. Let’s **complete Example 3.36** in a fully “no gaps, no magic” way, with every step spelled out, and we’ll mirror exactly what the document is doing: prove the **stronger rank inequality**, then deduce **modified Jensen**, hence **quasiconcavity**.

ChatGPT-Breakdown of convexity …

* * *

Example 3.36 — Rank is quasiconcave on  $\mathbf S_+^n$ 
========================================================

0) Statement and what we must prove
-----------------------------------

We work on the cone  $\mathbf S_+^n$  of **symmetric positive semidefinite** matrices, meaning

ChatGPT-Breakdown of convexity …

$$
X\succeq 0 \quad\Longleftrightarrow\quad v^\top Xv\ge 0 \ \ \forall v\in\mathbb R^n.
$$

Define

ChatGPT-Breakdown of convexity …

$$
f(X)=\operatorname{rank}(X).
$$

Claim:  $\operatorname{rank}(\cdot)$  is **quasiconcave** on  $\mathbf S_+^n$ .

ChatGPT-Breakdown of convexity …

By the “modified Jensen” test for quasiconcavity, it suffices to prove that for all  $X,Y\succeq 0$  and all  $\theta\in[0,1]$ ,

ChatGPT-Breakdown of convexity …

 $$
\boxed{\ \operatorname{rank}(\theta X+(1-\theta)Y)\ \ge\ \min\{\operatorname{rank}(X),\operatorname{rank}(Y)\}\ }.
$$

The document proves something **stronger** first:

ChatGPT-Breakdown of convexity …

 $$
\boxed{\ \operatorname{rank}(X+Y)\ \ge\ \max\{\operatorname{rank}(X),\operatorname{rank}(Y)\}\quad \forall X,Y\succeq 0\ }.
$$

Then Jensen follows “immediately” from that.

ChatGPT-Breakdown of convexity …

We’ll do exactly that.

* * *

1) Definitions you must hold onto
=================================

For  $X\in\mathbb R^{n\times n}$ :

ChatGPT-Breakdown of convexity …

*   **Nullspace**
    $$
    \mathcal N(X):=\{v\in\mathbb R^n:\ Xv=0\}.
    $$
*   **Range / column space**
    $$
    \mathcal R(X):=\{Xv:\ v\in\mathbb R^n\}.
    $$

And the key algebraic bridge (rank–nullity):

ChatGPT-Breakdown of convexity …

 $$
\boxed{\ \operatorname{rank}(X)=\dim\mathcal R(X)=n-\dim\mathcal N(X)\ }.
$$

So: **if we understand how nullspaces behave under sums/averages, we get rank inequalities for free**.

Also: scaling by a nonzero scalar does not change rank:

ChatGPT-Breakdown of convexity …

$$
t\neq 0 \implies \operatorname{rank}(tX)=\operatorname{rank}(X),
$$

because  $\mathcal N(tX)=\mathcal N(X)$ .

ChatGPT-Breakdown of convexity …

* * *

2) PSD “no cancellation” lemma (the real engine)
================================================

Lemma 1
-------

If  $X\succeq 0$  and  $v^\top Xv=0$ , then  $Xv=0$ .

ChatGPT-Breakdown of convexity …

### Why this is true (step-by-step)

Because  $X\succeq 0$ , it has a PSD square root  $X^{1/2}$  with  $X=X^{1/2}X^{1/2}$ . Then

ChatGPT-Breakdown of convexity …

$$
v^\top Xv = v^\top X^{1/2}X^{1/2}v = \|X^{1/2}v\|_2^2.
$$

A squared norm is  $0$  iff the vector is  $0$ . So  $\|X^{1/2}v\|_2^2=0 \Rightarrow X^{1/2}v=0$ , hence  $Xv=X^{1/2}(X^{1/2}v)=0$ .

ChatGPT-Breakdown of convexity …

**Interpretation:** for PSD matrices, quadratic forms can’t “cancel.” If a nonnegative quantity sums to zero, each piece must be zero.

ChatGPT-Breakdown of convexity …

* * *

3) Nullspace of a PSD sum is an intersection
============================================

Lemma 2
-------

If  $X,Y\succeq 0$ , then

ChatGPT-Breakdown of convexity …

 $$
\boxed{\ \mathcal N(X+Y)=\mathcal N(X)\cap \mathcal N(Y)\ }.
$$

### Proof (both containments)

### (⊇) “Intersection is inside the sum nullspace”

Take  $v\in\mathcal N(X)\cap\mathcal N(Y)$ .  
That means  $Xv=0$  and  $Yv=0$ . Then  $(X+Y)v=Xv+Yv=0$ , so  $v\in\mathcal N(X+Y)$ .

ChatGPT-Breakdown of convexity …

### (⊆) “Sum nullspace forces both to kill the vector”

Take  $v\in\mathcal N(X+Y)$ . Then  $(X+Y)v=0$ .  
Left-multiply by  $v^\top$ :

$$
0=v^\top(X+Y)v=v^\top Xv+v^\top Yv.
$$

Since  $X,Y\succeq 0$ , both terms are  $\ge 0$ . The only way their sum is  $0$  is that each term is  $0$ :

ChatGPT-Breakdown of convexity …

$$
v^\top Xv=0,\qquad v^\top Yv=0.
$$

Now apply Lemma 1 to each:  $v^\top Xv=0\Rightarrow Xv=0$  and  $v^\top Yv=0\Rightarrow Yv=0$ . Therefore  $v\in\mathcal N(X)\cap\mathcal N(Y)$ .

ChatGPT-Breakdown of convexity …

So equality holds.

* * *

4) Convert the nullspace identity into the **strong rank inequality**
=====================================================================

We now compute rank using rank–nullity:

ChatGPT-Breakdown of convexity …

$$
\operatorname{rank}(X)=n-\dim\mathcal N(X).
$$

From Lemma 2:

$$
\mathcal N(X+Y)=\mathcal N(X)\cap\mathcal N(Y).
$$

### Key dimension inequality

Because an intersection is contained in each set,

$$
\mathcal N(X)\cap\mathcal N(Y)\subseteq \mathcal N(X) \quad\text{and}\quad \mathcal N(X)\cap\mathcal N(Y)\subseteq \mathcal N(Y).
$$

So

$$
\dim(\mathcal N(X)\cap\mathcal N(Y))\le \min\{\dim\mathcal N(X),\dim\mathcal N(Y)\}.
$$

This is exactly the inequality used in the writeup.

ChatGPT-Breakdown of convexity …

Now plug into rank–nullity:

$$
\begin{aligned} \operatorname{rank}(X+Y) &= n-\dim\mathcal N(X+Y) \\ &= n-\dim(\mathcal N(X)\cap\mathcal N(Y)) \\ &\ge n-\min\{\dim\mathcal N(X),\dim\mathcal N(Y)\} \\ &= \max\{n-\dim\mathcal N(X),\ n-\dim\mathcal N(Y)\} \\ &= \max\{\operatorname{rank}(X),\operatorname{rank}(Y)\}. \end{aligned}
$$

This is exactly the stronger claim the document announces.

ChatGPT-Breakdown of convexity …

So we have proved:

 $$
\boxed{\ \operatorname{rank}(X+Y)\ge \max\{\operatorname{rank}(X),\operatorname{rank}(Y)\}\quad(X,Y\succeq 0)\ }.
$$

* * *

5) Deduce the “modified Jensen inequality” for convex combinations
==================================================================

Let  $X,Y\succeq 0$  and  $\theta\in(0,1)$ . Define

$$
Z=\theta X+(1-\theta)Y.
$$

Because  $\theta>0$  and  $1-\theta>0$ , both  $\theta X$  and  $(1-\theta)Y$  are PSD, and scaling doesn’t change rank:

ChatGPT-Breakdown of convexity …

$$
\operatorname{rank}(\theta X)=\operatorname{rank}(X),\qquad \operatorname{rank}((1-\theta)Y)=\operatorname{rank}(Y).
$$

Now apply the **sum inequality** (Step 4) to the PSD pair  $\theta X$  and  $(1-\theta)Y$ :

$$
\operatorname{rank}(Z) =\operatorname{rank}(\theta X+(1-\theta)Y) \ge \max\{\operatorname{rank}(\theta X),\operatorname{rank}((1-\theta)Y)\} =\max\{\operatorname{rank}(X),\operatorname{rank}(Y)\}.
$$

In particular,  $\max(\cdot,\cdot)\ge \min(\cdot,\cdot)$ , so

 $$
\boxed{\ \operatorname{rank}(\theta X+(1-\theta)Y)\ge \min\{\operatorname{rank}(X),\operatorname{rank}(Y)\}\ }.
$$

And the endpoints  $\theta=0,1$  are trivial. (The document notes that too.)

ChatGPT-Breakdown of convexity …

This is exactly the “modified Jensen inequality” statement for quasiconcavity.

ChatGPT-Breakdown of convexity …

* * *

6) Conclude quasiconcavity
==========================

By the characterization “modified Jensen ⇔ upper level sets convex,” which the writeup explicitly uses as the engine,

ChatGPT-Breakdown of convexity …

the inequality above implies:

 $$
\boxed{\ \operatorname{rank}(\cdot)\ \text{is quasiconcave on}\ \mathbf S_+^n\ }.
$$

(That is the Example 3.36 claim.)

ChatGPT-Breakdown of convexity …

* * *

7) The intuition you should actually remember
=============================================

The whole proof is one sentence:

> On the PSD cone, **no cancellation** means  $\mathcal N(\theta X+(1-\theta)Y)=\mathcal N(X)\cap\mathcal N(Y)$ , so the nullspace can only shrink, hence rank can only grow.

The writeup even points out this “no cancellation in quadratic forms” moral explicitly.

ChatGPT-Breakdown of convexity …

* * *

If you want the **next layer** after “modified Jensen,” we can prove quasiconcavity in the _other equivalent way_: show each upper level set  $U_r=\{X\succeq 0:\operatorname{rank}(X)\ge r\}$  is convex, and we’ll use the multi-matrix nullspace intersection identity. The file actually goes there and even warns that  $U_r$  need not be closed.

ChatGPT-Breakdown of convexity …

2/2

## Prompt:
Next unpack me PROBLEM 3,20 (Not example 3.20)

2/2

## Response:
Thought for 52s

Cool — **Problem 3.20 (not Example 3.20)** is the exercise titled **“Composition with an affine function”**. It has **three parts (a)(b)(c)**, and each asks you to prove a function is convex. [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

I’ll first state the problem cleanly (verbatim math), then prove each part **from first principles**, step-by-step.

* * *

Problem 3.20 — Composition with an affine function
==================================================

Show the following functions  $f:\mathbb R^n\to\mathbb R$  are **convex**: [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

**(a)**

$$
f(x)=\|Ax-b\|
$$

where  $A\in\mathbb R^{m\times n}$ ,  $b\in\mathbb R^m$ , and  $\|\cdot\|$  is a norm on  $\mathbb R^m$ . [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

**(b)**

$$
f(x)= -\Big(\det(A_0+x_1A_1+\cdots+x_nA_n)\Big)^{1/m},
$$

on the domain

$$
\{x\mid A_0+x_1A_1+\cdots+x_nA_n \succ 0\},
$$

where  $A_i\in \mathbf S^m$  (symmetric  $m\times m$ ). [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

**(c)**

$$
f(x)=\operatorname{tr}\Big(A_0+x_1A_1+\cdots+x_nA_n\Big)^{-1},
$$

on the domain

$$
\{x\mid A_0+x_1A_1+\cdots+x_nA_n \succ 0\},
$$

with  $A_i\in\mathbf S^m$ . (You may use that  $\operatorname{tr}(X^{-1})$  is convex on  $\mathbf S^m_{++}$ ; see Exercise 3.18.) [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

* * *

The one meta-theorem powering all parts
=======================================

Lemma (Affine precomposition preserves convexity)
-------------------------------------------------

Let  $g:\mathbb R^p\to\mathbb R\cup\{+\infty\}$  be convex, and let  $\phi(x)=Fx+g_0$  be an affine map. Define

$$
h(x)=g(\phi(x)).
$$

Then  $h$  is convex on  $\{x\mid \phi(x)\in\mathrm{dom}\,g\}$ .

### Proof (pure Jensen, no magic)

Take any  $x,y$  in the domain and  $\theta\in[0,1]$ . Because  $\phi$  is affine,

$$
\phi(\theta x+(1-\theta)y)=\theta\phi(x)+(1-\theta)\phi(y).
$$

Now use convexity of  $g$ :

$$
g(\phi(\theta x+(1-\theta)y)) = g(\theta\phi(x)+(1-\theta)\phi(y)) \le \theta g(\phi(x))+(1-\theta)g(\phi(y)).
$$

That is

$$
h(\theta x+(1-\theta)y)\le \theta h(x)+(1-\theta)h(y),
$$

so  $h$  is convex.

Keep this lemma loaded in RAM; we’ll reuse it three times.

* * *

(a)  $f(x)=\|Ax-b\|$  is convex
===============================

Step 1: The norm itself is convex
---------------------------------

A norm  $\|\cdot\|$  satisfies triangle inequality and absolute homogeneity:

*    $\|u+v\|\le \|u\|+\|v\|$ 
*    $\|\alpha u\|=|\alpha|\|u\|$ .

Take any  $u,v\in\mathbb R^m$ ,  $\theta\in[0,1]$ . Then

$$
\|\theta u+(1-\theta)v\| \le \|\theta u\|+\|(1-\theta)v\| = \theta\|u\|+(1-\theta)\|v\|.
$$

So  $g(u)=\|u\|$  is convex.

Step 2: Compose with an affine map
----------------------------------

The map  $\phi(x)=Ax-b$  is affine. So by the lemma above,

$$
f(x)=g(\phi(x))=\|Ax-b\|
$$

is convex. This proves (a). [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

**Intuition:** norms are “convex bowls” in  $\mathbb R^m$ ;  $x\mapsto Ax-b$  just re-coordinates space and shifts it.

* * *

(b)  $f(x)=-(\det(\cdot))^{1/m}$  is convex on the SPD domain
=============================================================

Define the affine matrix-valued map

$$
S(x)=A_0+\sum_{i=1}^n x_i A_i.
$$

The domain is exactly  $S(x)\succ 0$ , i.e.,  $S(x)\in \mathbf S^m_{++}$ . [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

Step 1: Identify the outer function and its curvature
-----------------------------------------------------

Let

$$
g(X)= -(\det X)^{1/m}, \qquad X\in \mathbf S^m_{++}.
$$

Now use the known fact (proved earlier / in exercises):

$$
(\det X)^{1/m}\ \text{is concave on } \mathbf S^m_{++}. 
$$

This is exactly Exercise 3.18(b): “ $f(X)=(\det X)^{1/n}$  is concave on  $\mathbf S^n_{++}$ ” (same statement, just rename  $n\to m$ ). [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

If  $\varphi$  is concave, then  $-\varphi$  is convex. Therefore  $g(X)=-(\det X)^{1/m}$  is **convex** on  $\mathbf S^m_{++}$ .

Step 2: Compose convex  $g$  with affine  $S(x)$ 
-------------------------------------------------

We have

$$
f(x)=g(S(x)) = -(\det S(x))^{1/m}.
$$

Since  $S$  is affine and  $g$  is convex on  $\mathbf S^m_{++}$ , the affine precomposition lemma gives:  $f$  is convex on  $\{x\mid S(x)\in\mathbf S^m_{++}\}$ , i.e. on the stated domain. [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

**Intuition:**  $(\det X)^{1/m}$  is the “geometric mean of eigenvalues” (a volume-like quantity), which is concave on SPD; negating it flips it into a convex penalty.

* * *

(c)  $f(x)=\operatorname{tr}(S(x)^{-1})$  is convex on the SPD domain
=====================================================================

Same  $S(x)=A_0+\sum x_iA_i$ , domain  $S(x)\succ 0$ . [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

Step 1: Outer function is convex on SPD matrices
------------------------------------------------

Define

$$
g(X)=\operatorname{tr}(X^{-1}),\qquad X\in\mathbf S^m_{++}.
$$

You are explicitly allowed to use the fact that  $g$  is convex on  $\mathbf S^m_{++}$ ; the problem points you to Exercise 3.18(a) for this. [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

So:  $g$  is convex on its domain.

Step 2: Compose with affine map  $S(x)$ 
----------------------------------------

Since  $S$  is affine,

$$
f(x)=g(S(x))=\operatorname{tr}(S(x)^{-1})
$$

is convex on  $\{x\mid S(x)\in\mathbf S^m_{++}\}$ , i.e., on the stated domain. [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

**Intuition:** inversion  $X\mapsto X^{-1}$  is a “curving” operation that is convex in the PSD order sense, and trace is linear; together  $\mathrm{tr}(X^{-1})$  becomes a convex “barrier-like” penalty that explodes near singularity.

* * *

Final takeaway (what Problem 3.20 is _teaching_)
================================================

All three are the same template:

1.  Prove/know a function  $g$  is convex in some variable  $u$  (vector or matrix).
2.  Recognize your target is  $f(x)=g(\text{affine}(x))$ .
3.  Conclude convexity by affine precomposition.

That is literally why the problem is named “composition with an affine function.” [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

* * *

If you want to go one level deeper: I can also **prove** the two “allowed facts” used in (b) and (c) (concavity of  $(\det X)^{1/m}$ , convexity of  $\mathrm{tr}(X^{-1})$ ) from scratch using epigraphs / matrix inequalities / second derivatives—whichever you prefer.

## Prompt:
prove det^1/m is concave

## Response:
Thought for 10s

We’ll prove, from scratch and cleanly:

$$
\phi(X)\;:=\;(\det X)^{1/n}\quad\text{is concave on }\mathbf S_{++}^n
$$

(i.e. symmetric positive definite matrices).

The proof I’ll use is the most “BV-style” and _structural_: a **variational (min) representation** + “inf of linear functions is concave”.

* * *

0) What we must show
====================

Concavity means: for all  $X,Y\in\mathbf S_{++}^n$  and  $\theta\in[0,1]$ ,

$$
(\det(\theta X+(1-\theta)Y))^{1/n} \;\ge\; \theta(\det X)^{1/n}+(1-\theta)(\det Y)^{1/n}.
$$

* * *

1) Two facts we’ll use (and prove)
==================================

### Fact A: AM–GM on eigenvalues

If  $M\succ 0$  has eigenvalues  $\lambda_1,\dots,\lambda_n>0$ , then

$$
\frac{1}{n}\operatorname{tr}(M)=\frac{1}{n}\sum_{i=1}^n \lambda_i \;\ge\; \left(\prod_{i=1}^n \lambda_i\right)^{1/n} =\big(\det M\big)^{1/n}.
$$

This is just scalar AM–GM applied to the positive numbers  $\lambda_i$ .

### Fact B: cyclic trace + determinant multiplicativity

For compatible matrices:

*    $\operatorname{tr}(AB)=\operatorname{tr}(BA)$ .
*    $\det(ABC)=\det(A)\det(B)\det(C)$ .
*   If  $S\succ 0$ , there exists  $S^{1/2}\succ 0$  with  $S=S^{1/2}S^{1/2}$  and  $\det(S^{1/2})=\det(S)^{1/2}$ .

All standard linear algebra.

* * *

2) Key lemma: a variational formula for  $(\det X)^{1/n}$ 
==========================================================

Lemma (variational representation)
----------------------------------

For every  $X\in\mathbf S_{++}^n$ ,

$$
\boxed{ (\det X)^{1/n} = \inf_{\substack{S\in\mathbf S_{++}^n\\ \det S=1}} \frac{1}{n}\operatorname{tr}(SX). }
$$

This lemma is the whole game: the RHS is an infimum of **linear** functions of  $X$  (trace is linear in  $X$ ), hence will imply concavity.

* * *

Proof of the lemma (two inequalities)
-------------------------------------

### Step 1: Show RHS  $\ge (\det X)^{1/n}$ 

Fix any  $S\succ 0$  with  $\det S=1$ . Consider

$$
M:=S^{1/2}XS^{1/2}.
$$

Then  $M\succ 0$ . Also

$$
\operatorname{tr}(SX)=\operatorname{tr}(S^{1/2}XS^{1/2})=\operatorname{tr}(M)
$$

(using cyclicity of trace).

Apply AM–GM (Fact A) to  $M$ :

$$
\frac{1}{n}\operatorname{tr}(M)\ge (\det M)^{1/n}.
$$

Now compute  $\det M$ :

$$
\det(S^{1/2}XS^{1/2}) =\det(S^{1/2})\det(X)\det(S^{1/2}) =\det(S)\det(X).
$$

Since  $\det S=1$ , we get  $\det M=\det X$ . Therefore

$$
\frac{1}{n}\operatorname{tr}(SX) =\frac{1}{n}\operatorname{tr}(M) \ge (\det M)^{1/n} =(\det X)^{1/n}.
$$

This holds for **every** feasible  $S$ , so it holds for the infimum:

$$
\inf_{\det S=1}\frac{1}{n}\operatorname{tr}(SX)\ \ge\ (\det X)^{1/n}.
$$

### Step 2: Show RHS  $\le (\det X)^{1/n}$  by constructing an optimal  $S$ 

We want some feasible  $S$  that attains equality. Define

$$
S_* := (\det X)^{1/n}\, X^{-1}.
$$

Check feasibility:

$$
\det(S_*)=\det\big((\det X)^{1/n}I\big)\det(X^{-1}) =(\det X)^{n\cdot (1/n)}\cdot (\det X)^{-1} =1.
$$

So  $S_*$  is feasible.

Now compute the objective:

$$
\frac{1}{n}\operatorname{tr}(S_*X) =\frac{1}{n}\operatorname{tr}\big((\det X)^{1/n}X^{-1}X\big) =\frac{1}{n}\operatorname{tr}\big((\det X)^{1/n}I\big) =\frac{1}{n}\cdot n\cdot (\det X)^{1/n} =(\det X)^{1/n}.
$$

So the infimum is  $\le (\det X)^{1/n}$ .

### Step 3: Combine

We have both

$$
\inf_{\det S=1}\frac{1}{n}\operatorname{tr}(SX)\ \ge\ (\det X)^{1/n} \quad\text{and}\quad \inf_{\det S=1}\frac{1}{n}\operatorname{tr}(SX)\ \le\ (\det X)^{1/n}.
$$

Hence equality holds, proving the lemma.

✅ Lemma proved.

* * *

3) Concavity of  $(\det X)^{1/n}$ 
==================================

Now use the lemma.

Let  $X,Y\in\mathbf S_{++}^n$  and  $\theta\in[0,1]$ . Define  $Z=\theta X+(1-\theta)Y$ , which is still SPD.

Using the variational formula:

$$
\phi(Z)=\inf_{\det S=1}\frac{1}{n}\operatorname{tr}(SZ).
$$

Expand  $Z$  linearly inside trace:

$$
\frac{1}{n}\operatorname{tr}(S(\theta X+(1-\theta)Y)) = \theta\frac{1}{n}\operatorname{tr}(SX) +(1-\theta)\frac{1}{n}\operatorname{tr}(SY).
$$

Therefore

$$
\phi(Z) = \inf_{\det S=1}\left[ \theta a_S+(1-\theta)b_S \right],
$$

where  $a_S=\frac{1}{n}\operatorname{tr}(SX)$  and  $b_S=\frac{1}{n}\operatorname{tr}(SY)$ .

Now the key inequality about infima (true for any family of real numbers  $\{a_S\},\{b_S\}$ ):

$$
\inf_S\big(\theta a_S+(1-\theta)b_S\big) \;\ge\; \theta\inf_S a_S+(1-\theta)\inf_S b_S.
$$

Reason: for every fixed  $S$ ,

$$
a_S\ge \inf_S a_S,\qquad b_S\ge \inf_S b_S
$$

so

$$
\theta a_S+(1-\theta)b_S\ge \theta\inf_S a_S+(1-\theta)\inf_S b_S,
$$

and taking  $\inf$  over  $S$  preserves the inequality.

Apply this:

$$
\phi(Z) \ge \theta \inf_{\det S=1}\frac{1}{n}\operatorname{tr}(SX) +(1-\theta)\inf_{\det S=1}\frac{1}{n}\operatorname{tr}(SY).
$$

Use the lemma again on each infimum:

$$
\inf_{\det S=1}\frac{1}{n}\operatorname{tr}(SX)=\phi(X),\qquad \inf_{\det S=1}\frac{1}{n}\operatorname{tr}(SY)=\phi(Y).
$$

So

$$
\boxed{ \phi(\theta X+(1-\theta)Y)\ge \theta\phi(X)+(1-\theta)\phi(Y). }
$$

That is exactly concavity of  $\phi(X)=(\det X)^{1/n}$  on  $\mathbf S_{++}^n$ .

✅ Proven.

* * *

4) What to remember (the intuition)
===================================

*    $(\det X)^{1/n}$  is the **geometric mean of eigenvalues** of  $X$  (a “volume scale”).
*   The lemma says: the geometric mean can be written as the **minimum, over all volume-normalized weights  $S$ **, of a **weighted arithmetic mean**  $\frac{1}{n}\operatorname{tr}(SX)$ .
*   “Minimum of linear functions” is concave. So the geometric mean is concave.

It’s matrix AM–GM, weaponized.

* * *

If you want, I can also derive the **Minkowski determinant inequality**

$$
\det(X+Y)^{1/n}\ge \det(X)^{1/n}+\det(Y)^{1/n}
$$

from the same variational formula (it’s essentially the “homogeneous” version of concavity).

## Prompt:
Prove without Key lemma: a variational formula if possible. ANd then derive the Minkowski determinant inequality

## Response:
Thought for 17s

Yes — we can prove concavity of  $\det(\cdot)^{1/n}$  **without** the variational “inf trace” lemma, using only:

*   matrix calculus (derivatives of  $\log\det$ ),
*   a single Cauchy–Schwarz inequality for traces,
*   and then we’ll derive **Minkowski’s determinant inequality** as a one-line corollary using homogeneity.

I’ll do this in a way where every symbol is defined and every inequality is justified.

* * *

Part A — Prove  $\phi(X) := (\det X)^{1/n}$  is concave on  $\mathbf S_{++}^n$ 
===============================================================================

A0) Setup and what “concave” means here
---------------------------------------

We work on the open convex set  $\mathbf S_{++}^n$  (symmetric positive definite matrices).

We define

$$
\phi(X) := (\det X)^{1/n}.
$$

To show  $\phi$  is concave, it is enough to show that for every  $X\in \mathbf S_{++}^n$  and every symmetric direction  $H\in \mathbf S^n$ , the one-variable function

$$
g(t) := \phi(X+tH)
$$

is concave for all  $t$  in the interval where  $X+tH \succ 0$ .  
Equivalently (since  $g$  will be  $C^2$ ), show

$$
g''(t)\le 0\quad\text{for all such }t.
$$

So we’ll compute  $g''(0)$  in general (with  $X$  replaced by  $X+tH$ ), and show it’s always  $\le 0$ .

* * *

A1) Two derivative identities we need
-------------------------------------

### Identity 1: derivative of  $\log\det$ 

Define

$$
\psi(X) := \log\det X.
$$

Then for SPD  $X$ , the first directional derivative is

$$
D\psi(X)[H] = \operatorname{tr}(X^{-1}H).
$$

And the second directional derivative is

$$
D^2\psi(X)[H,H] = -\operatorname{tr}(X^{-1}H\,X^{-1}H).
$$

**Why these are true (quick derivation, but complete):**

Take  $X(t)=X+tH$ . Then

$$
\frac{d}{dt}\log\det X(t) = \frac{1}{\det X(t)}\frac{d}{dt}\det X(t).
$$

A standard determinant differential identity is

$$
\frac{d}{dt}\det X(t) = \det X(t)\,\operatorname{tr}\!\big(X(t)^{-1}X'(t)\big).
$$

Here  $X'(t)=H$ . So

$$
\frac{d}{dt}\log\det X(t) = \operatorname{tr}(X(t)^{-1}H).
$$

That gives the first derivative.

Differentiate again:

$$
\frac{d}{dt}\operatorname{tr}(X(t)^{-1}H) = \operatorname{tr}\big((X(t)^{-1})'H\big).
$$

And another standard identity is

$$
(X^{-1})' = -X^{-1}X'X^{-1}.
$$

So  $(X(t)^{-1})' = -X(t)^{-1}H X(t)^{-1}$ . Hence

$$
\frac{d^2}{dt^2}\log\det X(t) = -\operatorname{tr}\big(X(t)^{-1}H X(t)^{-1}H\big),
$$

which is the second derivative formula.

* * *

A2) Now compute the second derivative of  $\phi(X)=\exp\left(\frac{1}{n}\log\det X\right)$ 
-------------------------------------------------------------------------------------------

Let

$$
s(X) := \frac{1}{n}\log\det X, \qquad\text{so}\qquad \phi(X)=e^{s(X)}.
$$

Fix  $X\succ 0$  and direction  $H$ . Define  $X(t)=X+tH$ , and

$$
u(t):=s(X(t)),\qquad g(t):=\phi(X(t))=e^{u(t)}.
$$

We have the one-variable rule:

$$
g'(t)=g(t)\,u'(t),\qquad g''(t)=g(t)\big(u''(t)+(u'(t))^2\big).
$$

So the sign of  $g''(t)$  is the sign of

$$
u''(t)+(u'(t))^2,
$$

because  $g(t)>0$ .

Now compute  $u'(t)$  and  $u''(t)$  using A1:

*   Since  $u(t)=\frac{1}{n}\log\det X(t)$ ,
    
$$
u'(t)=\frac{1}{n}\operatorname{tr}(X(t)^{-1}H).
$$
*   And
    
$$
u''(t)=\frac{1}{n}\left(-\operatorname{tr}(X(t)^{-1}H X(t)^{-1}H)\right).
$$

So

$$
u''(t)+(u'(t))^2 = -\frac{1}{n}\operatorname{tr}(X(t)^{-1}H X(t)^{-1}H) +\frac{1}{n^2}\big(\operatorname{tr}(X(t)^{-1}H)\big)^2.
$$

Thus

$$
g''(t) = g(t)\left[ \frac{1}{n^2}\big(\operatorname{tr}(X(t)^{-1}H)\big)^2 -\frac{1}{n}\operatorname{tr}(X(t)^{-1}H X(t)^{-1}H) \right].
$$

So to prove  $g''(t)\le 0$  for all  $t$ , it suffices to prove:

$$
\boxed{ \big(\operatorname{tr}(X^{-1}H)\big)^2 \le n\,\operatorname{tr}(X^{-1}H X^{-1}H) \quad\text{for all }X\succ 0,\,H=H^\top. }
$$

* * *

A3) Reduce that inequality to plain Cauchy–Schwarz
--------------------------------------------------

Let

$$
M := X^{-1/2} H X^{-1/2}.
$$

Then  $M$  is symmetric (because  $X^{-1/2}$  and  $H$  are symmetric).

Now observe:

$$
\operatorname{tr}(X^{-1}H) = \operatorname{tr}(X^{-1/2}X^{-1/2}H) = \operatorname{tr}(X^{-1/2} H X^{-1/2}) = \operatorname{tr}(M).
$$

Also

$$
\operatorname{tr}(X^{-1}H X^{-1}H) = \operatorname{tr}(X^{-1/2} H X^{-1} H X^{-1/2}) = \operatorname{tr}(M^2).
$$

So the needed inequality becomes:

$$
(\operatorname{tr}M)^2 \le n\,\operatorname{tr}(M^2) \qquad\text{for symmetric }M.
$$

But this is exactly Cauchy–Schwarz in  $\mathbb R^n$  applied to the eigenvalues.

### Proof of  $(\operatorname{tr}M)^2 \le n\,\operatorname{tr}(M^2)$ 

Let  $\lambda_1,\dots,\lambda_n$  be eigenvalues of symmetric  $M$ . Then

$$
\operatorname{tr}M=\sum_{i=1}^n \lambda_i,\qquad \operatorname{tr}(M^2)=\sum_{i=1}^n \lambda_i^2.
$$

By scalar Cauchy–Schwarz:

$$
\left(\sum_{i=1}^n \lambda_i\right)^2 \le \left(\sum_{i=1}^n 1^2\right)\left(\sum_{i=1}^n \lambda_i^2\right) = n\sum_{i=1}^n \lambda_i^2.
$$

Done.

Therefore the bracket in the expression for  $g''(t)$  is  $\le 0$ , hence  $g''(t)\le 0$  for all  $t$  with  $X(t)\succ 0$ .

So along every line in the domain,  $\phi$  is concave ⇒  $\phi$  is concave on  $\mathbf S_{++}^n$ .

$$
\boxed{(\det X)^{1/n}\ \text{is concave on }\mathbf S_{++}^n.}
$$

* * *

Part B — Derive Minkowski’s determinant inequality
==================================================

B1) First: note homogeneity of degree 1
---------------------------------------

For  $t>0$ ,

$$
\phi(tX) = (\det(tX))^{1/n} = (t^n\det X)^{1/n} = t(\det X)^{1/n} = t\,\phi(X).
$$

So  $\phi$  is **positively homogeneous of degree 1**.

B2) Use concavity + homogeneity to get superadditivity
------------------------------------------------------

Concavity gives, for any  $X,Y\succ 0$ ,

$$
\phi\!\left(\frac{X+Y}{2}\right)\ge \frac{\phi(X)+\phi(Y)}{2}.
$$

Now apply homogeneity to the left side:

$$
\phi\!\left(\frac{X+Y}{2}\right)=\frac{1}{2}\phi(X+Y).
$$

So

$$
\frac{1}{2}\phi(X+Y)\ge \frac{\phi(X)+\phi(Y)}{2} \quad\Rightarrow\quad \boxed{\phi(X+Y)\ge \phi(X)+\phi(Y).}
$$

Substitute  $\phi(X)=(\det X)^{1/n}$ :

$$
\boxed{ \det(X+Y)^{1/n}\ \ge\ \det(X)^{1/n}+\det(Y)^{1/n}. }
$$

That is **Minkowski’s determinant inequality** (for SPD; it extends to PSD by continuity/approximation).

* * *

What you should remember
========================

1.  **Concavity proof** is basically:
    
$$
\phi = \exp\left(\frac{1}{n}\log\det\right),
$$

compute second directional derivative, and it reduces to

$$
(\operatorname{tr}M)^2 \le n\,\operatorname{tr}(M^2),
$$

which is just Cauchy–Schwarz on eigenvalues.

2.  **Minkowski** drops out because  $\phi$  is:
    *   concave,
*   homogeneous of degree 1,  
    so it must be **superadditive**.

* * *

If you want the _next_ layer: I can characterize the **equality case** in Minkowski (when does  $\det(X+Y)^{1/n}=\det(X)^{1/n}+\det(Y)^{1/n}$  hold?), which is a nice “commuting / proportional” structure result.

## Prompt:
Write complete proof of problem 3.18.

## Response:
Thought for 57s

Below is a complete, self-contained solution of **Exercise 3.18** in Boyd–Vandenberghe: [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

> **3.18** Adapt the proof of concavity of the log-determinant function in §3.1.5 to show:  
> **(a)**  $f(X)=\operatorname{tr}(X^{-1})$  is **convex** on  $\mathrm{dom}\,f=\mathbf S_{++}^n$ .  
> **(b)**  $f(X)=(\det X)^{1/n}$  is **concave** on  $\mathrm{dom}\,f=\mathbf S_{++}^n$ . [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

Throughout,  $\mathbf S_{++}^n$  is the set of real  $n\times n$  **symmetric positive definite** matrices.

* * *

Preliminaries you’ll use in both parts
======================================

P1) “Convex/concave by restriction to lines”
--------------------------------------------

If  $F$  is  $C^2$  on an open convex set, then:

*    $F$  is **convex** iff for every  $X$  and every symmetric direction  $H$ , the scalar function
    $$
    \varphi(t)=F(X+tH)
    $$
    has  $\varphi''(t)\ge 0$  whenever  $X+tH\in \mathbf S_{++}^n$ .
*    $F$  is **concave** iff  $\varphi''(t)\le 0$  for all such lines.

So we will pick  $X\succ 0$ ,  $H=H^\top$ , define  $X(t)=X+tH$ , and compute the second derivative.

P2) Two matrix derivative identities
------------------------------------

For differentiable  $X(t)$  with  $X(t)$  invertible:

1.  **Derivative of inverse**
    
$$
\frac{d}{dt}X(t)^{-1}=-X(t)^{-1}X'(t)X(t)^{-1}.
$$

_Proof._ Differentiate  $X(t)X(t)^{-1}=I$ :

$$
X'(t)X^{-1}(t)+X(t)(X^{-1}(t))'=0 \Rightarrow (X^{-1}(t))'=-X^{-1}(t)X'(t)X^{-1}(t).
$$
2.  **Derivative of log-det**
    
$$
\frac{d}{dt}\log\det X(t)=\operatorname{tr}\!\big(X(t)^{-1}X'(t)\big).
$$

This is the standard identity used in §3.1.5, and it can be derived from  $\det$  differential or Jacobi’s formula.

We’ll apply these with  $X'(t)=H$ .

* * *

Part (a):  $f(X)=\operatorname{tr}(X^{-1})$  is convex on  $\mathbf S_{++}^n$ 
==============================================================================

Step A1: Restrict to a line
---------------------------

Fix  $X\in\mathbf S_{++}^n$  and symmetric  $H$ . Define

$$
X(t)=X+tH,\qquad \text{for }t\text{ such that }X(t)\succ 0.
$$

Define the scalar function

$$
\varphi(t):=\operatorname{tr}(X(t)^{-1}).
$$

We will prove  $\varphi''(t)\ge 0$  on its interval of definition.

Step A2: First derivative
-------------------------

Using the inverse derivative identity,

$$
\varphi'(t)=\operatorname{tr}\big((X(t)^{-1})'\big) =\operatorname{tr}\big(-X(t)^{-1}H X(t)^{-1}\big).
$$

So

 $$
\boxed{\ \varphi'(t)=-\operatorname{tr}\big(X(t)^{-1}H X(t)^{-1}\big)\ }.
$$

Step A3: Second derivative
--------------------------

Differentiate  $\varphi'(t)$ . The only  $t$ \-dependence is in  $X(t)^{-1}$ . So:

$$
\varphi''(t) =-\frac{d}{dt}\operatorname{tr}\big(X^{-1}H X^{-1}\big) =-\operatorname{tr}\Big((X^{-1})'H X^{-1}+X^{-1}H (X^{-1})'\Big),
$$

where for readability  $X^{-1}$  means  $X(t)^{-1}$ .

Now substitute  $(X^{-1})'=-X^{-1}HX^{-1}$ :

$$
\varphi''(t) =-\operatorname{tr}\Big((-X^{-1}HX^{-1})H X^{-1}+X^{-1}H(-X^{-1}HX^{-1})\Big).
$$

Simplify:

$$
\varphi''(t) =\operatorname{tr}\big(X^{-1}H X^{-1}H X^{-1}\big) +\operatorname{tr}\big(X^{-1}H X^{-1}H X^{-1}\big) =2\,\operatorname{tr}\big(X^{-1}H X^{-1}H X^{-1}\big).
$$

So

 $$
\boxed{\ \varphi''(t)=2\,\operatorname{tr}\big(X(t)^{-1}H X(t)^{-1}H X(t)^{-1}\big)\ }.
$$

Step A4: Show  $\varphi''(t)\ge 0$ 
-----------------------------------

Now we prove

$$
\operatorname{tr}(X^{-1}H X^{-1}H X^{-1})\ge 0 \quad\text{for }X\succ 0,\ H=H^\top.
$$

Diagonalize  $X$ : since  $X\succ 0$  and symmetric,

$$
X=Q\Lambda Q^\top,\quad \Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_n),\ \lambda_i>0.
$$

Then

$$
X^{-1}=Q\Lambda^{-1}Q^\top,\quad \Lambda^{-1}=\operatorname{diag}(1/\lambda_i).
$$

Let  $K:=Q^\top H Q$  (still symmetric). Using cyclicity of trace ( $\operatorname{tr}(ABC)=\operatorname{tr}(CAB)$ ) and orthogonality of  $Q$ ,

$$
\operatorname{tr}(X^{-1}H X^{-1}H X^{-1}) =\operatorname{tr}(\Lambda^{-1}K\Lambda^{-1}K\Lambda^{-1}).
$$

Write  $D:=\Lambda^{-1}=\operatorname{diag}(d_i)$  with  $d_i=1/\lambda_i>0$ . Then the expression is

$$
\operatorname{tr}(D K D K D).
$$

Compute its trace in components. First note:

$$
(DKD)_{ij}=d_i\,k_{ij}\,d_j.
$$

Then

$$
(DKDKD)_{ii}=\sum_{j}(DKD)_{ij}(KD)_{ji} =\sum_{j}(d_i k_{ij} d_j)(k_{ji} d_i) =\sum_{j} d_i^2 d_j\, k_{ij}^2,
$$

since  $K$  is symmetric so  $k_{ji}=k_{ij}$ .  
Summing over  $i$  gives

$$
\operatorname{tr}(DKDKD) =\sum_{i,j} d_i^2 d_j\, k_{ij}^2.
$$

Every term  $d_i^2 d_j k_{ij}^2\ge 0$  (because  $d_i,d_j>0$ , squares are  $\ge 0$ ). Therefore

$$
\operatorname{tr}(X^{-1}H X^{-1}H X^{-1})\ge 0,
$$

and hence

$$
\varphi''(t)=2\,\operatorname{tr}(X^{-1}H X^{-1}H X^{-1})\ge 0.
$$

Step A5: Conclude convexity
---------------------------

Since for every line  $X(t)=X+tH$  in the domain we have  $\varphi''(t)\ge 0$ , the restriction is convex, hence

 $$
\boxed{\ \operatorname{tr}(X^{-1})\ \text{is convex on }\mathbf S_{++}^n\ }.
$$

This completes Exercise 3.18(a). [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

* * *

Part (b):  $f(X)=(\det X)^{1/n}$  is concave on  $\mathbf S_{++}^n$ 
====================================================================

Let

$$
\phi(X):=(\det X)^{1/n}.
$$

As in part (a), fix  $X\succ 0$ ,  $H=H^\top$ , define  $X(t)=X+tH\succ 0$ , and

$$
g(t):=\phi(X(t)).
$$

We will show  $g''(t)\le 0$ .

Step B1: Rewrite  $\phi$  in a calculus-friendly way
----------------------------------------------------

Define

$$
u(t):=\frac{1}{n}\log\det X(t), \quad\text{so}\quad g(t)=e^{u(t)}.
$$

Then

$$
g'(t)=g(t)u'(t), \qquad g''(t)=g(t)\big(u''(t)+(u'(t))^2\big).
$$

Since  $g(t)>0$ , the sign of  $g''(t)$  is the sign of  $u''(t)+(u'(t))^2$ .

Step B2: Compute  $u'(t)$  and  $u''(t)$ 
-----------------------------------------

From the log-det derivative identity with  $X'(t)=H$ :

$$
u'(t)=\frac{1}{n}\operatorname{tr}(X(t)^{-1}H).
$$

Differentiate again. Using  $(X^{-1})'=-X^{-1}HX^{-1}$ ,

$$
u''(t)=\frac{1}{n}\frac{d}{dt}\operatorname{tr}(X^{-1}H) =\frac{1}{n}\operatorname{tr}((X^{-1})'H) =-\frac{1}{n}\operatorname{tr}(X^{-1}H X^{-1}H).
$$

So

$$
u''(t)+(u'(t))^2 = -\frac{1}{n}\operatorname{tr}(X^{-1}H X^{-1}H) +\frac{1}{n^2}\big(\operatorname{tr}(X^{-1}H)\big)^2.
$$

Therefore

$$
g''(t)=g(t)\left[ \frac{1}{n^2}\big(\operatorname{tr}(X^{-1}H)\big)^2 -\frac{1}{n}\operatorname{tr}(X^{-1}H X^{-1}H) \right].
$$

Thus it suffices to prove the inequality

 $$
\boxed{\ \big(\operatorname{tr}(X^{-1}H)\big)^2 \ \le\ n\,\operatorname{tr}(X^{-1}H X^{-1}H)\ }.
$$

Step B3: Reduce to scalar Cauchy–Schwarz on eigenvalues
-------------------------------------------------------

Let

$$
M:=X^{-1/2}HX^{-1/2}.
$$

Then  $M$  is symmetric, and by cyclicity of trace:

$$
\operatorname{tr}(X^{-1}H)=\operatorname{tr}(X^{-1/2}HX^{-1/2})=\operatorname{tr}(M),
$$
 
$$
\operatorname{tr}(X^{-1}H X^{-1}H)=\operatorname{tr}\big((X^{-1/2}HX^{-1/2})^2\big)=\operatorname{tr}(M^2).
$$

So the desired inequality becomes

$$
(\operatorname{tr}M)^2 \le n\,\operatorname{tr}(M^2).
$$

Diagonalize  $M$ : eigenvalues  $\mu_1,\dots,\mu_n\in\mathbb R$ . Then

$$
\operatorname{tr}M=\sum_{i=1}^n \mu_i, \qquad \operatorname{tr}(M^2)=\sum_{i=1}^n \mu_i^2.
$$

Apply scalar Cauchy–Schwarz:

$$
\left(\sum_{i=1}^n \mu_i\right)^2 \le \left(\sum_{i=1}^n 1^2\right)\left(\sum_{i=1}^n \mu_i^2\right) = n\sum_{i=1}^n \mu_i^2.
$$

So the inequality holds, hence the bracket in  $g''(t)$  is  $\le 0$ , so

$$
g''(t)\le 0.
$$

Step B4: Conclude concavity
---------------------------

Since  $g(t)=\phi(X+tH)$  has  $g''(t)\le 0$  along every line in the domain,

 $$
\boxed{\ (\det X)^{1/n}\ \text{is concave on }\mathbf S_{++}^n\ }.
$$

This completes Exercise 3.18(b). [seas.ucla.edu](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

* * *

Optional corollary (since it’s the classic punchline): Minkowski determinant inequality
=======================================================================================

From concavity of  $\phi(X)=(\det X)^{1/n}$  and its **positive homogeneity**  $\phi(tX)=t\phi(X)$  for  $t>0$ , we get superadditivity:

$$
\phi(X+Y)\ge \phi(X)+\phi(Y)\quad(X,Y\succ 0),
$$

because

$$
\phi\!\left(\frac{X+Y}{2}\right)\ge \frac{\phi(X)+\phi(Y)}{2} \quad\Rightarrow\quad \frac{1}{2}\phi(X+Y)\ge \frac{\phi(X)+\phi(Y)}{2}.
$$

So

 $$
\boxed{\ \det(X+Y)^{1/n}\ \ge\ \det(X)^{1/n}+\det(Y)^{1/n}\ }.
$$

* * *

If you want, I can also add the **equality conditions** for each part (when does convexity/concavity become “flat”), which BV-style problems often quietly care about.

## Prompt:
Next prove me problems 3.22, 3.23.

## Response:
Thought for 1m 51s

Below are **Problem/Exercise 3.22 and 3.23** (as they appear in your document) and **full, from-first-principles proofs**. I’m going to be annoyingly explicit about (i) domains, (ii) which composition rule is being used, and (iii) why each inner piece is convex/concave.

* * *

Exercise 3.22 — prove convexity (parts a–e)
-------------------------------------------

### What you must prove (statements)

**(a)**

$$
f(x)= -\log\!\Big(-\log\big(\textstyle\sum_{i=1}^m e^{a_i^\top x+b_i}\big)\Big), \qquad \text{dom: }\sum_{i=1}^m e^{a_i^\top x+b_i}<1.
$$

**(b)**

$$
f(x,u,v)= -\sqrt{uv-x^\top x}, \qquad \text{dom: }u>0,\ v>0,\ uv>x^\top x.
$$

**(c)**

$$
f(x,u,v)= -\log(uv-x^\top x), \qquad \text{dom: }u>0,\ v>0,\ uv>x^\top x.
$$

**(d)**

$$
f(x,t)=-(t^p-\|x\|_p^p)^{1/p}\quad (p>1), \qquad \text{dom: }t\ge \|x\|_p.
$$

**(e)**

$$
f(x,t)= -\log(t^p-\|x\|_p^p)\quad (p>1), \qquad \text{dom: }t>\|x\|_p.
$$

* * *

Two “meta weapons” you’ll use repeatedly
----------------------------------------

### Lemma A — convex + coordinatewise nondecreasing outer ∘ convex inner ⇒ convex

Let  $\phi:\mathbb{R}^k\to\mathbb{R}\cup\{+\infty\}$  be **convex** and **nondecreasing in each argument**.  
Let  $g:\mathbb{R}^n\to\mathbb{R}^k$  with components  $g_i$  all **convex**.  
Define  $h(x)=\phi(g(x))$ . Then  $h$  is convex.

**Proof (pure Jensen, no magic):** take  $x,y$  and  $\theta\in[0,1]$ .

1.  Convexity of each  $g_i$ :
    $$
    g_i(\theta x+(1-\theta)y)\le \theta g_i(x)+(1-\theta)g_i(y).
    $$
    So as vectors:
    $$
    g(\theta x+(1-\theta)y)\preceq \theta g(x)+(1-\theta)g(y)
    $$
    (componentwise).
2.   $\phi$  is nondecreasing componentwise, so applying  $\phi$  preserves the inequality:
    $$
    \phi(g(\theta x+(1-\theta)y))\le \phi(\theta g(x)+(1-\theta)g(y)).
    $$
3.  Now use convexity of  $\phi$ :
    $$
    \phi(\theta g(x)+(1-\theta)g(y))\le \theta \phi(g(x))+(1-\theta)\phi(g(y)).
    $$

Chain them:  $h(\theta x+(1-\theta)y)\le \theta h(x)+(1-\theta)h(y)$ . ✅

* * *

### Lemma B — convex + coordinatewise nonincreasing outer ∘ concave inner ⇒ convex

Let  $\phi:\mathbb{R}^k\to\mathbb{R}\cup\{+\infty\}$  be **convex** and **nonincreasing in each argument**.  
Let  $g:\mathbb{R}^n\to\mathbb{R}^k$  with components  $g_i$  all **concave**.  
Then  $h(x)=\phi(g(x))$  is convex.

**Proof (again Jensen):** take  $x,y,\theta$ .

1.  Concavity of each  $g_i$  gives
    $$
    g(\theta x+(1-\theta)y)\succeq \theta g(x)+(1-\theta)g(y).
    $$
2.  Since  $\phi$  is **nonincreasing**, inequality reverses when applying  $\phi$ :
    $$
    \phi(g(\theta x+(1-\theta)y))\le \phi(\theta g(x)+(1-\theta)g(y)).
    $$
3.  Convexity of  $\phi$  finishes as before:
    $$
    \phi(\theta g(x)+(1-\theta)g(y))\le \theta\phi(g(x))+(1-\theta)\phi(g(y)).
    $$

So  $h$  is convex. ✅

Keep these two lemmas taped to your forehead.

* * *

3.22(a)  $ -\log(-\log(\sum e^{\cdot}))$ 
=========================================

Let

$$
s(x)=\sum_{i=1}^m e^{a_i^\top x+b_i},\qquad u(x)=\log s(x).
$$

### Step 1:  $u(x)=\log\sum e^{a_i^\top x+b_i}$  is convex

This is the classic **log-sum-exp** convexity. One clean “from structure” argument:

*   Each  $x\mapsto a_i^\top x+b_i$  is affine.
*    $t\mapsto e^t$  is convex and increasing, so  $x\mapsto e^{a_i^\top x+b_i}$  is convex.
*   Sum of convex is convex:  $s(x)$  is convex.
*   Now:  $\log(\cdot)$  is concave, so you **cannot** simply say “log of convex is convex.”  
    Instead, log-sum-exp is special: it’s a smooth convex function with PSD Hessian (it equals a covariance matrix of the softmax weights). That’s the standard proof route.

So  $u$  is convex.

### Step 2: domain forces  $u(x)<0$ 

Given  $\sum e^{a_i^\top x+b_i}<1$ , we have  $s(x)<1$  hence  $u(x)=\log s(x)<0$ . This matters because we will apply  $\log$  again to  $-u$ .

### Step 3: outer function  $g(u)=-\log(-u)$  is convex and increasing on  $u<0$ 

Compute derivatives for  $u<0$ :

$$
g(u)=-\log(-u),\quad g'(u)=\frac{1}{-u}=-\frac{1}{u}>0,\quad g''(u)=\frac{1}{u^2}>0.
$$

So  $g$  is **convex** and **increasing** on  $(-\infty,0)$ .

### Step 4: compose

We have  $f(x)=g(u(x))$ . Since  $g$  is convex + increasing and  $u$  is convex, Lemma A applies (with  $k=1$ ). Therefore  $f$  is convex on its domain. ✅

* * *

3.22(b)  $ -\sqrt{uv-x^\top x}$ 
================================

We want convexity on  $u>0,\ v>0,\ uv>x^\top x$ . The domain ensures the square root sees a positive number.

### Step 1: the key factorization

Define

$$
r(x,u,v):=v-\frac{x^\top x}{u}.
$$

Then

$$
uv-x^\top x = u\Big(v-\frac{x^\top x}{u}\Big)=u\,r(x,u,v).
$$

This exact algebra is in your notes.

### Step 2: show  $r$  is concave

*   The function  $(x,u)\mapsto \dfrac{x^\top x}{u}$  on  $u>0$  is **convex** (this is the “quadratic-over-linear” form; it’s precisely Exercise 3.23(b) in a base form).
*   Therefore  $-(x^\top x)/u$  is **concave**.
*   Adding  $v$  (affine) preserves concavity.  
    So  $r$  is concave on  $u>0$ .

### Step 3: the outer map  $\phi(a,b)=-\sqrt{ab}$  is convex and nonincreasing on  $\mathbb{R}_{++}^2$ 

*   The geometric mean  $\sqrt{ab}$  is **concave** on  $a>0,b>0$  (standard fact; equivalently  $\log\sqrt{ab}=\tfrac12(\log a+\log b)$  is concave, plus homogeneity gives concavity).
*   Negative of a concave function is convex, hence  $-\sqrt{ab}$  is convex.
*   Monotonicity: increasing  $a$  or  $b$  increases  $\sqrt{ab}$ , so  $-\sqrt{ab}$  **decreases** in each argument ⇒ coordinatewise nonincreasing.

### Step 4: compose using Lemma B

We have

$$
f(x,u,v)= -\sqrt{u\,r(x,u,v)}=\phi\big(u,\ r(x,u,v)\big)
$$

as stated in the file.

*   Outer  $\phi$ : convex + nonincreasing in each argument.
*   Inner arguments:  $u$  is affine (so also concave), and  $r$  is concave.

By Lemma B,  $f$  is convex on the domain. ✅

* * *

3.22(c)  $ -\log(uv-x^\top x)$ 
===============================

Same domain and same factorization:

$$
uv-x^\top x=u\,r(x,u,v),\qquad r=v-\frac{x^\top x}{u}>0
$$

.

Then

$$
-\log(uv-x^\top x)= -\log u -\log r(x,u,v)
$$

.

Now check each term:

1.   $-\log u$  is convex on  $u>0$ .
2.  The scalar map  $-\log(\cdot)$  is convex and **nonincreasing** on  $\mathbb{R}_{++}$ .
3.   $r(x,u,v)$  is concave and positive (Step 2 above).

So  $-\log(r(x,u,v))$  is convex by Lemma B (outer convex nonincreasing, inner concave).  
Sum of convex functions is convex ⇒  $f$  convex. ✅

This is exactly the logic summarized in your file.

* * *

3.22(d)  $-(t^p-\|x\|_p^p)^{1/p}$ ,  $p>1$ 
===========================================

Statement + domain are exactly.

### Step 1: introduce the convex perspective piece  $q(x,t)=\|x\|_p^p/t^{p-1}$ 

Define for  $t>0$ :

$$
q(x,t)=\frac{\|x\|_p^p}{t^{p-1}}.
$$

This is referenced explicitly and will be proved in **Exercise 3.23(a)** below.

### Step 2: build a concave inner expression

Let

$$
r(x,t)=t-q(x,t)=t-\frac{\|x\|_p^p}{t^{p-1}}.
$$

Affine minus convex = concave, so  $r$  is concave on  $t>0$ .

On the domain  $t\ge \|x\|_p$ , we have  $\|x\|_p^p\le t^p$ , hence

$$
q(x,t)=\frac{\|x\|_p^p}{t^{p-1}}\le \frac{t^p}{t^{p-1}}=t \Rightarrow r(x,t)\ge 0
$$

.

### Step 3: factor  $t^p-\|x\|_p^p$ 

$$
t^p-\|x\|_p^p=t^{p-1}\,r(x,t)
$$

.

So

$$
(t^p-\|x\|_p^p)^{1/p} =\big(t^{p-1}r(x,t)\big)^{1/p} =t^{(p-1)/p}\,r(x,t)^{1/p}.
$$

.

Thus

$$
f(x,t)= -t^{(p-1)/p}\,r(x,t)^{1/p}.
$$

### Step 4: outer map is convex & nonincreasing

Define

$$
\Phi(a,b)=-a^{(p-1)/p}b^{1/p},\quad a>0,b>0.
$$

This is in the file.

*    $a^{(p-1)/p}b^{1/p}$  is a **weighted geometric mean** (weights sum to 1), hence concave on  $\mathbb{R}_{++}^2$ .
*   Negative of concave is convex ⇒  $\Phi$  is convex.
*   Increasing  $a$  or  $b$  increases  $a^{(p-1)/p}b^{1/p}$ , so  $\Phi$  is coordinatewise **nonincreasing**.

### Step 5: compose using Lemma B

We have  $f(x,t)=\Phi(t,r(x,t))$  with:

*    $t$  affine (thus concave),
*    $r$  concave,
*    $\Phi$  convex nonincreasing.

Hence  $f$  is convex on the domain. ✅

* * *

3.22(e)  $-\log(t^p-\|x\|_p^p)$ ,  $p>1$ 
=========================================

Domain:  $t>\|x\|_p$  so the log argument is strictly positive.

Use the same factorization  $t^p-\|x\|_p^p=t^{p-1}r(x,t)$  and rewrite:

$$
-\log(t^p-\|x\|_p^p)=-(p-1)\log t-\log r(x,t).
$$

This is exactly in the file.

*    $-\log t$  convex on  $t>0$  ⇒  $-(p-1)\log t$  convex.
*    $-\log(\cdot)$  convex and nonincreasing on  $\mathbb{R}_{++}$ .
*    $r(x,t)$  concave and positive on the domain.

So  $-\log r(x,t)$  is convex by Lemma B; sum is convex. ✅

* * *

* * *

Exercise 3.23 — the “perspective / quadratic-over-linear” engine
----------------------------------------------------------------

### 3.23(a) Prove  $F(x,t)=\|x\|_p^p/t^{p-1}$  is convex on  $t>0$ 

Your document explicitly identifies this as the **perspective** of  $\phi(x)=\|x\|_p^p$  and shows the algebra:

$$
\tilde\phi(x,t)=t\,\phi(x/t)=\frac{\|x\|_p^p}{t^{p-1}}.
$$

.

So we need two facts:

1.   $\phi(x)=\|x\|_p^p=\sum_i |x_i|^p$  is convex for  $p\ge 1$ .  
    (Reason: each scalar  $u\mapsto |u|^p$  is convex for  $p\ge 1$ ; sum preserves convexity.)
2.  **Perspective theorem (prove it):** if  $\phi$  is convex, then
    $$
    \tilde\phi(z,t)=t\,\phi(z/t)\quad (t>0)
    $$
    is convex in  $(z,t)$ .

#### Proof of the perspective theorem (Jensen, “surgical”)

Take  $(z_1,t_1)$ ,  $(z_2,t_2)$  with  $t_1,t_2>0$ , and  $\theta\in[0,1]$ . Let

$$
(z,t)=\theta(z_1,t_1)+(1-\theta)(z_2,t_2)=(\theta z_1+(1-\theta)z_2,\ \theta t_1+(1-\theta)t_2).
$$

Define weights

$$
\alpha=\frac{\theta t_1}{t},\qquad \beta=\frac{(1-\theta)t_2}{t}.
$$

Then  $\alpha,\beta\ge 0$  and  $\alpha+\beta=1$ . Also the key identity holds:

$$
\frac{z}{t}=\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}.
$$

Now apply convexity of  $\phi$ :

$$
\phi(z/t)\le \alpha\phi(z_1/t_1)+\beta\phi(z_2/t_2).
$$

Multiply by  $t>0$ :

$$
t\phi(z/t)\le t\alpha\phi(z_1/t_1)+t\beta\phi(z_2/t_2) =\theta t_1\phi(z_1/t_1)+(1-\theta)t_2\phi(z_2/t_2).
$$

That is exactly

$$
\tilde\phi(z,t)\le \theta\tilde\phi(z_1,t_1)+(1-\theta)\tilde\phi(z_2,t_2),
$$

so  $\tilde\phi$  is convex. ✅

Applying this with  $\phi(x)=\|x\|_p^p$  gives convexity of

$$
F(x,t)=\frac{\|x\|_p^p}{t^{p-1}}\quad\text{on }t>0.
$$

This is exactly the conclusion stated in your file.

* * *

### 3.23(b) Quadratic-over-linear with affine maps

**Statement (from your document):**

$$
f(x)=\frac{\|Ax+b\|_2^2}{c^\top x+d} \quad\text{is convex on}\quad \{x:\ c^\top x+d>0\}.
$$

#### Proof 1 (perspective + affine composition)

Define base convex function  $\phi(u)=\|u\|_2^2$ . Its perspective is

$$
\tilde\phi(u,y)=y\,\phi(u/y)=\frac{\|u\|_2^2}{y},\quad y>0,
$$

so  $\psi(u,y)=\|u\|_2^2/y$  is convex jointly in  $(u,y)$  for  $y>0$ .

Now set the affine maps

$$
u(x)=Ax+b,\qquad y(x)=c^\top x+d.
$$

On the domain,  $y(x)>0$ , and

$$
f(x)=\psi(u(x),y(x)).
$$

Convex function composed with an affine map is convex (direct Jensen argument), so  $f$  is convex on  $c^\top x+d>0$ . ✅

#### Proof 2 (epigraph is a rotated SOC)

Write the epigraph condition:

$$
f(x)\le t \iff \|Ax+b\|_2^2 \le (c^\top x+d)\,t,\quad c^\top x+d>0.
$$

The set  $\{(u,y,t): \|u\|_2^2\le yt,\ y>0\}$  is a **rotated second-order cone**, hence convex; composing with affine  $u=Ax+b, y=c^\top x+d$  preserves convexity. ✅  
(This is also summarized in your file.)

* * *

What you should “mentally cache” from 3.22–3.23
-----------------------------------------------

1.  **Quadratic-over-linear** and  $\|x\|_p^p/t^{p-1}$  are **perspectives**. Perspective preserves convexity.  
    (Your file literally computes the perspective into that closed form.)
2.  Most scary expressions are beaten by:
    *   factoring (e.g.,  $uv-x^\top x=u(v-x^\top x/u)$ ),
    *   identifying one piece as convex (or concave),
    *   then using **Lemma A / Lemma B** depending on whether the outer map is increasing or decreasing.
3.  Domains are not decoration: logs and roots enforce strict positivity in exactly the places shown in the problem statements.

* * *

If you want the next layer of brutality: I can also re-prove (from scratch) the two “atoms” we used but treated as known facts:

*   convexity of log-sum-exp via Hessian = covariance (fully expanded),
*   concavity of weighted geometric mean (via log + homogeneity, with all steps).

## Prompt:
Do not miss the domain parts of the proofs"

Cool — **Problem 3.20 (not Example 3.20)** is the exercise titled **“Composition with an affine function”**. It has **three parts (a)(b)(c)**, and each asks you to prove a function is convex. ([seas.ucla.edu][1])

I’ll first state the problem cleanly (verbatim math), then prove each part **from first principles**, step-by-step.

---

# Problem 3.20 — Composition with an affine function

Show the following functions (f:\mathbb R^n\to\mathbb R) are **convex**: ([seas.ucla.edu][1])

**(a)**
[
f(x)=|Ax-b|
]
where (A\in\mathbb R^{m\times n}), (b\in\mathbb R^m), and (|\cdot|) is a norm on (\mathbb R^m). ([seas.ucla.edu][1])

**(b)**
[
f(x)= -\Big(\det(A_0+x_1A_1+\cdots+x_nA_n)\Big)^{1/m},
]
on the domain
[
{x\mid A_0+x_1A_1+\cdots+x_nA_n \succ 0},
]
where (A_i\in \mathbf S^m) (symmetric (m\times m)). ([seas.ucla.edu][1])

**(c)**
[
f(x)=\operatorname{tr}\Big(A_0+x_1A_1+\cdots+x_nA_n\Big)^{-1},
]
on the domain
[
{x\mid A_0+x_1A_1+\cdots+x_nA_n \succ 0},
]
with (A_i\in\mathbf S^m). (You may use that (\operatorname{tr}(X^{-1})) is convex on (\mathbf S^m_{++}); see Exercise 3.18.) ([seas.ucla.edu][1])

---

# The one meta-theorem powering all parts

## Lemma (Affine precomposition preserves convexity)

Let (g:\mathbb R^p\to\mathbb R\cup{+\infty}) be convex, and let (\phi(x)=Fx+g_0) be an affine map. Define
[
h(x)=g(\phi(x)).
]
Then (h) is convex on ({x\mid \phi(x)\in\mathrm{dom},g}).

### Proof (pure Jensen, no magic)

Take any (x,y) in the domain and (\theta\in[0,1]). Because (\phi) is affine,
[
\phi(\theta x+(1-\theta)y)=\theta\phi(x)+(1-\theta)\phi(y).
]
Now use convexity of (g):
[
g(\phi(\theta x+(1-\theta)y))
= g(\theta\phi(x)+(1-\theta)\phi(y))
\le \theta g(\phi(x))+(1-\theta)g(\phi(y)).
]
That is
[
h(\theta x+(1-\theta)y)\le \theta h(x)+(1-\theta)h(y),
]
so (h) is convex.

Keep this lemma loaded in RAM; we’ll reuse it three times.

---

# (a) (f(x)=|Ax-b|) is convex

## Step 1: The norm itself is convex

A norm (|\cdot|) satisfies triangle inequality and absolute homogeneity:

* (|u+v|\le |u|+|v|)
* (|\alpha u|=|\alpha||u|).

Take any (u,v\in\mathbb R^m), (\theta\in[0,1]). Then
[
|\theta u+(1-\theta)v|
\le |\theta u|+|(1-\theta)v|
= \theta|u|+(1-\theta)|v|.
]
So (g(u)=|u|) is convex.

## Step 2: Compose with an affine map

The map (\phi(x)=Ax-b) is affine. So by the lemma above,
[
f(x)=g(\phi(x))=|Ax-b|
]
is convex. This proves (a). ([seas.ucla.edu][1])

**Intuition:** norms are “convex bowls” in (\mathbb R^m); (x\mapsto Ax-b) just re-coordinates space and shifts it.

---

# (b) (f(x)=-(\det(\cdot))^{1/m}) is convex on the SPD domain

Define the affine matrix-valued map
[
S(x)=A_0+\sum_{i=1}^n x_i A_i.
]
The domain is exactly (S(x)\succ 0), i.e., (S(x)\in \mathbf S^m_{++}). ([seas.ucla.edu][1])

## Step 1: Identify the outer function and its curvature

Let
[
g(X)= -(\det X)^{1/m}, \qquad X\in \mathbf S^m_{++}.
]

Now use the known fact (proved earlier / in exercises):
[
(\det X)^{1/m}\ \text{is concave on } \mathbf S^m_{++}.
]
This is exactly Exercise 3.18(b): “(f(X)=(\det X)^{1/n}) is concave on (\mathbf S^n_{++})” (same statement, just rename (n\to m)). ([seas.ucla.edu][1])

If (\varphi) is concave, then (-\varphi) is convex. Therefore (g(X)=-(\det X)^{1/m}) is **convex** on (\mathbf S^m_{++}).

## Step 2: Compose convex (g) with affine (S(x))

We have
[
f(x)=g(S(x)) = -(\det S(x))^{1/m}.
]
Since (S) is affine and (g) is convex on (\mathbf S^m_{++}), the affine precomposition lemma gives: (f) is convex on ({x\mid S(x)\in\mathbf S^m_{++}}), i.e. on the stated domain. ([seas.ucla.edu][1])

**Intuition:** ((\det X)^{1/m}) is the “geometric mean of eigenvalues” (a volume-like quantity), which is concave on SPD; negating it flips it into a convex penalty.

---

# (c) (f(x)=\operatorname{tr}(S(x)^{-1})) is convex on the SPD domain

Same (S(x)=A_0+\sum x_iA_i), domain (S(x)\succ 0). ([seas.ucla.edu][1])

## Step 1: Outer function is convex on SPD matrices

Define
[
g(X)=\operatorname{tr}(X^{-1}),\qquad X\in\mathbf S^m_{++}.
]
You are explicitly allowed to use the fact that (g) is convex on (\mathbf S^m_{++}); the problem points you to Exercise 3.18(a) for this. ([seas.ucla.edu][1])

So: (g) is convex on its domain.

## Step 2: Compose with affine map (S(x))

Since (S) is affine,
[
f(x)=g(S(x))=\operatorname{tr}(S(x)^{-1})
]
is convex on ({x\mid S(x)\in\mathbf S^m_{++}}), i.e., on the stated domain. ([seas.ucla.edu][1])

**Intuition:** inversion (X\mapsto X^{-1}) is a “curving” operation that is convex in the PSD order sense, and trace is linear; together (\mathrm{tr}(X^{-1})) becomes a convex “barrier-like” penalty that explodes near singularity.

---

# Final takeaway (what Problem 3.20 is *teaching*)

All three are the same template:

1. Prove/know a function (g) is convex in some variable (u) (vector or matrix).
2. Recognize your target is (f(x)=g(\text{affine}(x))).
3. Conclude convexity by affine precomposition.

That is literally why the problem is named “composition with an affine function.” ([seas.ucla.edu][1])

---

If you want to go one level deeper: I can also **prove** the two “allowed facts” used in (b) and (c) (concavity of ((\det X)^{1/m}), convexity of (\mathrm{tr}(X^{-1}))) from scratch using epigraphs / matrix inequalities / second derivatives—whichever you prefer.

[1]: https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf "book.dvi"

## Response:
You’re right to call this out. In convex analysis, **domains are part of the theorem**, not footnotes. Below is the same **Problem 3.20** proof, rewritten so that **every time we use Jensen/convexity, we explicitly verify the convex combination stays in the domain**.

I’ll keep the core lemma, but I’ll state it with a domain check built in.

* * *

Problem 3.20 — Composition with an affine function (with domain handled explicitly)
===================================================================================

Master lemma (Affine precomposition preserves convexity, with domain proof)
---------------------------------------------------------------------------

Let  $g:\mathbb R^p\to \mathbb R\cup\{+\infty\}$  be convex with domain  $\mathrm{dom}\,g\subseteq\mathbb R^p$ .  
Let  $\phi:\mathbb R^n\to\mathbb R^p$  be affine:  $\phi(x)=Fx+g_0$ .  
Define

$$
h(x)=g(\phi(x)).
$$

Then:

1.  **Domain of  $h$ ** is
    
$$
\mathrm{dom}\,h=\{x\in\mathbb R^n:\phi(x)\in\mathrm{dom}\,g\}.
$$
2.   $h$  is **convex on  $\mathrm{dom}\,h$ **, meaning: for all  $x,y\in\mathrm{dom}\,h$  and  $\theta\in[0,1]$ ,
    *   first we must have  $\theta x+(1-\theta)y\in\mathrm{dom}\,h$ ,
*   and then the Jensen inequality holds:
    
$$
h(\theta x+(1-\theta)y)\le \theta h(x)+(1-\theta)h(y).
$$

### Proof (including domain closure under convex combinations)

Take any  $x,y\in\mathrm{dom}\,h$ . By definition of the domain,  $\phi(x),\phi(y)\in\mathrm{dom}\,g$ .

Because  $g$  is convex, its domain  $\mathrm{dom}\,g$  is a **convex set** (standard fact: if  $g$  is convex, then for any two points where it is finite, it is finite along the segment). Concretely:

$$
\phi(x),\phi(y)\in\mathrm{dom}\,g \ \Rightarrow\ \theta\phi(x)+(1-\theta)\phi(y)\in\mathrm{dom}\,g.
$$

Now use that  $\phi$  is affine:

$$
\phi(\theta x+(1-\theta)y)=\theta\phi(x)+(1-\theta)\phi(y)\in\mathrm{dom}\,g.
$$

Therefore  $\theta x+(1-\theta)y\in\mathrm{dom}\,h$ . ✅  
(That’s the domain part.)

Now convexity of  $g$  gives:

$$
g(\phi(\theta x+(1-\theta)y)) = g(\theta\phi(x)+(1-\theta)\phi(y)) \le \theta g(\phi(x))+(1-\theta)g(\phi(y)).
$$

This is exactly

$$
h(\theta x+(1-\theta)y)\le \theta h(x)+(1-\theta)h(y).
$$

So  $h$  is convex on its domain. ✅

* * *

(a)  $f(x)=\|Ax-b\|$ 
=====================

Domain
------

A norm  $\|\cdot\|$  is finite everywhere on  $\mathbb R^m$ , so  $\mathrm{dom}\,\|\cdot\|=\mathbb R^m$ .  
The affine map  $x\mapsto Ax-b$  hits  $\mathbb R^m$  for all  $x$ . Hence

$$
\mathrm{dom}\,f=\mathbb R^n.
$$

This domain is convex automatically.

Convexity
---------

Let  $x,y\in\mathbb R^n$ ,  $\theta\in[0,1]$ . Define

$$
u=Ax-b,\qquad v=Ay-b.
$$

Then

$$
A(\theta x+(1-\theta)y)-b=\theta(Ax-b)+(1-\theta)(Ay-b)=\theta u+(1-\theta)v.
$$

Now use convexity of the norm (triangle + homogeneity):

$$
\|\theta u+(1-\theta)v\| \le \theta\|u\|+(1-\theta)\|v\|.
$$

So

$$
f(\theta x+(1-\theta)y)\le \theta f(x)+(1-\theta)f(y).
$$

Thus  $f$  is convex on  $\mathbb R^n$ . ✅

(Here domain checking was trivial because it’s all-space.)

* * *

(b)  $f(x)=-(\det S(x))^{1/m}$  with  $S(x)=A_0+\sum_{i=1}^n x_iA_i$ 
=====================================================================

Domain (must be stated and checked)
-----------------------------------

The function  $\det(X)^{1/m}$  is only real/finite and well-behaved (and the concavity theorem holds) on **SPD matrices**:

$$
\mathbf S_{++}^m=\{X\in\mathbf S^m:\ X\succ 0\}.
$$

So define

$$
\mathrm{dom}\,f=\{x\in\mathbb R^n:\ S(x)\succ 0\}.
$$

### Domain convexity check (crucial)

Take  $x,y\in\mathrm{dom}\,f$ . Then  $S(x)\succ 0$  and  $S(y)\succ 0$ .

For any  $\theta\in[0,1]$ ,

$$
S(\theta x+(1-\theta)y) = A_0+\sum_i(\theta x_i+(1-\theta)y_i)A_i = \theta S(x)+(1-\theta)S(y).
$$

A convex combination of SPD matrices is SPD:

*   because for any nonzero  $v$ ,
    
$$
v^\top[\theta S(x)+(1-\theta)S(y)]v =\theta v^\top S(x)v+(1-\theta)v^\top S(y)v >0,
$$

since each term is  $>0$ .  
So  $S(\theta x+(1-\theta)y)\succ 0$ . Hence  $\mathrm{dom}\,f$  is convex. ✅

Convexity inequality
--------------------

We use the fact (Exercise 3.18(b) that you already had us prove) that

$$
X\mapsto (\det X)^{1/m}\ \text{is concave on }\mathbf S_{++}^m.
$$

Therefore

$$
g(X):=-(\det X)^{1/m}
$$

is **convex** on  $\mathbf S_{++}^m$ , with domain  $\mathbf S_{++}^m$ .

Now take  $x,y\in\mathrm{dom}\,f$  and  $\theta\in[0,1]$ . We already checked  $S(\theta x+(1-\theta)y)\succ 0$ , so everything below is well-defined.

Then:

$$
\begin{aligned} f(\theta x+(1-\theta)y) &= g(S(\theta x+(1-\theta)y)) \\ &= g(\theta S(x)+(1-\theta)S(y)) \\ &\le \theta g(S(x))+(1-\theta)g(S(y)) \quad (\text{convexity of }g) \\ &= \theta f(x)+(1-\theta)f(y). \end{aligned}
$$

So  $f$  is convex on  $\{x: S(x)\succ 0\}$ . ✅

* * *

(c)  $f(x)=\operatorname{tr}(S(x)^{-1})$  on  $S(x)\succ 0$ 
============================================================

Same  $S(x)=A_0+\sum x_iA_i$ .

Domain (must be stated and checked)
-----------------------------------

Matrix inverse exists iff  $S(x)$  is nonsingular; for symmetric matrices, the natural convex-analysis domain for  $X\mapsto \operatorname{tr}(X^{-1})$  is again:

$$
\mathrm{dom}\,f=\{x:\ S(x)\succ 0\}.
$$

### Domain convexity check

Exactly as in (b): if  $S(x)\succ 0$  and  $S(y)\succ 0$ , then

$$
S(\theta x+(1-\theta)y)=\theta S(x)+(1-\theta)S(y)\succ 0,
$$

so the domain is convex. ✅

Convexity inequality
--------------------

Use Exercise 3.18(a): the outer function

$$
g(X)=\operatorname{tr}(X^{-1})
$$

is **convex on  $\mathbf S_{++}^m$ **.

Now take  $x,y\in\mathrm{dom}\,f$  and  $\theta\in[0,1]$ . Domain check already gives  $S(\theta x+(1-\theta)y)\succ 0$ . Then:

$$
\begin{aligned} f(\theta x+(1-\theta)y) &= g(S(\theta x+(1-\theta)y)) \\ &= g(\theta S(x)+(1-\theta)S(y)) \\ &\le \theta g(S(x))+(1-\theta)g(S(y)) \\ &= \theta f(x)+(1-\theta)f(y). \end{aligned}
$$

So  $f$  is convex on  $\{x: S(x)\succ 0\}$ . ✅

* * *

What changed vs the earlier answer (the “domain honesty” checklist)
===================================================================

For each part we explicitly did:

1.  **State  $\mathrm{dom}\,f$ **.
2.  Pick  $x,y\in\mathrm{dom}\,f$  and show ** $\theta x+(1-\theta)y\in\mathrm{dom}\,f$ ** before using Jensen.
3.  Only then apply convexity of the outer function.

That’s the right hygiene.

* * *

If you want the same treatment for **3.22 / 3.23**, I can rewrite those proofs with full domain closure checks (especially the log / sqrt domains where people quietly cheat).

## Prompt:
3.22

## Response:
Alright — **Exercise 3.22** again, but this time with **domain checks treated as first-class citizens**: for every part, we will

1.  **state the domain exactly**,
2.  show it is **convex** (i.e., closed under convex combinations), and
3.  only then apply the convexity/composition inequality.

I’ll also be explicit about which composition lemma is being used (monotone increasing vs decreasing outer function).

* * *

Two composition lemmas with domain included
===========================================

These are the workhorses behind 3.22.

Lemma A (convex, nondecreasing outer ∘ convex inner)
----------------------------------------------------

Let  $\phi:\mathbb R^k\to\mathbb R\cup\{+\infty\}$  be convex and **nondecreasing in each coordinate** on its domain  $\mathrm{dom}\,\phi$ .  
Let  $g:\mathbb R^n\to\mathbb R^k$  have components  $g_i$  convex on a convex set  $D\subseteq\mathbb R^n$ .  
Assume  $g(D)\subseteq \mathrm{dom}\,\phi$ .  
Then  $h(x)=\phi(g(x))$  is convex on  $D$ .

**Domain note:** The condition  $g(D)\subseteq\mathrm{dom}\,\phi$  is the domain check: it guarantees  $h$  is well-defined on  $D$ .

Lemma B (convex, nonincreasing outer ∘ concave inner)
-----------------------------------------------------

Let  $\phi:\mathbb R^k\to\mathbb R\cup\{+\infty\}$  be convex and **nonincreasing in each coordinate** on its domain.  
Let  $g_i$  be concave on a convex set  $D$ , and  $g(D)\subseteq\mathrm{dom}\,\phi$ .  
Then  $h(x)=\phi(g(x))$  is convex on  $D$ .

* * *

Exercise 3.22(a)
================

Function and domain
-------------------

Define

$$
s(x)=\sum_{i=1}^m e^{a_i^\top x+b_i}.
$$

The function is

$$
f(x) = -\log\!\big(-\log(s(x))\big),
$$

with domain

$$
D=\{x\in\mathbb R^n:\ s(x)<1\}.
$$

Why this is the correct domain:

*    $\log(s(x))$  requires  $s(x)>0$ , which is always true because it is a sum of positive exponentials.
*    $-\log(s(x))$  must be  $>0$  to apply the outer  $\log$ , i.e.  $\log(s(x))<0 \iff s(x)<1$ .  
    So  $D$  is exactly the set where  $f$  is real-valued.

Step 1: Domain  $D$  is convex
------------------------------

Take  $x,y\in D$  and  $\theta\in[0,1]$ . We need to show  $s(\theta x+(1-\theta)y)<1$ .

Each term  $x\mapsto e^{a_i^\top x+b_i}$  is **convex** because it is  $\exp$  composed with an affine function. Sum preserves convexity, so  $s$  is convex. Therefore

$$
s(\theta x+(1-\theta)y)\le \theta s(x)+(1-\theta)s(y).
$$

Since  $s(x)<1$  and  $s(y)<1$ , the RHS is a convex combination of numbers  $<1$ , hence  $<1$ . So

$$
s(\theta x+(1-\theta)y)<1.
$$

Thus  $\theta x+(1-\theta)y\in D$ . ✅ Domain is convex.

Step 2: Convexity of the expression
-----------------------------------

Define  $u(x)=\log s(x)$ . The known fact (can be proved via Hessian-as-covariance) is that  $u$  is convex:  $u$  is the **log-sum-exp** function.

Now define the scalar outer function

$$
\phi(u)=-\log(-u),\qquad u<0.
$$

Check curvature + monotonicity on its domain  $(-\infty,0)$ :

$$
\phi'(u)= -\frac{1}{u}>0,\qquad \phi''(u)=\frac{1}{u^2}>0.
$$

So  $\phi$  is **convex** and **increasing** on  $u<0$ .

Domain check for composition: on  $D$ , we have  $s(x)<1\Rightarrow u(x)=\log s(x)<0$ , so indeed  $u(D)\subset(-\infty,0)=\mathrm{dom}\,\phi$ .

Now apply Lemma A (convex increasing outer ∘ convex inner):

$$
f(x)=\phi(u(x))
$$

is convex on  $D$ . ✅

* * *

Exercise 3.22(b)
================

Function and domain
-------------------

$$
f(x,u,v)= -\sqrt{uv-x^\top x}.
$$

Domain:

$$
D=\{(x,u,v): u>0,\ v>0,\ uv>x^\top x\}.
$$

Why: square root requires  $uv-x^\top x>0$ . The extra  $u>0,v>0$  is natural and also forces  $uv>0$ .

Step 1: Domain is convex (important!)
-------------------------------------

Take two points  $(x_1,u_1,v_1)$ ,  $(x_2,u_2,v_2)$  in  $D$ , and  $\theta\in[0,1]$ . Define the convex combination

$$
(x,u,v)=\theta(x_1,u_1,v_1)+(1-\theta)(x_2,u_2,v_2).
$$

Then clearly  $u>0$  and  $v>0$  (convex combination of positive scalars).

We must show:

$$
uv > x^\top x.
$$

This is not “obvious” because  $uv$  is nonlinear — so we do something smarter: rewrite the domain using a known convex function.

### Key identity

For  $u>0$ ,

$$
uv-x^\top x = u\left(v-\frac{x^\top x}{u}\right).
$$

Define

$$
q(x,u)=\frac{x^\top x}{u}\quad (u>0).
$$

Fact:  $q$  is **convex** on  $\{(x,u):u>0\}$  (quadratic-over-linear; it’s the perspective of  $\|x\|_2^2$ , proved in 3.23(b)).  
Hence  $-q$  is concave, and

$$
r(x,u,v):=v-q(x,u)=v-\frac{x^\top x}{u}
$$

is **concave** (affine  $v$  plus concave  $-q$ ).

Now look at the domain condition  $uv>x^\top x$  with  $u>0$ :

$$
uv>x^\top x \iff v-\frac{x^\top x}{u}>0 \iff r(x,u,v)>0.
$$

So equivalently,

$$
D=\{(x,u,v): u>0,\ r(x,u,v)>0\}.
$$

Now check convexity:

*   The set  $\{u>0\}$  is convex.
*   Since  $r$  is concave, its **strict superlevel set**  $\{r>0\}$  is convex: for concave  $r$ ,
    $$
    r(\theta z_1+(1-\theta)z_2)\ge \theta r(z_1)+(1-\theta)r(z_2),
    $$
    and if  $r(z_1)>0$ ,  $r(z_2)>0$ , then RHS  $>0$ , hence LHS  $>0$ .  
    So  $\{r>0\}$  is convex.

Intersection of convex sets is convex, so  $D$  is convex. ✅

Step 2: Convexity of  $f$ 
--------------------------

Using the same factorization:

$$
uv-x^\top x = u\,r(x,u,v).
$$

Define outer function  $\phi(a,b)=-\sqrt{ab}$  on  $\mathbb R_{++}^2$ .

*    $\sqrt{ab}$  (geometric mean) is concave on  $\mathbb R_{++}^2$ , hence  $-\sqrt{ab}$  is convex.
*   It is **nonincreasing** in each coordinate since increasing  $a$  or  $b$  increases  $\sqrt{ab}$ , making  $-\sqrt{ab}$  smaller.

Inner map:  $(x,u,v)\mapsto (u, r(x,u,v))$ .

*    $u$  is affine, hence both concave and convex.
*    $r$  is concave.  
    Domain check for composition: on  $D$  we have  $u>0$  and  $r>0$ , so  $(u,r)\in\mathbb R_{++}^2=\mathrm{dom}\,\phi$ .

Thus by Lemma B (convex nonincreasing outer ∘ concave inner),

$$
f(x,u,v)=\phi\big(u,r(x,u,v)\big)
$$

is convex on  $D$ . ✅

* * *

Exercise 3.22(c)
================

Function and domain
-------------------

$$
f(x,u,v)= -\log(uv-x^\top x), \qquad D=\{(x,u,v): u>0,\ v>0,\ uv>x^\top x\}.
$$

We already proved  $D$  is convex in part (b) (same domain). ✅

Convexity
---------

Again  $uv-x^\top x=u\,r(x,u,v)$  with  $r=v-\frac{x^\top x}{u}$  concave and positive on  $D$ . Then

$$
-\log(uv-x^\top x)= -\log u -\log r(x,u,v).
$$
*    $-\log u$  is convex on  $u>0$ .
*   Outer scalar  $\psi(t)=-\log t$  is convex and **nonincreasing** on  $t>0$ .
*   Inner  $r$  is concave and positive on  $D$ .

Domain check: on  $D$ ,  $r>0$ , so  $\psi(r)$  is well-defined.

By Lemma B,  $-\log r(x,u,v)$  is convex on  $D$ . Sum of convex functions is convex, so  $f$  is convex on  $D$ . ✅

* * *

Exercise 3.22(d)  $p>1$ 
========================

Function and domain
-------------------

$$
f(x,t)=-(t^p-\|x\|_p^p)^{1/p},\qquad p>1,
$$

domain given as

$$
D=\{(x,t): t\ge \|x\|_p\}.
$$

Why: we need  $t^p-\|x\|_p^p\ge 0$  to make the  $1/p$  power real. Since  $p>1$  and  $t\ge 0$  on this set,  $t\ge \|x\|_p$  is exactly equivalent to  $t^p\ge \|x\|_p^p$ .

Step 1: Domain  $D$  is convex
------------------------------

Take  $(x_1,t_1),(x_2,t_2)\in D$ ,  $\theta\in[0,1]$ . Let  $(x,t)=\theta(x_1,t_1)+(1-\theta)(x_2,t_2)$ .

We need to show  $t\ge \|x\|_p$ .

Use:

*   triangle inequality:  $\|x\|_p=\|\theta x_1+(1-\theta)x_2\|_p \le \theta\|x_1\|_p+(1-\theta)\|x_2\|_p$ .
*   and  $t_i\ge \|x_i\|_p$  by membership in  $D$ .

So:

$$
\|x\|_p \le \theta\|x_1\|_p+(1-\theta)\|x_2\|_p \le \theta t_1+(1-\theta)t_2=t.
$$

Hence  $(x,t)\in D$ . ✅ Domain is convex.

Step 2: Rewrite into a composition form with concave inner
----------------------------------------------------------

Define (for  $t>0$ ; note that on  $D$  we can have  $t=0$  only when  $x=0$ ; we’ll handle that edge case at the end):

$$
q(x,t)=\frac{\|x\|_p^p}{t^{p-1}}.
$$

Fact (proved as perspective in 3.23(a)):  $q$  is convex on  $t>0$ .  
Then

$$
r(x,t):=t-q(x,t)=t-\frac{\|x\|_p^p}{t^{p-1}}
$$

is concave on  $t>0$  (affine minus convex).

Also

$$
t^p-\|x\|_p^p = t^{p-1}\,r(x,t),
$$

so

$$
(t^p-\|x\|_p^p)^{1/p} = t^{(p-1)/p}\,r(x,t)^{1/p}.
$$

Hence

$$
f(x,t)= - t^{(p-1)/p}\, r(x,t)^{1/p}.
$$

Define outer  $\Phi(a,b)=-a^{(p-1)/p}b^{1/p}$  on  $\mathbb R_{++}^2$ .

*   Weighted geometric mean  $a^{\alpha}b^{1-\alpha}$  is concave for  $\alpha\in(0,1)$ . Here  $\alpha=\frac{p-1}{p}\in(0,1)$ .
*   So  $\Phi$  is convex.
*   And  $\Phi$  is coordinatewise **nonincreasing** (increasing  $a$  or  $b$  increases the positive product, making the negative smaller).

Inner map:  $(x,t)\mapsto (t, r(x,t))$ .

*    $t$  is affine (concave).
*    $r$  is concave.  
    Domain check: on the interior  $t>\|x\|_p$ , we have  $t>0$  and  $r>0$ , so  $(t,r)\in\mathbb R_{++}^2$ .

Thus on the **interior** of  $D$  we get convexity by Lemma B.

### Edge case: boundary  $t=\|x\|_p$ 

On the boundary,  $t^p-\|x\|_p^p=0$ , so  $f(x,t)=0$ .  
Convexity on the closed set  $D$  follows by taking limits from interior points (since the formula gives a continuous extension down to the boundary and the epigraph remains convex). This is the standard way BV handles closed domains with interior proofs.

So  $f$  is convex on  $D$ . ✅

* * *

Exercise 3.22(e)  $p>1$ 
========================

Function and domain
-------------------

$$
f(x,t)=-\log(t^p-\|x\|_p^p),\qquad p>1,
$$

domain

$$
D=\{(x,t): t>\|x\|_p\}.
$$

Here we need strict inequality because  $\log(0)$  is not finite.

Step 1: Domain is convex
------------------------

Same argument as (d), but with strict inequality:  
If  $t_i>\|x_i\|_p$ , then

$$
\|x\|_p \le \theta\|x_1\|_p+(1-\theta)\|x_2\|_p < \theta t_1+(1-\theta)t_2=t,
$$

so  $t>\|x\|_p$ . ✅ Domain convex.

Step 2: Rewrite and use Lemma B carefully
-----------------------------------------

Use again

$$
t^p-\|x\|_p^p=t^{p-1}r(x,t),\quad r(x,t)=t-\frac{\|x\|_p^p}{t^{p-1}}.
$$

Then

$$
-\log(t^p-\|x\|_p^p)=-(p-1)\log t - \log r(x,t).
$$
*    $-\log t$  is convex on  $t>0$ , hence  $-(p-1)\log t$  is convex.
*    $\psi(s)=-\log s$  is convex and **nonincreasing** on  $s>0$ .
*    $r(x,t)$  is concave (as before) and on  $D$  it is **strictly positive** (equivalent to  $t^p>\|x\|_p^p$ ).

Domain check: on  $D$ ,  $t>0$  and  $r>0$ , so both  $\log t$  and  $\log r$  are valid.

By Lemma B,  $-\log r(x,t)$  is convex. Sum of convex functions is convex, so  $f$  is convex on  $D$ . ✅

* * *

Summary table (domains + why convex)
====================================

*   **(a)**  $D=\{x: \sum e^{a_i^\top x+b_i}<1\}$  is convex because  $s(x)=\sum e^{\cdot}$  is convex and  $D$  is a **strict sublevel set** of a convex function.
*   **(b),(c)**  $D=\{u>0,\ v>0,\ uv>x^\top x\}$  is convex because it equals  $\{u>0,\ r(x,u,v)>0\}$  where  $r=v-\frac{x^\top x}{u}$  is concave (superlevel set of concave is convex).
*   **(d)**  $D=\{t\ge \|x\|_p\}$  convex by triangle inequality and convex combos.
*   **(e)**  $D=\{t> \|x\|_p\}$  convex similarly (strict preserved).

* * *

If you want, I can now do **3.23(a)(b)** with the _same_ domain hygiene (especially the  $t>0$  and rotated-SOC epigraph domains), so you don’t get ambushed later when BV starts mixing “open vs closed” domains in barrier functions.

## Prompt:
3.23

## Response:
Alright — **Exercise 3.23**, with **full domain hygiene** (every time we write an inequality we first prove the point is in the domain).

I’m going to treat 3.23 as the “engine room” behind 3.22(d,e): it’s all about **perspectives** and the **quadratic-over-linear** form.

* * *

Exercise 3.23(a)
================

### Show  $\displaystyle F(x,t)=\frac{\|x\|_p^p}{t^{p-1}}$  is convex (for  $t>0$ )

1) State the function and its domain precisely
----------------------------------------------

Let  $p\ge 1$  (in BV this is the regime where  $\|\cdot\|_p$  is a norm and  $|u|^p$  is convex).

Define

$$
F:\mathbb R^n\times (0,\infty)\to\mathbb R,\qquad F(x,t)=\frac{\|x\|_p^p}{t^{p-1}}.
$$

**Domain:**

$$
\mathrm{dom}\,F=\{(x,t): t>0\}.
$$

Why:  $t^{p-1}$  is in the denominator, so we need  $t\neq 0$ , and BV takes  $t>0$  since this function is a **perspective** (and perspectives are defined for  $t>0$ ).

### Domain convexity check

Take  $(x_1,t_1),(x_2,t_2)\in\mathrm{dom}\,F$  and  $\theta\in[0,1]$ .  
Then  $t_1>0$  and  $t_2>0$ , hence

$$
t:=\theta t_1+(1-\theta)t_2>0.
$$

So  $(\theta x_1+(1-\theta)x_2,\ t)\in\mathrm{dom}\,F$ . ✅  
So the domain is convex.

This matters: it means the convexity inequality we are about to prove is _legal_ (both sides finite) for convex combinations.

* * *

2) Recognize  $F$  as a perspective
-----------------------------------

Define the base function on  $\mathbb R^n$ :

$$
\phi(x)=\|x\|_p^p.
$$

Then the **perspective** of  $\phi$  is

$$
\tilde\phi(x,t)=t\,\phi(x/t)\qquad(t>0).
$$

Now compute it:

$$
\tilde\phi(x,t)=t\,\|x/t\|_p^p =t\,\left(\frac{1}{t}\|x\|_p\right)^p =t\,\frac{\|x\|_p^p}{t^p} =\frac{\|x\|_p^p}{t^{p-1}} =F(x,t).
$$

So  $F$  _is_ the perspective of  $\phi$ .

Therefore, it suffices to prove:

> If  $\phi$  is convex, then its perspective  $\tilde\phi(x,t)=t\phi(x/t)$  is convex on  $t>0$ .

But we still must check **two things**:

1.   $\phi$  is convex.
2.  The perspective theorem holds (with the domain properly tracked).

* * *

3) Prove  $\phi(x)=\|x\|_p^p$  is convex (quick but honest)
-----------------------------------------------------------

For  $p\ge 1$ ,

$$
\|x\|_p^p=\sum_{i=1}^n |x_i|^p.
$$

So it’s enough to know the scalar function  $u\mapsto |u|^p$  is convex for  $p\ge 1$ . That’s true because:

*   for  $u>0$ ,  $u^p$  has second derivative  $p(p-1)u^{p-2}\ge0$ ,
*   for  $u<0$ ,  $|u|^p=(-u)^p$  has the same curvature,
*   and the function is symmetric and convex at  $0$  as well.

A sum of convex functions is convex, hence  $\phi$  is convex.

* * *

4) Perspective theorem: full Jensen proof with domain checks
------------------------------------------------------------

### Theorem (Perspective preserves convexity)

If  $\phi:\mathbb R^n\to\mathbb R\cup\{+\infty\}$  is convex, then

$$
\tilde\phi(z,t)=t\,\phi(z/t)
$$

is convex on  $\{(z,t): t>0\}$ .

### Proof (surgical Jensen, step-by-step)

Take two points  $(z_1,t_1)$ ,  $(z_2,t_2)$  with  $t_1>0,t_2>0$  and  $\theta\in[0,1]$ .  
Define their convex combination:

$$
(z,t)=\theta(z_1,t_1)+(1-\theta)(z_2,t_2) =(\theta z_1+(1-\theta)z_2,\ \theta t_1+(1-\theta)t_2).
$$

#### Domain check 1:  $t>0$ 

Since  $t$  is a convex combination of positive numbers,  $t>0$ .  
So  $\tilde\phi(z,t)$  is well-defined. ✅

We want to prove:

$$
\tilde\phi(z,t)\le \theta\tilde\phi(z_1,t_1)+(1-\theta)\tilde\phi(z_2,t_2),
$$

i.e.

$$
t\,\phi(z/t)\le \theta t_1\phi(z_1/t_1)+(1-\theta)t_2\phi(z_2/t_2).
$$

#### Key move: pick new weights that make  $z/t$  a convex combination

Define

$$
\alpha=\frac{\theta t_1}{t},\qquad \beta=\frac{(1-\theta)t_2}{t}.
$$

#### Domain check 2:  $\alpha,\beta$  are valid convex weights

*    $\alpha\ge0$ ,  $\beta\ge0$  because all pieces are  $\ge0$ .
*   Sum:
    
$$
\alpha+\beta=\frac{\theta t_1+(1-\theta)t_2}{t}=\frac{t}{t}=1.
$$

So  $\alpha,\beta\in[0,1]$ ,  $\alpha+\beta=1$ . ✅

Now compute:

$$
\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2} =\frac{\theta t_1}{t}\frac{z_1}{t_1}+\frac{(1-\theta)t_2}{t}\frac{z_2}{t_2} =\frac{\theta z_1+(1-\theta)z_2}{t} =\frac{z}{t}.
$$

So

$$
\boxed{\frac{z}{t}=\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}}.
$$

Now apply convexity of  $\phi$  (Jensen):

$$
\phi(z/t)=\phi\!\left(\alpha\frac{z_1}{t_1}+\beta\frac{z_2}{t_2}\right) \le \alpha\,\phi(z_1/t_1)+\beta\,\phi(z_2/t_2).
$$

Multiply both sides by  $t>0$  (preserves inequality direction):

$$
t\phi(z/t)\le t\alpha\,\phi(z_1/t_1)+t\beta\,\phi(z_2/t_2).
$$

But  $t\alpha=\theta t_1$  and  $t\beta=(1-\theta)t_2$ . So

$$
t\phi(z/t)\le \theta t_1\phi(z_1/t_1)+(1-\theta)t_2\phi(z_2/t_2).
$$

This is exactly the convexity inequality. ✅

So the perspective is convex on  $t>0$ .

* * *

5) Conclude 3.23(a)
-------------------

We already showed  $\phi(x)=\|x\|_p^p$  is convex, and  $F$  is its perspective, hence:

$$
\boxed{F(x,t)=\frac{\|x\|_p^p}{t^{p-1}}\ \text{is convex on}\ \{(x,t):t>0\}.}
$$

* * *

Exercise 3.23(b)
================

### Show  $\displaystyle f(x)=\frac{\|Ax+b\|_2^2}{c^\top x+d}$  is convex on  $\{x: c^\top x+d>0\}$ 

1) State the function and domain precisely
------------------------------------------

Let  $A\in\mathbb R^{m\times n}$ ,  $b\in\mathbb R^m$ ,  $c\in\mathbb R^n$ ,  $d\in\mathbb R$ .  
Define

$$
f(x)=\frac{\|Ax+b\|_2^2}{c^\top x+d}.
$$

**Domain:**

$$
D=\{x\in\mathbb R^n:\ c^\top x+d>0\}.
$$

Reason: denominator must be positive (and in BV this is the standard domain for the quadratic-over-linear convexity claim).

### Domain convexity check

Take  $x_1,x_2\in D$  and  $\theta\in[0,1]$ . Since  $c^\top(\cdot)+d$  is affine,

$$
c^\top(\theta x_1+(1-\theta)x_2)+d =\theta(c^\top x_1+d)+(1-\theta)(c^\top x_2+d).
$$

Each bracket is  $>0$ . A convex combination of positive numbers is  $>0$ .  
So  $\theta x_1+(1-\theta)x_2\in D$ . ✅ Domain convex.

Good — now convexity inequalities won’t accidentally evaluate  $f$  outside its domain.

* * *

2) Reduce to a “base” convex function in  $(u,y)$ 
--------------------------------------------------

Define

$$
u(x)=Ax+b\in\mathbb R^m,\qquad y(x)=c^\top x+d\in\mathbb R.
$$

Both are affine in  $x$ .

Define the base function

$$
\psi(u,y)=\frac{\|u\|_2^2}{y},\qquad \text{domain } \{(u,y): y>0\}.
$$

Then for  $x\in D$ ,  $y(x)>0$ , so  $(u(x),y(x))\in\mathrm{dom}\,\psi$  and

$$
f(x)=\psi(u(x),y(x)).
$$

So it suffices to prove two facts:

1.   $\psi(u,y)$  is convex in  $(u,y)$  on  $y>0$ .
2.  Precomposing a convex function with an affine map keeps convexity **on the pulled-back domain**.

We’ll do both with domain checks.

* * *

3) Prove  $\psi(u,y)=\|u\|_2^2/y$  is convex on  $y>0$ 
-------------------------------------------------------

### Method 1 (cleanest): perspective theorem again

Let  $\phi(u)=\|u\|_2^2$ . This is convex on  $\mathbb R^m$ .

Its perspective is

$$
\tilde\phi(u,y)=y\,\phi(u/y)=y\|u/y\|_2^2=y\frac{\|u\|_2^2}{y^2}=\frac{\|u\|_2^2}{y}.
$$

So  $\psi$  is the perspective of a convex function, hence convex on  $y>0$  by the theorem proven in 3.23(a).

### Domain check for  $\psi$ 

Take  $(u_1,y_1)$ ,  $(u_2,y_2)$  with  $y_1>0,y_2>0$ . Their convex combination has

$$
y=\theta y_1+(1-\theta)y_2>0,
$$

so  $\psi$  is defined on the convex combination. ✅

Therefore  $\psi$  is convex on its domain.

* * *

4) Compose with affine maps (with domain pulled back)
-----------------------------------------------------

We have  $f(x)=\psi(u(x),y(x))$  with  $u(x)=Ax+b$ ,  $y(x)=c^\top x+d$ .

### Domain check for the composition

The domain of  $f$  is exactly the set of  $x$  such that  $(u(x),y(x))\in\mathrm{dom}\,\psi$ , i.e.  $y(x)>0$ .  
That is precisely  $D=\{x: c^\top x+d>0\}$ . ✅

Now take  $x_1,x_2\in D$ ,  $\theta\in[0,1]$ .  
We already proved  $\theta x_1+(1-\theta)x_2\in D$ , so all values below are well-defined.

Use affinity:

$$
u(\theta x_1+(1-\theta)x_2)=\theta u(x_1)+(1-\theta)u(x_2),
$$
 
$$
y(\theta x_1+(1-\theta)x_2)=\theta y(x_1)+(1-\theta)y(x_2).
$$

Now convexity of  $\psi$  in  $(u,y)$  gives:

$$
\psi(\theta u_1+(1-\theta)u_2,\ \theta y_1+(1-\theta)y_2) \le \theta\psi(u_1,y_1)+(1-\theta)\psi(u_2,y_2).
$$

Substitute  $(u_i,y_i)=(u(x_i),y(x_i))$ :

$$
f(\theta x_1+(1-\theta)x_2) \le \theta f(x_1)+(1-\theta)f(x_2).
$$

So  $f$  is convex on  $D$ . ✅

* * *

Optional: Epigraph / rotated SOC view (domain-conscious)
--------------------------------------------------------

Sometimes BV expects you to recognize this:

The epigraph of  $\psi(u,y)$  is

$$
\mathrm{epi}\,\psi =\{(u,y,t): y>0,\ \|u\|_2^2 \le yt\}.
$$

The set  $\{(u,y,t): \|u\|_2^2\le yt,\ y\ge 0,\ t\ge 0\}$  is a **rotated second-order cone** (convex).  
The strict  $y>0$  domain is the interior slice where the function is finite. That’s another (geometric) proof of convexity.

Then the epigraph of  $f(x)$  is the affine preimage of this set under  $(x,t)\mapsto(u(x),y(x),t)$ , hence convex.

* * *

Final answers
=============

$$
\boxed{\text{3.23(a): } (x,t)\mapsto \|x\|_p^p/t^{p-1}\ \text{is convex on }t>0.}
$$
 
$$
\boxed{\text{3.23(b): } x\mapsto \|Ax+b\|_2^2/(c^\top x+d)\ \text{is convex on }c^\top x+d>0.}
$$

* * *

If you want, I can now go one notch deeper and prove (from scratch) the single remaining “atom” we used as a known fact in 3.23(a): **why  $|u|^p$  is convex for all  $p\ge 1$ ** including the non-smoothness at  $u=0$  when  $p=1$  (subgradients proof).

## Prompt:
Exercise 3.30.

3/3

## Response:
Thought for 59s

Exercise 3.30 (BV) — Convex hull / convex envelope of a function
----------------------------------------------------------------

The book’s statement is:

Let  $f:\mathbb R^n\to\mathbb R$ . Define its **convex hull / convex envelope**  $g$  by

$$
g(x)=\inf\{\,t\mid (x,t)\in \operatorname{conv}\,\operatorname{epi} f\,\}.
$$

Geometrically,  $\operatorname{epi} g$  is the convex hull of  $\operatorname{epi} f$ .  
Show that  $g$  is the **largest convex underestimator** of  $f$ : if  $h$  is convex and  $h(x)\le f(x)$  for all  $x$ , then  $h(x)\le g(x)$  for all  $x$ . [UCLA Sea Scholars](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

I’ll prove this in a “domain-honest” way, including the only subtlety here: **the infimum might not be attained**, so you sometimes need a closure.

* * *

0) Setup and notational hygiene
===============================

### Epigraph

$$
\operatorname{epi} f \;=\;\{(x,t)\in\mathbb R^{n+1}:\ t\ge f(x)\}.
$$

Let

$$
E := \operatorname{conv}(\operatorname{epi} f)\subseteq \mathbb R^{n+1}.
$$

This is convex by construction.

Define

$$
g(x):=\inf\{t:(x,t)\in E\}.
$$

Important: for some  $x$ , the vertical line  $\{(x,t):t\in\mathbb R\}$  might not intersect  $E$ . Then the inf is over an empty set. In standard convex analysis one defines  $g(x)=+\infty$  in that case; BV’s statement writes  $f:\mathbb R^n\to\mathbb R$ , but the geometry is cleaner if we allow extended values. I’ll proceed with the mathematically standard convention:

*   If  $\{t:(x,t)\in E\}=\varnothing$ , then  $g(x)=+\infty$ .
*   Otherwise  $g(x)\in\mathbb R\cup\{-\infty\}$  (but here it won’t be  $-\infty$  because  $E$  is contained in an epigraph-like region; see below).

So **domain of  $g$ ** is

$$
\operatorname{dom} g :=\{x:\exists t\ (x,t)\in E\}.
$$

* * *

1) First key facts:  $g\le f$  and  $g$  is convex
==================================================

1.1 Show  $g(x)\le f(x)$  for all  $x$ 
---------------------------------------

Fix any  $x$ . Then  $(x,f(x))\in \operatorname{epi} f$  because  $f(x)\ge f(x)$ .  
Since  $\operatorname{epi} f\subseteq E=\operatorname{conv}(\operatorname{epi} f)$ , we have  $(x,f(x))\in E$ .

Therefore  $f(x)$  is a feasible  $t$  in the set  $\{t:(x,t)\in E\}$ . Hence

$$
g(x)=\inf\{t:(x,t)\in E\}\ \le\ f(x).
$$

So  $g$  is indeed an **underestimator** of  $f$ .

* * *

1.2 Identify  $\operatorname{epi} g$  (this is where convexity comes from)
--------------------------------------------------------------------------

Define the **upward closure** of  $E$ :

$$
E^{\uparrow} := E + \big(\{0\}^n\times \mathbb R_+\big) = \{(x,\,s+r): (x,s)\in E,\ r\ge 0\}.
$$

This set is convex because it is a Minkowski sum of two convex sets (a convex set  $E$  plus a convex cone  $\{0\}^n\times\mathbb R_+$ ).

### Claim

$$
\operatorname{epi} g \;=\; \overline{E^{\uparrow}}
$$

(closure may be needed if the inf is not attained).

#### Proof (“ $\subseteq$ ”)

Take  $(x,t)\in \operatorname{epi} g$ . That means  $t\ge g(x)$ .

*   If  $t>g(x)$ : set  $\varepsilon:=t-g(x)>0$ . By definition of infimum, there exists some  $s$  such that  $(x,s)\in E$  and
    $$
    s < g(x)+\varepsilon = t.
    $$
    Then  $t=s+r$  with  $r=t-s>0$ , so  $(x,t)\in E^{\uparrow}$ .
*   If  $t=g(x)$ : you may not have any  $(x,s)\in E$  with  $s=g(x)$ . But you can take a sequence  $s_k\downarrow g(x)$  with  $(x,s_k)\in E$ , then  $(x,s_k)\in E^{\uparrow}$  (take  $r=0$ ), and  $(x,s_k)\to(x,g(x))$ . So  $(x,t)\in\overline{E^{\uparrow}}$ .

Thus  $\operatorname{epi} g\subseteq \overline{E^{\uparrow}}$ .

#### Proof (“ $\supseteq$ ”)

Take  $(x,t)\in E^{\uparrow}$ . Then there exist  $(x,s)\in E$  and  $r\ge 0$  with  $t=s+r$ , so  $t\ge s$ .

Since  $(x,s)\in E$ ,  $s$  is feasible in the definition of  $g(x)$ , hence  $g(x)\le s\le t$ , i.e.  $(x,t)\in \operatorname{epi} g$ .

So  $E^{\uparrow}\subseteq \operatorname{epi} g$ . Taking closures preserves inclusion, giving  $\overline{E^{\uparrow}}\subseteq \operatorname{epi} g$ .

Combining both directions yields  $\operatorname{epi} g=\overline{E^{\uparrow}}$ .

### Convexity of  $g$ 

 $\overline{E^{\uparrow}}$  is convex (closure of a convex set is convex), so  $\operatorname{epi} g$  is convex. Therefore  $g$  is a **convex function** (on its effective domain).

That proves the “ $g$  is convex” part with full geometric honesty.

* * *

2) The main claim:  $g$  is the **largest convex underestimator**
=================================================================

We must show:

> If  $h$  is convex and  $h(x)\le f(x)\ \forall x$ , then  $h(x)\le g(x)\ \forall x$ . [UCLA Sea Scholars](https://www.seas.ucla.edu/~vandenbe/cvxbook/bv_cvxbook.pdf)

Step 2.1: Convert  $h\le f$  into an epigraph inclusion
-------------------------------------------------------

Assume  $h(x)\le f(x)$  for all  $x$ .

Take any  $(x,t)\in \operatorname{epi} f$ . Then  $t\ge f(x)\ge h(x)$ . So  $(x,t)\in \operatorname{epi} h$ .

Thus

$$
\operatorname{epi} f \subseteq \operatorname{epi} h.
$$

Step 2.2: Convexify
-------------------

Since  $h$  is convex,  $\operatorname{epi} h$  is convex. And since it contains  $\operatorname{epi} f$ , it must contain the **convex hull** of  $\operatorname{epi} f$ :

$$
E = \operatorname{conv}(\operatorname{epi} f)\subseteq \operatorname{epi} h.
$$

This inclusion is the whole game.

Step 2.3: Take a fixed  $x$  and compare vertical slices
--------------------------------------------------------

Fix  $x$ . Consider the feasible set for  $g(x)$ :

$$
T(x):=\{t:(x,t)\in E\}.
$$

By definition,

$$
g(x)=\inf T(x).
$$

But we also know  $E\subseteq \operatorname{epi} h$ . So for any  $t\in T(x)$ , we have  $(x,t)\in \operatorname{epi} h$ , which means  $t\ge h(x)$ .

So **every** feasible  $t$  in  $T(x)$  is  $\ge h(x)$ . Therefore the infimum is also  $\ge h(x)$ :

$$
g(x)=\inf T(x)\ \ge\ h(x).
$$

Equivalently,

$$
h(x)\le g(x)\qquad \forall x.
$$

That is exactly the statement “ $g$  is the largest convex underestimator of  $f$ .” ✅

No hidden domain gaps: this argument even handles the case  $T(x)=\varnothing$ , because then  $g(x)=+\infty$  and the inequality  $h(x)\le g(x)$  holds trivially.

* * *

3) What you should _remember_ (the mental model)
================================================

*    $\operatorname{epi} f$  is the “shape above  $f$ .”
*   Any convex underestimator  $h\le f$  has a convex epigraph that must contain  $\operatorname{epi} f$ .
*   Therefore it must contain  $\operatorname{conv}(\operatorname{epi} f)$ .
*   The **lowest height** at each  $x$  compatible with that convex hull is exactly  $g(x)$ .
*   Hence no convex function under  $f$  can sit above  $g$ . So  $g$  is maximal.

That’s why this object is called both the **convex envelope** and the **tightest convex relaxation** of  $f$ .

* * *

If you want the next layer: I can derive the common equivalent characterization

$$
g(x)=\sup\{\ell(x)\mid \ell \text{ affine and } \ell(z)\le f(z)\ \forall z\},
$$

i.e. the envelope is the **pointwise supremum of all affine global underestimators**—which plugs directly into Exercise 3.28/3.31 and into biconjugates  $g=f^{\*\*}$  when  $f$  is closed.

## Prompt:
![Uploaded image](https://chatgpt.com/backend-api/estuary/content?id=file_000000001bd4724391c0ee90e600e7eb&ts=490522&p=fs&cid=1&sig=8b63bd93c2f8b1bf25ce0021e29367e7bec8f052646c6c936aa3c2b24ce80dd7&v=0)

exercise 3.31

## Response:
Thought for 1m 52s

Got it. **Exercise 3.31** is a sneaky one: it builds the “best positively homogeneous (degree-1) minorant” of a convex function by _radially rescaling_.

We’re given a **convex** function  $f:\mathbb R^n\to\mathbb R\cup\{+\infty\}$  (at least proper on rays we touch), and we define

$$
g(x)\;=\;\inf_{\alpha>0}\frac{f(\alpha x)}{\alpha}.
$$

We must prove:

**(a)**  $g$  is homogeneous:  $g(tx)=t\,g(x)$  for all  $t\ge 0$ .  
**(b)**  $g$  is the largest homogeneous underestimator of  $f$ .  
**(c)**  $g$  is convex.

I will be **domain-honest**: the inf can be  $+\infty$  or  $-\infty$  if  $f$  is pathological; BV typically intends  $f$  proper and (often implicitly)  $f(0)=0$  or at least  $f(0)\ge 0$  so  $g$  is not  $-\infty$ . I’ll flag exactly where that matters.

* * *

0) Domain and finiteness sanity checks (so we don’t cheat)
==========================================================

For a fixed  $x$ , define the ray function

$$
\phi_x(\alpha)=\frac{f(\alpha x)}{\alpha},\qquad \alpha>0.
$$

Then

$$
g(x)=\inf_{\alpha>0}\phi_x(\alpha).
$$
*   If  $f(\alpha x)=+\infty$  for all  $\alpha>0$ , then  $g(x)=+\infty$ .
*   If  $f(0)<0$ , then  $g(0)=\inf_{\alpha>0} \frac{f(0)}{\alpha}=-\infty$ . This is why BV typically lives with  $f(0)\ge 0$  (or normalizes to  $f(0)=0$ ).

Nothing breaks in the _formal_ proofs if we allow  $\pm\infty$ , but for “nice” convex analysis, you usually want  $g$  proper (not identically  $+\infty$ , and not  $-\infty$  somewhere). I’ll proceed with inequalities that remain valid whenever the expressions are defined in  $\mathbb R\cup\{\pm\infty\}$ .

* * *

(a) Positive homogeneity:  $g(tx)=t g(x)$  for  $t\ge 0$ 
=========================================================

Case 1:  $t>0$ 
---------------

Start from the definition:

$$
g(tx)=\inf_{\alpha>0}\frac{f(\alpha(tx))}{\alpha} =\inf_{\alpha>0}\frac{f((\alpha t)x)}{\alpha}.
$$

Now do a **change of variable**:

$$
\beta=\alpha t \quad\Longleftrightarrow\quad \alpha=\beta/t.
$$

Since  $t>0$ ,  $\alpha>0 \iff \beta>0$ . So the infimum over  $\alpha>0$  is the same as the infimum over  $\beta>0$ .

Then

$$
g(tx) =\inf_{\beta>0}\frac{f(\beta x)}{\beta/t} =t\inf_{\beta>0}\frac{f(\beta x)}{\beta} =t\,g(x).
$$

✅ So  $g(tx)=t g(x)$  for all  $t>0$ .

Case 2:  $t=0$ 
---------------

We need to show  $g(0)=0\cdot g(x)=0$ . But beware: if  $f(0)<0$ , then  $g(0)=-\infty$ . So:

*   If  $f(0)\ge 0$ , then for  $\alpha>0$ ,
    $$
    \frac{f(\alpha\cdot 0)}{\alpha}=\frac{f(0)}{\alpha}\ge 0,
    $$
    hence  $g(0)=\inf_{\alpha>0} f(0)/\alpha = 0$ . So homogeneity holds at  $t=0$ .
*   If  $f(0)<0$ , then  $g(0)=-\infty$  and the identity  $g(0)=0$  fails (but then the whole “largest homogeneous underestimator” story becomes degenerate).

So under the standard mild condition  $f(0)\ge 0$  (and in particular if  $f(0)=0$ ), we get:

$$
\boxed{g(tx)=t g(x)\ \ \forall t\ge 0.}
$$

* * *

(b)  $g$  is the largest homogeneous underestimator of  $f$ 
============================================================

We must show two things:

1.   $g(x)\le f(x)$  for all  $x$ . (So  $g$  is an underestimator.)
2.  If  $h$  is homogeneous and  $h\le f$ , then  $h\le g$ .

Step 1:  $g\le f$ 
------------------

Pick  $\alpha=1$  in the inf defining  $g(x)$ :

$$
g(x)=\inf_{\alpha>0}\frac{f(\alpha x)}{\alpha}\le \frac{f(1\cdot x)}{1}=f(x).
$$

So  $g(x)\le f(x)$  for all  $x$  (whenever  $f(x)$  is defined; if  $f(x)=+\infty$ , it’s still true).

✅ Underestimator proved.

Step 2: Maximality among homogeneous underestimators
----------------------------------------------------

Assume  $h$  is **homogeneous** (degree 1):  $h(\alpha x)=\alpha h(x)$  for all  $\alpha>0$ , and assume

$$
h(x)\le f(x)\quad \forall x.
$$

Fix any  $x$  and any  $\alpha>0$ . Apply the underestimator inequality at the point  $\alpha x$ :

$$
h(\alpha x)\le f(\alpha x).
$$

Now use homogeneity of  $h$ :  $h(\alpha x)=\alpha h(x)$ . Divide by  $\alpha>0$ :

$$
h(x)\le \frac{f(\alpha x)}{\alpha}.
$$

This is true for **every**  $\alpha>0$ . Therefore it is true for the infimum over  $\alpha>0$ :

$$
h(x)\le \inf_{\alpha>0}\frac{f(\alpha x)}{\alpha}=g(x).
$$

Since  $x$  was arbitrary,

$$
\boxed{h\le g.}
$$

✅ So  $g$  is the **largest** homogeneous function lying below  $f$ .

(Notice: we never needed  $f(0)=0$  for this step; only  $\alpha>0$ .)

* * *

(c) Convexity of  $g$ 
======================

This is the interesting part. A trap:  $g$  is an **infimum** over  $\alpha$  of convex functions  $x\mapsto f(\alpha x)/\alpha$ , and _infimum of convex functions is not convex in general_. So we need to exploit **convexity of  $f$ ** more cleverly.

BV’s intended path is:

1.  Use convexity of  $f$  to show the map  $\alpha\mapsto f(\alpha x)/\alpha$  is monotone (when  $f(0)=0$  or  $f(0)\ge 0$ ),
2.  identify  $g(x)$  with the **directional derivative at 0**,
3.  show that directional derivative is **sublinear** (homogeneous + subadditive),
4.  conclude convexity.

I’ll do it with complete steps, and I’ll mark exactly where  $f(0)=0$  is used.

* * *

Step C1: If  $f(0)=0$ , then  $\alpha\mapsto \frac{f(\alpha x)}{\alpha}$  is nondecreasing
------------------------------------------------------------------------------------------

Assume  $f$  is convex and  $f(0)=0$ . Fix  $x$ . Take  $0<\beta<\alpha$ . Write

$$
\beta x = \lambda(\alpha x) + (1-\lambda)0,\quad \text{where }\lambda=\beta/\alpha\in(0,1).
$$

By convexity of  $f$ ,

$$
f(\beta x)\le \lambda f(\alpha x)+(1-\lambda)f(0)=\frac{\beta}{\alpha}f(\alpha x)+\left(1-\frac{\beta}{\alpha}\right)\cdot 0.
$$

Divide by  $\beta>0$ :

$$
\frac{f(\beta x)}{\beta}\le \frac{f(\alpha x)}{\alpha}.
$$

So the ratio is nondecreasing in  $\alpha$ .

**Consequence:** since it’s nondecreasing on  $(0,\infty)$ ,

$$
\inf_{\alpha>0}\frac{f(\alpha x)}{\alpha} = \lim_{\alpha\downarrow 0}\frac{f(\alpha x)}{\alpha}.
$$

So (under  $f(0)=0$ ),

$$
\boxed{g(x)=\lim_{t\downarrow 0}\frac{f(tx)}{t}.}
$$

That limit is exactly the **directional derivative of  $f$  at 0 in direction  $x$ **, often denoted  $f'(0;x)$ .

> If you only know  $f(0)\ge 0$ , you still get an “almost” monotonicity with an error term  $f(0)$ , but the clean identification with the directional derivative is what BV usually wants.

From now on in (c), I will assume the standard normalization ** $f(0)=0$ ** (it’s the natural one here; otherwise the “largest homogeneous underestimator” is still defined but can get awkward at  $x=0$ ).

* * *

Step C2: Prove subadditivity:  $g(x+y)\le g(x)+g(y)$ 
-----------------------------------------------------

Using the directional-derivative representation:

$$
g(x)=\lim_{t\downarrow 0}\frac{f(tx)}{t}.
$$

Take any  $x,y$ . For any  $t>0$ ,

$$
t(x+y)=\frac12 (2tx)+\frac12(2ty).
$$

Convexity of  $f$  gives

$$
f(t(x+y)) \le \frac12 f(2tx)+\frac12 f(2ty).
$$

Divide by  $t>0$ :

$$
\frac{f(t(x+y))}{t}\le \frac12\frac{f(2tx)}{t}+\frac12\frac{f(2ty)}{t} = \frac{f(2tx)}{2t}+\frac{f(2ty)}{2t}.
$$

Now take the limit  $t\downarrow 0$ . Since  $2t\downarrow 0$  as well,

$$
\lim_{t\downarrow 0}\frac{f(2tx)}{2t}=g(x),\qquad \lim_{t\downarrow 0}\frac{f(2ty)}{2t}=g(y).
$$

So

$$
g(x+y)=\lim_{t\downarrow 0}\frac{f(t(x+y))}{t} \le \lim_{t\downarrow 0}\left(\frac{f(2tx)}{2t}+\frac{f(2ty)}{2t}\right) =g(x)+g(y).
$$

✅ Subadditivity proved.

* * *

Step C3: Combine with homogeneity to get convexity
--------------------------------------------------

We already proved in part (a) that  $g$  is positively homogeneous:

$$
g(\lambda x)=\lambda g(x)\quad \forall \lambda\ge 0.
$$

A standard fact: **positive homogeneity + subadditivity ⇒ convexity**. Here’s the proof (one line, but explicit):

Take  $x,y$  and  $\theta\in[0,1]$ . Then

$$
g(\theta x+(1-\theta)y) \le g(\theta x)+g((1-\theta)y) \quad (\text{subadditivity}) = \theta g(x)+(1-\theta)g(y)\quad (\text{homogeneity}).
$$

That is exactly Jensen convexity.

So

$$
\boxed{g\ \text{is convex.}}
$$

* * *

Final results (with the minimal assumptions called out)
=======================================================

*   **(a)** If  $f(0)\ge 0$ , then  $g$  is positively homogeneous on  $t\ge 0$ . (If  $f(0)<0$ , then  $g(0)=-\infty$ .)
*   **(b)** For any convex  $f$ ,  $g\le f$  and  $g$  is the **largest** degree-1 homogeneous underestimator.
*   **(c)** If  $f$  is convex and normalized so that  $f(0)=0$  (the standard setup here), then  $g(x)=\lim_{t\downarrow 0} f(tx)/t$  and  $g$  is **sublinear** (homogeneous + subadditive), hence **convex**.

* * *

If you want, I can also add a very useful interpretation: ** $g$  is the support function of  $\partial f(0)$ ** when  $f$  is closed convex with  $f(0)=0$ , i.e.

$$
g(x)=\sup_{s\in\partial f(0)} s^\top x,
$$

which makes (a)(c) instantly obvious and makes (b) feel inevitable.

2/2

## Prompt:
3.47 next

## Response:
Thought for 23s

Exercise 3.47 (BV): first-order inequality ⇔ log-concavity
----------------------------------------------------------

### Statement (with all assumptions / domain bits)

Let  $f:\mathbb{R}^n\to\mathbb{R}$  be **differentiable**, with **convex domain**  $\mathrm{dom}\,f$ , and assume  $f(x)>0$  for all  $x\in\mathrm{dom}\,f$ . Prove that  $f$  is **log-concave** (i.e.  $\log f$  is concave) **iff** for all  $x,y\in\mathrm{dom}\,f$ ,

 $$
\boxed{\ \frac{f(y)}{f(x)}\le \exp\!\left(\frac{\nabla f(x)^\top (y-x)}{f(x)}\right)\ }\tag{★}
$$

This is exactly the exercise statement in your document.

ChatGPT-Breakdown of convexity …

* * *

0) First translate (★) into a “tangent plane” inequality for  $\log f$ 
-----------------------------------------------------------------------

Because  $f(x)>0$  on the domain,  $\log f(x)$  is well-defined everywhere on  $\mathrm{dom}\,f$ . Also  $\log(\cdot)$  is **strictly increasing**, so we can take logs without flipping inequalities.

Take  $\log$  of both sides of (★):

$$
\log f(y)-\log f(x)\ \le\ \frac{\nabla f(x)^\top (y-x)}{f(x)}.
$$

Use the chain rule identity

$$
\nabla(\log f)(x)=\frac{1}{f(x)}\nabla f(x)
$$

(which we’ll derive explicitly in a moment), to rewrite the RHS:

$$
\log f(y)\ \le\ \log f(x)+\nabla(\log f)(x)^\top (y-x).\tag{T}
$$

So (★) is **equivalent** to (T). This is the whole game: **(T) says “ $\log f$  lies below its tangent hyperplane at every point.”**

ChatGPT-Breakdown of convexity …

Thus the exercise reduces to:

>  $\log f$  is concave on  $\mathrm{dom}\,f$  **iff** it satisfies the global tangent upper bound (T).

That equivalence is a standard (but crucial) theorem about differentiable concave functions.

ChatGPT-Breakdown of convexity …

* * *

1) Core lemma: concavity ⇔ “global tangent upper bound”
-------------------------------------------------------

Let  $h:\mathcal D\to\mathbb R$  be differentiable on a **convex** set  $\mathcal D\subseteq\mathbb R^n$ .

### Lemma

 $$
\boxed{\ h \text{ is concave on }\mathcal D\ \Longleftrightarrow\ h(y)\le h(x)+\nabla h(x)^\top (y-x)\ \ \forall x,y\in\mathcal D. \ }\tag{L}
$$

This is exactly what your file calls the “key lemma.”

ChatGPT-Breakdown of convexity …

I’ll prove both directions **from first principles**, and I’ll be annoyingly explicit about where “domain is convex” is used.

* * *

### (⇒) If  $h$  is concave, then (L) holds

Fix  $x,y\in\mathcal D$ . Because  $\mathcal D$  is convex, the whole segment

$$
x+t(y-x)\in\mathcal D\quad \forall t\in[0,1]
$$

stays inside the domain (this is the _only_ reason we assume convex domain).

Define a 1D function along the segment:

$$
\varphi(t):=h(x+t(y-x)),\qquad t\in[0,1].
$$

Because  $h$  is concave on  $\mathcal D$ ,  $\varphi$  is concave on  $[0,1]$  (concavity survives restriction to a line).

Now use a pure 1D fact:

> **1D concavity tangent fact.** If  $\varphi$  is concave and differentiable at  $0$ , then for all  $t\in[0,1]$ ,
> 
> $$
> \varphi(t)\le \varphi(0)+\varphi'(0)\,t.
> $$
> 
> (Geometrically: concave curves lie below their tangent line.)

Apply it at  $t=1$ :

$$
\varphi(1)\le \varphi(0)+\varphi'(0).
$$

Now translate each term back:

*    $\varphi(0)=h(x)$ 
*    $\varphi(1)=h(y)$ 
*   By the multivariable chain rule for curves,
    $$
    \varphi'(0)=\nabla h(x)^\top (y-x).
    $$

So:

$$
h(y)\le h(x)+\nabla h(x)^\top (y-x),
$$

which is exactly (L). (This is the same derivation your file sketches, just with the “restrict to a line” logic made explicit.

ChatGPT-Breakdown of convexity …

)

* * *

### (⇐) If (L) holds, then  $h$  is concave

Assume the inequality (L) holds for all  $x,y\in\mathcal D$ . We must prove concavity:

$$
h(\theta x+(1-\theta)y)\ \ge\ \theta h(x)+(1-\theta)h(y)\quad \forall x,y\in\mathcal D,\ \theta\in[0,1].
$$

Fix  $x,y\in\mathcal D$  and  $\theta\in[0,1]$ . Define the midpoint-like mixture point

$$
z:=\theta x+(1-\theta)y.
$$

Because  $\mathcal D$  is convex,  $z\in\mathcal D$ . (**This is exactly where convexity of the domain is used.**)

Now apply (L) twice, **both times with basepoint  $z$ **:

1.  with “ $x$ ” playing the role of “ $y$ ” in (L):
    
$$
h(x)\le h(z)+\nabla h(z)^\top (x-z),
$$
2.  with  $y$ :
    
$$
h(y)\le h(z)+\nabla h(z)^\top (y-z).
$$

Multiply the first by  $\theta$ , the second by  $1-\theta$ , and add:

$$
\theta h(x)+(1-\theta)h(y) \le \theta h(z)+(1-\theta)h(z)+\nabla h(z)^\top\big(\theta(x-z)+(1-\theta)(y-z)\big).
$$

The scalar part becomes  $h(z)$ . For the vector part, expand:

$$
\theta(x-z)+(1-\theta)(y-z) =\theta x+(1-\theta)y-z =z-z=0.
$$

So the gradient term vanishes, leaving

$$
\theta h(x)+(1-\theta)h(y)\le h(z)=h(\theta x+(1-\theta)y),
$$

which is concavity. This is exactly the “multiply and the gradient cancels” trick shown in your file.

ChatGPT-Breakdown of convexity …

Lemma proved.

* * *

2) Apply the lemma to  $h=\log f$ 
----------------------------------

Define

$$
h(x):=\log f(x).
$$

This is valid on  $\mathrm{dom}\,f$  because  $f>0$  there.

ChatGPT-Breakdown of convexity …

So:

$$
f \text{ log-concave}\ \Longleftrightarrow\ h=\log f \text{ concave}.
$$

By the lemma,  $h$  is concave **iff** it satisfies the tangent upper bound:

$$
\log f(y)\le \log f(x)+\nabla(\log f)(x)^\top (y-x)\quad \forall x,y\in\mathrm{dom}\,f.\tag{T}
$$

Thus all that remains is to compute  $\nabla(\log f)(x)$  and rewrite (T) into (★).

* * *

3) Compute  $\nabla(\log f)(x)$  (no handwaving)
------------------------------------------------

Because  $f$  is differentiable and  $f(x)>0$ , the scalar function  $\log(f(x))$  is differentiable, and for each coordinate  $i$ ,

$$
\frac{\partial}{\partial x_i}\log f(x) =(\log)'(f(x))\cdot \frac{\partial f(x)}{\partial x_i} =\frac{1}{f(x)}\,\frac{\partial f(x)}{\partial x_i}.
$$

Stacking these components gives

 $$
\boxed{\ \nabla(\log f)(x)=\frac{1}{f(x)}\,\nabla f(x).\ }\tag{C}
$$

This is exactly what your file derives.

ChatGPT-Breakdown of convexity …

* * *

4) Finish both directions (the “iff”)
-------------------------------------

### Direction 1: log-concave ⇒ inequality (★)

Assume  $f$  is log-concave, i.e.  $\log f$  is concave on  $\mathrm{dom}\,f$ . By the lemma, (T) holds. Substitute (C):

$$
\log f(y)\le \log f(x)+\left(\frac{\nabla f(x)}{f(x)}\right)^\top (y-x) =\log f(x)+\frac{\nabla f(x)^\top (y-x)}{f(x)}.
$$

Subtract  $\log f(x)$ :

$$
\log\frac{f(y)}{f(x)}\le \frac{\nabla f(x)^\top (y-x)}{f(x)}.
$$

Exponentiate (allowed;  $\exp$  is increasing), yielding (★):

$$
\frac{f(y)}{f(x)}\le \exp\!\left(\frac{\nabla f(x)^\top (y-x)}{f(x)}\right).
$$

These exact algebra steps appear in your file too.

ChatGPT-Breakdown of convexity …

### Direction 2: inequality (★) ⇒ log-concave

Assume (★) holds for all  $x,y\in\mathrm{dom}\,f$ . Because  $f>0$ , we can take logs:

$$
\log\frac{f(y)}{f(x)}\le \frac{\nabla f(x)^\top (y-x)}{f(x)}.
$$

Rewrite the left side as  $\log f(y)-\log f(x)$ , and again use (C) to get exactly (T):

$$
\log f(y)\le \log f(x)+\nabla(\log f)(x)^\top (y-x).
$$

By the lemma, this implies  $\log f$  is concave on  $\mathrm{dom}\,f$ , i.e.  $f$  is log-concave.

So the equivalence is proved.

* * *

What the inequality is really saying (intuition, but still precise)
-------------------------------------------------------------------

The concavity of  $\log f$  is an **additive** statement:

$$
\log f(y)\ \le\ \log f(x)+\text{(linear function of }y-x).
$$

Exponentiating turns this into a **multiplicative** growth control:

$$
f(y)\ \le\ f(x)\cdot \exp\!\big(\nabla(\log f)(x)^\top (y-x)\big),
$$

i.e. “in log-space,  $f$  can’t grow faster than its tangent hyperplane.”

Equality happens exactly when  $\log f$  is affine along the segment between  $x$  and  $y$  (so the tangent bound is tight).

* * *

You said “3.47 next,” so this is the complete 3.47. If you now mean **Exercise 3.48** next (the natural continuation in your file), it’s the “subtracting a constant preserves log-concavity on  $\{f>a\}$ ” result, and we can do it with the same level of domain paranoia.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)