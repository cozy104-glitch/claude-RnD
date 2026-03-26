export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  author: {
    name: string;
    url: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "R&D 제안서 작성기",
  description: "AI 기반 정부 R&D 제안서 작성 보조 도구",
  url: "http://localhost:3000",
  author: {
    name: "cozy1",
    url: "",
  },
};
