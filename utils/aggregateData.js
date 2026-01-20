export const aggregateByWholesaler = (zones) => {
  const result = [];

  Object.keys(zones).forEach((zone) => {
    const data = zones[zone];
    let laborex = 0, ubipharm = 0, camed = 0;

    data.forEach((row) => {
      laborex += Number(row.laborex || 0);
      ubipharm += Number(row.ubipharm || 0);
      camed += Number(row.camed || 0);
    });

    result.push({
      zone,
      laborex,
      ubipharm,
      camed,
      total: laborex + ubipharm + camed,
    });
  });

  return result;
};

export const topProducts = (zones) => {
  const productsMap = {};

  Object.values(zones).forEach((data) => {
    data.forEach((row) => {
      if (!productsMap[row.product]) {
        productsMap[row.product] = { units: 0, nrv: row.nrv || 0 };
      }
      productsMap[row.product].units += Number(row.units || 0);
    });
  });

  return Object.entries(productsMap)
    .map(([product, stats]) => ({ product, ...stats }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 10);
};
