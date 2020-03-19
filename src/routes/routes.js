export const routes = [
  {
    app: "home",
    name: "Home",
    icon: "home",
    path: "/home",
    subMenu: [],
    headerMenu: [],
    key: "sub3"
  },
  {
    app: "stateQualifiers",
    name: "State Qualifiers",
    icon: "rocket",
    path: "/state-qualifiers",
    key: "sub1",
    subMenu: [
      {
        name: "Qualifiers",
        path: "/state-qualifiers",
        key: "1"
      },
      {
        name: "Borderline",
        path: "/state-qualifiers/borderline",
        key: "2"
      }
    ],
    headerMenu: []
  },
  {
    app: "kingsCourt",
    name: "Kings Court",
    icon: "crown",
    path: "/kings-court",
    subMenu: [],
    headerMenu: [
      {
        name: "Home",
        path: "/kings-court",
        icon: "home",
        key: "1",
        requiresAuthentication: false
      },
      {
        name: "Manage",
        path: "/kings-court/manage",
        icon: "database",
        key: "2",
        requiresAuthentication: true
      },
      {
        name: "Results",
        path: "/kings-court/results",
        icon: "dashboard",
        key: "3",
        requiresAuthentication: false
      }
    ],
    key: "sub2"
  }
];
