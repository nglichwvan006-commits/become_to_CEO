-- ============================================================
-- Career Quest RPG - Production Seed Data
-- ============================================================
-- Run after 001_schema.sql, 002_seed_data.sql, 003_admin_policies.sql
-- and 004_admin_audit_logs.sql.
--
-- This file is idempotent. It upgrades the catalog from local/demo data
-- into real Supabase rows using stable slugs.

INSERT INTO public.career_levels (
  name,
  slug,
  order_index,
  description,
  min_performance_score,
  required_tasks,
  salary,
  badge_icon,
  badge_color,
  skills
) VALUES
  ('Intern', 'intern', 0, 'New developer starting the Career Quest track.', 0, 0, 3000000, 'Seed', '#22c55e', '["Variables","Conditions","Loops","Functions"]'::jsonb),
  ('Junior Developer', 'junior', 1, 'Developer who can solve common coding tasks independently.', 40, 10, 8000000, 'Code', '#3b82f6', '["Arrays","Strings","Sorting","Searching"]'::jsonb),
  ('Middle Developer', 'middle', 2, 'Developer with solid debugging and data structure skills.', 55, 25, 18000000, 'Bolt', '#f59e0b', '["Stack","Queue","Recursion","Trees"]'::jsonb),
  ('Senior Developer', 'senior', 3, 'Engineer who can handle complex systems and mentor others.', 70, 50, 35000000, 'Fire', '#ef4444', '["Dynamic Programming","Advanced Algorithms","Mentoring"]'::jsonb),
  ('Tech Lead', 'tech-lead', 4, 'Technical leader responsible for delivery quality and team direction.', 80, 75, 50000000, 'Crown', '#a855f7', '["Clean Code","Testing","Code Review","Planning"]'::jsonb),
  ('Software Architect', 'architect', 5, 'Architect who designs scalable systems and database boundaries.', 90, 90, 70000000, 'Tower', '#06b6d4', '["System Design","Databases","Scalability","Tradeoffs"]'::jsonb),
  ('CTO', 'cto', 6, 'Technology executive aligning product, people and engineering strategy.', 95, 100, 120000000, 'Rocket', '#fbbf24', '["Product Strategy","Technical Leadership","Hiring","Roadmaps"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  order_index = EXCLUDED.order_index,
  description = EXCLUDED.description,
  min_performance_score = EXCLUDED.min_performance_score,
  required_tasks = EXCLUDED.required_tasks,
  salary = EXCLUDED.salary,
  badge_icon = EXCLUDED.badge_icon,
  badge_color = EXCLUDED.badge_color,
  skills = EXCLUDED.skills;

WITH task_seed (
  level_slug,
  title,
  slug,
  type,
  difficulty,
  category,
  statement,
  input_format,
  output_format,
  constraints,
  sample_input,
  sample_output,
  hidden_tests,
  starter_code,
  exp_reward,
  salary_reward,
  reputation_reward,
  deadline_hours,
  priority,
  penalty_performance,
  penalty_reputation,
  order_index
) AS (
  VALUES
    (
      'intern',
      'Hello World - First Delivery',
      'hello-world',
      'coding'::public.task_type,
      'easy'::public.difficulty,
      'Programming Basics',
      $$## Objective
Print exactly `Hello, World!`.

This task verifies that the editor, runner and output comparison pipeline are working for your first delivery.$$,
      'No input.',
      'Print exactly `Hello, World!`.',
      'No constraints.',
      '',
      'Hello, World!',
      jsonb_build_array(jsonb_build_object('input', '', 'output', 'Hello, World!')),
      jsonb_build_object(
        'python', $$print("Hello, World!")$$,
        'javascript', $$console.log("Hello, World!");$$,
        'cpp', $code$#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}$code$,
        'java', $code$public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 42, 'acceptanceRate', 88)
      ),
      10, 50000, 2, 24, 'low'::public.priority, 5, 3, 0
    ),
    (
      'intern',
      'Sum Two Numbers',
      'sum-two-numbers',
      'coding'::public.task_type,
      'easy'::public.difficulty,
      'Programming Basics',
      $$## Objective
Given two integers `a` and `b`, print their sum.

This is a production-ready warm-up task for validating input parsing and integer output.$$,
      'Two integers `a` and `b` on one line.',
      'Print one integer: `a + b`.',
      '-1000000000 <= a, b <= 1000000000',
      '3 5',
      '8',
      jsonb_build_array(
        jsonb_build_object('input', '3 5', 'output', '8'),
        jsonb_build_object('input', '0 0', 'output', '0'),
        jsonb_build_object('input', '-1 1', 'output', '0'),
        jsonb_build_object('input', '1000000000 1000000000', 'output', '2000000000')
      ),
      jsonb_build_object(
        'python', $$a, b = map(int, input().split())
print(a + b)$$,
        'javascript', $$const [a, b] = require("fs").readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
console.log(a + b);$$,
        'cpp', $code$#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}$code$,
        'java', $code$import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        System.out.println(a + b);
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 59, 'acceptanceRate', 83)
      ),
      10, 50000, 2, 24, 'low'::public.priority, 5, 3, 1
    ),
    (
      'intern',
      'Even or Odd Classifier',
      'even-odd',
      'coding'::public.task_type,
      'easy'::public.difficulty,
      'Conditions',
      $$## Objective
Given an integer `n`, print `Even` if it is divisible by 2. Otherwise print `Odd`.$$,
      'One integer `n`.',
      'Print `Even` or `Odd`.',
      '-1000000000 <= n <= 1000000000',
      '4',
      'Even',
      jsonb_build_array(
        jsonb_build_object('input', '4', 'output', 'Even'),
        jsonb_build_object('input', '7', 'output', 'Odd'),
        jsonb_build_object('input', '0', 'output', 'Even'),
        jsonb_build_object('input', '-3', 'output', 'Odd')
      ),
      jsonb_build_object(
        'python', $$n = int(input())
print("Even" if n % 2 == 0 else "Odd")$$,
        'javascript', $$const n = Number(require("fs").readFileSync(0, "utf8").trim());
console.log(n % 2 === 0 ? "Even" : "Odd");$$,
        'cpp', $code$#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    cout << (n % 2 == 0 ? "Even" : "Odd") << endl;
    return 0;
}$code$,
        'java', $code$import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        System.out.println(n % 2 == 0 ? "Even" : "Odd");
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 76, 'acceptanceRate', 78)
      ),
      10, 50000, 2, 48, 'medium'::public.priority, 5, 3, 2
    ),
    (
      'intern',
      'FizzBuzz Sprint',
      'fizzbuzz',
      'coding'::public.task_type,
      'easy'::public.difficulty,
      'Loops',
      $$## Objective
Print numbers from `1` to `n`, one per line.

- Print `Fizz` for numbers divisible by 3.
- Print `Buzz` for numbers divisible by 5.
- Print `FizzBuzz` for numbers divisible by both 3 and 5.$$,
      'One positive integer `n`.',
      'Print one result per line.',
      '1 <= n <= 100',
      '5',
      $$1
2
Fizz
4
Buzz$$,
      jsonb_build_array(
        jsonb_build_object('input', '5', 'output', $$1
2
Fizz
4
Buzz$$),
        jsonb_build_object('input', '15', 'output', $$1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz$$)
      ),
      jsonb_build_object(
        'python', $$n = int(input())
for i in range(1, n + 1):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)$$,
        'javascript', $$const n = Number(require("fs").readFileSync(0, "utf8").trim());
for (let i = 1; i <= n; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}$$,
        'cpp', $code$#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) cout << "FizzBuzz";
        else if (i % 3 == 0) cout << "Fizz";
        else if (i % 5 == 0) cout << "Buzz";
        else cout << i;
        cout << '\n';
    }
    return 0;
}$code$,
        'java', $code$import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 93, 'acceptanceRate', 73)
      ),
      15, 75000, 3, 24, 'low'::public.priority, 5, 3, 3
    ),
    (
      'intern',
      'Reverse a String',
      'reverse-string',
      'coding'::public.task_type,
      'easy'::public.difficulty,
      'Strings',
      $$## Objective
Given a string `s`, print the reversed string.$$,
      'One string `s` without spaces.',
      'Print the reversed string.',
      '1 <= length(s) <= 100000',
      'hello',
      'olleh',
      jsonb_build_array(
        jsonb_build_object('input', 'hello', 'output', 'olleh'),
        jsonb_build_object('input', 'a', 'output', 'a'),
        jsonb_build_object('input', 'abcde', 'output', 'edcba')
      ),
      jsonb_build_object(
        'python', $$s = input().strip()
print(s[::-1])$$,
        'javascript', $$const s = require("fs").readFileSync(0, "utf8").trim();
console.log([...s].reverse().join(""));$$,
        'cpp', $code$#include <algorithm>
#include <iostream>
using namespace std;

int main() {
    string s;
    cin >> s;
    reverse(s.begin(), s.end());
    cout << s << endl;
    return 0;
}$code$,
        'java', $code$import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(new StringBuilder(s).reverse().toString());
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 110, 'acceptanceRate', 68)
      ),
      10, 50000, 2, 24, 'low'::public.priority, 5, 3, 4
    ),
    (
      'junior',
      'Fix Infinite Loop',
      'fix-infinite-loop',
      'bug_fix'::public.task_type,
      'medium'::public.difficulty,
      'Debugging',
      $$## Objective
The program should calculate the sum from `1` to `n`, but the loop never advances.

Fix the loop so the program terminates and prints the correct sum.$$,
      'One positive integer `n`.',
      'Print the sum `1 + 2 + ... + n`.',
      '1 <= n <= 1000000',
      '5',
      '15',
      jsonb_build_array(
        jsonb_build_object('input', '5', 'output', '15'),
        jsonb_build_object('input', '10', 'output', '55'),
        jsonb_build_object('input', '100', 'output', '5050')
      ),
      jsonb_build_object(
        'python', $$n = int(input())
total = 0
i = 1
while i <= n:
    total += i
    i += 1
print(total)$$,
        'javascript', $$const n = Number(require("fs").readFileSync(0, "utf8").trim());
let total = 0;
let i = 1;
while (i <= n) {
  total += i;
  i += 1;
}
console.log(total);$$,
        'cpp', $code$#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    cout << n * (n + 1) / 2 << endl;
    return 0;
}$code$,
        'java', $code$import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        System.out.println(n * (n + 1) / 2);
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 127, 'acceptanceRate', 63)
      ),
      25, 150000, 5, 12, 'high'::public.priority, 8, 5, 5
    ),
    (
      'junior',
      'Find Maximum in Array',
      'find-max',
      'coding'::public.task_type,
      'medium'::public.difficulty,
      'Arrays',
      $$## Objective
Given an array of `n` integers, print the maximum value.$$,
      'Line 1: integer `n`. Line 2: `n` integers.',
      'Print the maximum value.',
      '1 <= n <= 100000, -1000000000 <= a_i <= 1000000000',
      $$5
3 1 4 1 5$$,
      '5',
      jsonb_build_array(
        jsonb_build_object('input', $$5
3 1 4 1 5$$, 'output', '5'),
        jsonb_build_object('input', $$1
42$$, 'output', '42'),
        jsonb_build_object('input', $$3
-1 -5 -3$$, 'output', '-1')
      ),
      jsonb_build_object(
        'python', $$n = int(input())
arr = list(map(int, input().split()))
print(max(arr))$$,
        'javascript', $$const data = require("fs").readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
const n = data[0];
const arr = data.slice(1, 1 + n);
console.log(Math.max(...arr));$$,
        'cpp', $code$#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long best, x;
    cin >> best;
    for (int i = 1; i < n; i++) {
        cin >> x;
        if (x > best) best = x;
    }
    cout << best << endl;
    return 0;
}$code$,
        'java', $code$import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long best = sc.nextLong();
        for (int i = 1; i < n; i++) {
            best = Math.max(best, sc.nextLong());
        }
        System.out.println(best);
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 144, 'acceptanceRate', 58)
      ),
      25, 150000, 5, 24, 'medium'::public.priority, 8, 5, 6
    ),
    (
      'junior',
      'Sort Array Ascending',
      'sort-array',
      'coding'::public.task_type,
      'medium'::public.difficulty,
      'Sorting',
      $$## Objective
Given an array of `n` integers, sort it in ascending order and print the result.$$,
      'Line 1: integer `n`. Line 2: `n` integers.',
      'Print sorted values separated by spaces.',
      '1 <= n <= 100000',
      $$5
5 3 1 4 2$$,
      '1 2 3 4 5',
      jsonb_build_array(
        jsonb_build_object('input', $$5
5 3 1 4 2$$, 'output', '1 2 3 4 5'),
        jsonb_build_object('input', $$1
1$$, 'output', '1'),
        jsonb_build_object('input', $$3
3 3 3$$, 'output', '3 3 3')
      ),
      jsonb_build_object(
        'python', $$n = int(input())
arr = list(map(int, input().split()))
print(*sorted(arr))$$,
        'javascript', $$const data = require("fs").readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
const n = data[0];
const arr = data.slice(1, 1 + n).sort((a, b) => a - b);
console.log(arr.join(" "));$$,
        'cpp', $code$#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> arr(n);
    for (auto &x : arr) cin >> x;
    sort(arr.begin(), arr.end());
    for (int i = 0; i < n; i++) {
        if (i) cout << ' ';
        cout << arr[i];
    }
    cout << endl;
    return 0;
}$code$,
        'java', $code$import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextLong();
        Arrays.sort(arr);
        for (int i = 0; i < n; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(arr[i]);
        }
        System.out.println();
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 161, 'acceptanceRate', 53)
      ),
      25, 150000, 5, 24, 'medium'::public.priority, 8, 5, 7
    ),
    (
      'junior',
      'Fibonacci Number',
      'fibonacci',
      'coding'::public.task_type,
      'medium'::public.difficulty,
      'Dynamic Programming',
      $$## Objective
Given `n`, print the `n`th Fibonacci number.

Use an iterative solution to avoid recursion overhead.$$,
      'One integer `n`.',
      'Print `F(n)`.',
      '0 <= n <= 45',
      '10',
      '55',
      jsonb_build_array(
        jsonb_build_object('input', '10', 'output', '55'),
        jsonb_build_object('input', '0', 'output', '0'),
        jsonb_build_object('input', '1', 'output', '1'),
        jsonb_build_object('input', '20', 'output', '6765')
      ),
      jsonb_build_object(
        'python', $$n = int(input())
a, b = 0, 1
for _ in range(n):
    a, b = b, a + b
print(a)$$,
        'javascript', $$const n = Number(require("fs").readFileSync(0, "utf8").trim());
let a = 0, b = 1;
for (let i = 0; i < n; i++) {
  [a, b] = [b, a + b];
}
console.log(a);$$,
        'cpp', $code$#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        long long next = a + b;
        a = b;
        b = next;
    }
    cout << a << endl;
    return 0;
}$code$,
        'java', $code$import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            long next = a + b;
            a = b;
            b = next;
        }
        System.out.println(a);
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 178, 'acceptanceRate', 48)
      ),
      25, 150000, 5, 48, 'medium'::public.priority, 8, 5, 8
    ),
    (
      'senior',
      'Design Database Table List',
      'design-db-schema',
      'database'::public.task_type,
      'hard'::public.difficulty,
      'Database Design',
      $$## Objective
For a small e-commerce system, print the first `n` table names from a curated schema list in alphabetical order.

This task models translating product requirements into a predictable database boundary.$$,
      'One integer `n`.',
      'Print `n` table names, one per line, in alphabetical order.',
      '1 <= n <= 10',
      '3',
      $$categories
orders
products$$,
      jsonb_build_array(
        jsonb_build_object('input', '3', 'output', $$categories
orders
products$$),
        jsonb_build_object('input', '5', 'output', $$categories
customers
orders
products
reviews$$)
      ),
      jsonb_build_object(
        'python', $$tables = ["products", "orders", "customers", "categories", "reviews", "payments", "shipping", "inventory", "coupons", "wishlists"]
n = int(input())
for name in sorted(tables)[:n]:
    print(name)$$,
        'javascript', $$const tables = ["products","orders","customers","categories","reviews","payments","shipping","inventory","coupons","wishlists"];
const n = Number(require("fs").readFileSync(0, "utf8").trim());
console.log(tables.sort().slice(0, n).join("\n"));$$,
        'cpp', $code$#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<string> tables = {"products","orders","customers","categories","reviews","payments","shipping","inventory","coupons","wishlists"};
    sort(tables.begin(), tables.end());
    for (int i = 0; i < n; i++) cout << tables[i] << '\n';
    return 0;
}$code$,
        'java', $code$import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] tables = {"products","orders","customers","categories","reviews","payments","shipping","inventory","coupons","wishlists"};
        Arrays.sort(tables);
        for (int i = 0; i < n; i++) System.out.println(tables[i]);
    }
}$code$,
        'adminMeta', jsonb_build_object('status', 'published', 'submissions', 195, 'acceptanceRate', 43)
      ),
      50, 500000, 15, 168, 'critical'::public.priority, 12, 8, 9
    )
)
INSERT INTO public.tasks (
  career_level_id,
  title,
  slug,
  type,
  difficulty,
  category,
  statement,
  input_format,
  output_format,
  constraints,
  sample_input,
  sample_output,
  hidden_tests,
  starter_code,
  exp_reward,
  salary_reward,
  reputation_reward,
  deadline_hours,
  priority,
  penalty_performance,
  penalty_reputation,
  order_index
)
SELECT
  career_levels.id,
  task_seed.title,
  task_seed.slug,
  task_seed.type,
  task_seed.difficulty,
  task_seed.category,
  task_seed.statement,
  task_seed.input_format,
  task_seed.output_format,
  task_seed.constraints,
  task_seed.sample_input,
  task_seed.sample_output,
  task_seed.hidden_tests,
  task_seed.starter_code,
  task_seed.exp_reward,
  task_seed.salary_reward,
  task_seed.reputation_reward,
  task_seed.deadline_hours,
  task_seed.priority,
  task_seed.penalty_performance,
  task_seed.penalty_reputation,
  task_seed.order_index
