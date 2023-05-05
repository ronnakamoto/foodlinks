import prisma from "~~/prisma/prisma";

function bigIntReplacer(_key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString(10);
  }
  return value;
}

export default async function all(req: any, res: any) {
  try {
    const allProjects = await prisma.foodProduct.findMany({
      where: {
        createdBy: req.body.createdBy,
      },
    });
    res.status(200).json(JSON.parse(JSON.stringify(allProjects, bigIntReplacer)));
  } catch (error: any) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
}
