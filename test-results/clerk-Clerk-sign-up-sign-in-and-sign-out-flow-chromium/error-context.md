# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e4]:
      - link "Dashboard" [ref=e6] [cursor=pointer]:
        - /url: /dashboard
      - button [ref=e8] [cursor=pointer]:
        - img [ref=e9] [cursor=pointer]
    - generic [ref=e13]:
      - generic [ref=e14]: Welcome to Konsta UI + Next.js!
      - paragraph [ref=e16]: Here comes my app
    - generic [ref=e18]:
      - generic [ref=e20]:
        - generic [ref=e21]: Menu
        - button [ref=e23] [cursor=pointer]:
          - img [ref=e24] [cursor=pointer]
      - paragraph [ref=e28]:
        - text: You are not signed in. Please
        - link "Sign in" [ref=e29] [cursor=pointer]:
          - button "Sign in" [ref=e30]
  - button "Open Next.js Dev Tools" [ref=e36] [cursor=pointer]:
    - img [ref=e37] [cursor=pointer]
  - alert [ref=e40]
```