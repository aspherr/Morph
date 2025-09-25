// Allow side-effect CSS imports like: import "./globals.css";
declare module "*.css";
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
