export const notFoundPageData = {
  code: "404",
  title: "Oops, that page is gone",
  messageLines: [
    "It looks like the page you were trying to reach",
    "doesn't exist anymore (or maybe the link is",
    "broken).",
  ],
  primaryActionLabel: "Tilbage",
  primaryActionHref: "/login",
} as const;

export const unsupportedPageData = {
  code: "505",
  title: "We hit a problem",
  messageLines: [
    "Something went wrong on our side, not yours.",
    "",
    "Try refreshing the page, or come back in a few",
    "minutes.",
  ],
  primaryActionLabel: "Tilbage",
  primaryActionHref: "/login",
} as const;
