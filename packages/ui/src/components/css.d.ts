// packages/ui/src/css.d.ts  (und in jedem Widget-Package)
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}