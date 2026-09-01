import { definePrismaConfig } from "prisma/config";
import path from "node:path";

export default definePrismaConfig({
  schema: path.join("prisma", "schema.prisma"),
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});