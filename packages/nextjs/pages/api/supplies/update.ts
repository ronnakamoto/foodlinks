import prisma from "~~/prisma/prisma";

function bigIntReplacer(_key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString(10);
  }
  return value;
}

export default async function update(req: any, res: any) {
  try {
    const { id, ...dataToUpdate } = req.body;
    const updatedProduct = await prisma.foodProduct.update({
      where: {
        id,
      },
      data: dataToUpdate,
    });
    res.status(201).json(JSON.parse(JSON.stringify(updatedProduct, bigIntReplacer)));
  } catch (error: any) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
}
