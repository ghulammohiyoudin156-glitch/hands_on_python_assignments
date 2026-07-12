# Hands-On Data Analytics with Python - Assignments

Welcome to the course! This repository contains all the practical assignments for our Python for Data Analytics course. Follow the instructions below carefully to set up, work on, and submit your assignments.

---

## First-Time Setup (Do This Once)

### Step 1: Create Your Own Copy of This Repository

1. Click the green **"Use this template"** button at the top of this page.
2. Select **"Create a new repository"**.
3. Fill in the details:
   - **Owner:** Select your GitHub username.
   - **Repository name:** `da-python-assignments` (or any name you prefer).
   - **Description (optional):** "My solutions for the Hands-On Data Analytics with Python course".
   - **Visibility:** Select **Public** - your assignments must be visible for review.
4. Click **"Create repository from template"**.

### Step 2: Clone Your New Repository to Your Computer

Open a terminal (Command Prompt, PowerShell, or Git Bash) and run:

```bash
git clone https://github.com/YOUR_USERNAME/da-python-assignments.git
```
Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Navigate into Your Repository

```bash
cd da-python-assignments
```

### Step 4: Add the Upstream Remote (For Future Assignments)

This links your repository to the original course repository so you can pull new assignments each week.

```bash
git remote add upstream https://github.com/Muhammad-Lukman/hands-on-data-analytics-python.git
```

Verify it worked:

```bash
git remote -v
```

You should see:
```
origin    https://github.com/YOUR_USERNAME/da-python-assignments.git (fetch)
origin    https://github.com/YOUR_USERNAME/da-python-assignments.git (push)
upstream  https://github.com/Muhammad-Lukman/hands-on-data-analytics-python.git (fetch)
upstream  https://github.com/Muhammad-Lukman/hands-on-data-analytics-python.git (push)
```

---

## Working on Weekly Assignments

### Completing the Current Week's Assignments

1. Open the assignment notebooks. They are located in folders like:
   ```
   assignments/
     w1_class1/
       Class1_Practical_Part1.ipynb
       Class1_Practical_Part2.ipynb
       ...
   ```

2. Launch Jupyter Notebook (or open them in VS Code / any editor):
   ```bash
   jupyter notebook
   #or
   #Use Google colab
   ```

3. Complete all exercises by writing your code in the empty cells provided. **Do not create a separate solutions folder** - write your answers directly into the notebooks.

4. Save all your work.

5. Commit and push your solutions to your GitHub repository:
   ```bash
   git add .
   git commit -m "Complete Week 1 assignments"
   git push origin student
   ```

---

## Getting New Assignments Each Week

When a new week's assignments are released, **do not create a new repository**. Instead, pull the new files into your existing repository:

```bash
git pull upstream student --allow-unrelated-histories
git pull upstream student
```

This will download all new assignment files while keeping your completed work safe. Then work on them and push as usual:

```bash
git add .
git commit -m "Completed Week 2 assignments"
git push origin student
```

---

## Submitting Your Work

After pushing your solutions to GitHub, you must submit a link so your work can be reviewed.

### Submission Steps (Do This Every Week)

1. Go to the Submissions Repository:  
   **[https://github.com/Muhammad-Lukman/hands-on-data-analytics-python_course_submission](https://github.com/Muhammad-Lukman/hands-on-data-analytics-python_course_submission.git)**

2. **Fork** this repository (click the Fork button in the top-right corner).

3. In your forked copy, navigate to the correct week's folder:
   - For Week 1: `submissions/week1/`
   - For Week 2: `submissions/week2/`
   - And so on...

4. Click **"Add file"** ---> **"Create new file"**.

5. Name the file exactly as your GitHub username followed by `.md`.  
   **Example:** If your username is `johndoe`, name the file `johndoe.md`.

6. Inside the file, write:
   ```markdown
   # Your Full Name
   - **GitHub Username:** @YOUR_USERNAME
   - **Assignment Repository:** https://github.com/YOUR_USERNAME/da-python-assignments
   - **Week:** 1
   - **Comments (optional):** Any feedback, difficulties, or notes you'd like to share.
   ```

7. Scroll down and click **"Commit new file"** (leave "Commit directly to the `main` branch" selected).

8. You should now see a banner saying your fork is ahead of the original. Click **"Contribute"** → **"Open pull request"**.

9. Check the details:
   - **Base repository:** `Muhammad-Lukman/hands-on-data-analytics-python_course_submission`
   - **Base branch:** `main`
   - **Head repository:** `YOUR_USERNAME/hands-on-data-analytics-python_course_submission`
   - **Head branch:** `main`

10. Add a title like **"Week 1 Submission - Your Full Name"** and click **"Create pull request"**.

Your submission is complete! Once your pull request is reviewed and merged, your entry will appear in the submissions directory.

---

## ❓ Frequently Asked Questions

### Do I need to create a new repository for each week?
**No.** You use the same repository for the entire course. Each week, simply run `git pull upstream student` to get new assignments.

### I got an error "src refspec main does not match any". What should I do?
The default branch in this course is `student`, not `main`. Use `git push origin student` instead of `git push origin main`.

### Can I make my repository private?
No. Your repository must be **public** so your work can be reviewed and displayed in the course submissions.

### I accidentally pushed a solutions folder. What should I do?
Do not create a solutions folder. Write your answers directly in the provided notebooks. If you created one by mistake, delete it and commit the change:
```bash
git rm -r solutions
git commit -m "Remove solutions folder"
git push origin student
```

### What if I get merge conflicts when pulling new assignments?
This is rare if you only modify the assignment notebooks as instructed. If it happens, don't panic - contact the instructor for help resolving it.

---

## Need Help?

If you run into any issues, open an issue in this repository or contact the instructor directly.

Happy learning, and enjoy your journey into Data Analytics with Python!
