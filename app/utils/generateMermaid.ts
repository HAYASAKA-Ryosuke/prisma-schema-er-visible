import type { PrismaSchema } from "@loancrate/prisma-schema-parser";


export const generateMermaid = (ast: PrismaSchema) => {
  const models = ast.declarations.filter(declaration => declaration.kind === 'model')
  let header = 'erDiagram\n';
  let relation = '\n';
  let modelAndEnum = '';
  const modelNames = models.map(model => model.name.value);
  models.forEach(model => {
    modelAndEnum += `  ${model.name.value} {\n`;
    model.members.forEach(member => {
      try {
      const type = member.type;
      if (type && type.kind === 'typeId') {
        if (modelNames.includes(type.name.value)) {
          relation += `    ${type.name.value} ||--o{ ${model.name.value} : ""    \n`;
        } else {
          modelAndEnum += `    ${member.name.value} ${type.name.value}\n`;
        }
      }
      } catch(e) {
        console.log(e);
        debugger
      }
    });
    modelAndEnum += '  }\n';
  });
  return header + relation + modelAndEnum;
}