FROM task_seed
JOIN public.career_levels ON career_levels.slug = task_seed.level_slug
ON CONFLICT (slug) DO UPDATE SET
  career_level_id = EXCLUDED.career_level_id,
  title = EXCLUDED.title,
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  statement = EXCLUDED.statement,
  input_format = EXCLUDED.input_format,
  output_format = EXCLUDED.output_format,
  constraints = EXCLUDED.constraints,
  sample_input = EXCLUDED.sample_input,
  sample_output = EXCLUDED.sample_output,
  hidden_tests = EXCLUDED.hidden_tests,
  starter_code = EXCLUDED.starter_code,
  exp_reward = EXCLUDED.exp_reward,
  salary_reward = EXCLUDED.salary_reward,
  reputation_reward = EXCLUDED.reputation_reward,
  deadline_hours = EXCLUDED.deadline_hours,
  priority = EXCLUDED.priority,
  penalty_performance = EXCLUDED.penalty_performance,
  penalty_reputation = EXCLUDED.penalty_reputation,
  order_index = EXCLUDED.order_index,
  updated_at = now();

INSERT INTO public.achievements (
  name,
  description,
  icon,
  category,
  condition_type,
  condition_value,
  exp_reward,
  reputation_reward
)
SELECT *
FROM (
  VALUES
    ('First Production Submit', 'Complete your first real task submission.', 'Target', 'milestone', 'tasks_completed', 1, 10, 5),
    ('Bug Fixer', 'Complete 5 debugging tasks.', 'Bug', 'skill', 'bug_fixes', 5, 25, 10),
    ('Three Day Focus', 'Maintain a 3 day learning streak.', 'Fire', 'streak', 'streak_days', 3, 15, 5),
    ('Seven Day Momentum', 'Maintain a 7 day learning streak.', 'Bolt', 'streak', 'streak_days', 7, 30, 10),
    ('Reliable Shipper', 'Complete 10 tasks before deadline.', 'Clock', 'performance', 'on_time_tasks', 10, 50, 20),
    ('Code Master', 'Complete 50 tasks.', 'Crown', 'milestone', 'tasks_completed', 50, 100, 50),
    ('Perfect Week', 'Reach 100 percent performance for 7 days.', 'Diamond', 'performance', 'perfect_days', 7, 75, 30),
    ('Rising Junior', 'Earn promotion to Junior Developer.', 'Star', 'promotion', 'career_level', 1, 50, 25)
) AS seed(name, description, icon, category, condition_type, condition_value, exp_reward, reputation_reward)
WHERE NOT EXISTS (
  SELECT 1 FROM public.achievements WHERE achievements.name = seed.name
);

