import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:["/admin","/api/admin"]},sitemap:"https://amanda-teixeira-beauty.candygecko17.chatgpt.site/sitemap.xml"}}
