export const isIdsUnique = (nodes) => {
  const ids = nodes.map(n => n.id);
  let i;
  let j;
  for (i = 0; i < ids.length; i++) {
    for (j = i + 1; j < ids.length; j++) {
      if (ids[i] === ids[j]) {
        throw new Error(`component ${nodes[i].ele.prototype ? nodes[i].ele.prototype.constructor.name : 'unknown'}` +
          `and component ${nodes[j].ele.prototype ? nodes[j].ele.prototype.constructor.name : 'unknown'} have same id`);
      }
    }
  }
  return true;
};

export const validateId = (nodes) => {
  let i;
  for (i = 0; i < nodes.length; i++) {
    if (!nodes[i].id) {
      throw new Error(`component ${nodes[i].ele.prototype && nodes[i].ele.prototype.constructor.name} should have an id`);
    }
  }
  return isIdsUnique(nodes);
};


const getMargin = (dom) => {
  let computedStyle;
  if (window.getComputedStyle) {
    computedStyle = getComputedStyle(dom, null);
  } else {
    computedStyle = dom.currentStyle;
  }

  return {
    marginLeft: parseInt(computedStyle.marginLeft, 10) || 0,
    marginTop: parseInt(computedStyle.marginTop, 10) || 0,
  };
};

export const getElementPosition = (dom, node) => {
  // console.log(dom.offsetWidth, dom.offsetHeight)
  const obj = {};
  const width = dom.offsetWidth;
  const height = dom.offsetHeight;
  const {
    marginLeft,
    marginTop,
  } = getMargin(dom);

  obj.size = {
    width,
    height,
  };
  obj.anchor = {
    top: {
      x: marginLeft + node.x + (width / 2),
      y: marginTop + node.y,
    },
    right: {
      x: marginLeft + node.x + width,
      y: marginTop + node.y + (height / 2),
    },
    bottom: {
      x: marginLeft + node.x + (width / 2),
      y: marginTop + node.y + height,
    },
    left: {
      x: marginLeft + node.x,
      y: marginTop + node.y + (height / 2),
    },
  };
  obj.vertex = {
    tl: {
      x: marginLeft + node.x,
      y: marginTop + node.y,
    },
    tr: {
      x: marginLeft + node.x + width,
      y: marginTop + node.y,
    },
    br: {
      x: marginLeft + node.x + width,
      y: marginTop + node.y + height,
    },
    bl: {
      x: marginLeft + node.x,
      y: marginTop + node.y + height,
    },
  };

  return obj;
};

export const findShortest = (source, target) => {
  let shortest = 0;
  const shortestObj = {};
  /* eslint-disable */
  for (const i of Object.keys(source)) {
    for (const j of Object.keys(target)) {
      const d = distance(source[i], target[j]);
      if (shortest == 0 || d < shortest) {
        shortest = d;
        shortestObj.source = source[i];
        shortestObj.target = target[j];
      }
    }
  }
  return shortestObj;
};

const distance = (i, j) => {
  return Math.sqrt(((i.x - j.x, 2) ** 2) +
    ((i.y - j.y, 2) ** 2));
};