INSERT INTO public.pets (
  name,
  description,
  icon,
  rarity,
  bonus_type,
  bonus_value
)
SELECT *
FROM (
  VALUES
    ('Code Companion', 'A reliable helper that adds a small EXP boost.', 'Cat', 'common'::public.rarity, 'exp_boost', 5),
    ('Night Owl', 'Improves focus during late learning sessions.', 'Owl', 'common'::public.rarity, 'exp_boost', 5),
    ('Fire Dragon', 'A rare companion for high intensity sprints.', 'Dragon', 'epic'::public.rarity, 'exp_boost', 15),
    ('Phoenix Shield', 'Reduces demotion pressure after a weak week.', 'Phoenix', 'legendary'::public.rarity, 'demotion_shield', 20),
    ('AI Helper', 'Boosts hint quality for difficult tasks.', 'Robot', 'rare'::public.rarity, 'hint_boost', 10),
    ('Reputation Spark', 'Increases reputation gain from completed work.', 'Spark', 'epic'::public.rarity, 'reputation_boost', 15)
) AS seed(name, description, icon, rarity, bonus_type, bonus_value)
WHERE NOT EXISTS (
  SELECT 1 FROM public.pets WHERE pets.name = seed.name
);

INSERT INTO public.seasons (name, description, start_date, end_date, is_active, rewards)
SELECT
  'Season 1: Career Launch',
  'The first production season for Career Quest RPG.',
  now(),
  now() + interval '30 days',
  true,
  '[{"rank":1,"reward":"500 EXP + Legendary Pet"},{"rank":2,"reward":"300 EXP"},{"rank":3,"reward":"200 EXP"}]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.seasons WHERE name = 'Season 1: Career Launch'
);

WITH pairs AS (
  SELECT
    current_level.id AS from_level_id,
    next_level.id AS to_level_id,
    current_level.slug AS from_slug,
    next_level.slug AS to_slug,
    current_level.order_index
  FROM public.career_levels current_level
  JOIN public.career_levels next_level
    ON next_level.order_index = current_level.order_index + 1
)
INSERT INTO public.promotion_challenges (
  from_level_id,
  to_level_id,
  title,
  description,
  challenge_type,
  challenge_data
)
SELECT
  pairs.from_level_id,
  pairs.to_level_id,
  'Promotion Review: ' || pairs.from_slug || ' to ' || pairs.to_slug,
  'Complete the promotion review to unlock the next career level.',
  'portfolio_review',
  jsonb_build_object(
    'requiredScore', 75 + pairs.order_index * 3,
    'focus', jsonb_build_array('code_quality', 'delivery', 'debugging')
  )
FROM pairs
WHERE NOT EXISTS (
  SELECT 1
  FROM public.promotion_challenges existing
  WHERE existing.from_level_id = pairs.from_level_id
    AND existing.to_level_id = pairs.to_level_id
);
