<script>
/**
 * 判断是否是标题的正则
 */
const headingFlag = /^h(\d)$/;
/**
 * 判断是否是连续空白字符的正则
 */
const spaceFlag = /\s+/g;
/**
 * 获取虚拟节点内部的文本
 */
function getTextContent(vnode) {
  if (!vnode.children) {
    return vnode.text;
  }
  return vnode.children.map((it) => getTextContent(it)).join('');
}

/**
 * 根据标题内容生成元素id
 */
function generateId(title) {
  return title.toLowerCase().replace(spaceFlag, '-');
}

/**
 * 遍历所有虚拟节点，得到标题的树形结构表示
 * 返回结果示例：
 * [
      {
        name: 'Chapter 1',
        id: 'chapter-1',
        level: 1,
        children: [
          { name: 'Chapter 1-1', id: 'chapter-1-1', level: 2 },
          { name: 'Chapter 1-2', id: 'chapter-1-2', level: 2 },
          { name: 'Chapter 1-3', id: 'chapter-1-3', level: 2 },
        ],
      },
      { name: 'Chapter2', id: 'chapter-2-1', level:1 }
    ]
 */
function getHeadings(vnodes) {
  const stack = []; // 用栈处理每一级标题
  const result = []; // 最终要返回的结果

  /**
   * 辅助方法：根据一个虚拟节点得到一个标题对象
   */
  function _getHeading(vnode) {
    let match;
    if (vnode.tag && (match = vnode.tag.match(headingFlag))) {
      const name = getTextContent(vnode); // 得到标题的文本
      const id = generateId(name); // 生成标题的id
      return {
        name,
        id,
        level: +match[1], // 从匹配的数字中得到标题的级别
      };
    }
  }

  /**
   * 辅助方法，通过深度优先遍历虚拟节点，处理每一个节点
   */
  function _handleHeading(vnode) {
    let heading = _getHeading(vnode);
    if (heading) {
      // 这是一个标题，需要处理
      // 为虚拟节点添加id属性
      vnode.data = vnode.data || {};
      vnode.data.attrs = vnode.data.attrs || {};
      vnode.data.attrs.id = heading.id;
      // 查看标题栈的顶部
      let topHeading = stack[stack.length - 1];
      // 要一直出栈，直到 当前标题的等级大于栈顶标题 或 栈顶已无标题
      while (true) {
        if (!topHeading) {
          // 栈顶已无标题
          result.push(heading);
          stack.push(heading);
          break;
        }
        if (heading.level > topHeading.level) {
          // 当前标题的等级大于栈顶标题
          topHeading.children = topHeading.children || [];
          topHeading.children.push(heading);
          stack.push(heading);
          break;
        } else {
          // 当前标题的等级小于等于栈顶标题
          topHeading = stack.pop(); // 出栈
        }
      }
    } else {
      // 当前虚拟元素不是一个标题
      if (vnode.children) {
        // 深度遍历子元素
        for (const child of vnode.children) {
          _handleHeading(child);
        }
      }
    }
  }

  for (const vnode of vnodes) {
    _handleHeading(vnode);
  }
  return result;
}

function getTree(h, headings) {
  if (!headings) {
    return [];
  }
  return h(
    'ol',
    headings.map((head) =>
      h('li', [
        h('a', { attrs: { href: `#${head.id}` } }, head.name),
        getTree(h, head.children),
      ])
    )
  );
}

export default {
  render(h) {
    const headings = getHeadings(this.$slots.default);
    const children = [];
    if (this.$scopedSlots.toc) {
      const vnodes = this.$scopedSlots.toc({ headings });
      children.push(vnodes);
    } else {
      children.push(getTree(h, headings));
    }
    children.push(this.$slots.default);
    return h('div', children);
  },
};
</script>
