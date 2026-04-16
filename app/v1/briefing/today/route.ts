import { listThreats } from "@/data/threats";
import { listIncidents } from "@/data/incidents";
import { RULINGS } from "@/data/rulings";
import { apiJson } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET() {
  const threats = listThreats({}).slice(0, 3);
  const incidents = listIncidents({}).slice(0, 3);
  const ruling = [...RULINGS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];

  return apiJson({
    date: new Date().toISOString().slice(0, 10),
    summary:
      "Daily briefing: active Critical/High threats, newly filed incidents, and the current Weekly Ruling.",
    sections: {
      threats: threats.map((t) => ({
        id: t.id,
        severity: t.severity,
        title: t.title,
        cvss: t.cvss,
      })),
      incidents: incidents.map((i) => ({
        id: i.id,
        priority: i.priority,
        title: i.title,
        violatedArticles: i.violatedArticles,
      })),
      ruling: { id: ruling.id, title: ruling.title, recommendedBehavior: ruling.recommendedBehavior },
    },
  });
}
