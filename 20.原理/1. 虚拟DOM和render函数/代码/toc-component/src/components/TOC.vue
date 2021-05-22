<script>
// 得到虚拟节点的文本内容
// function getText(vnode) {
//   return vnode.children[0].text;
// }

function getText(vnode) {
  if (!vnode.tag) {
    // 文本节点
    return vnode.text;
  }
  // ["asdfasdf", "Chapter 1"]
  return vnode.children.map((v) => getText(v)).join('');
}

function generateId(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/(^-)|(-$)/, '');
}

const headingFlag = /^h\d$/;
export default {
  render(h) {
    // 得到插槽中的所有虚拟dom
    const vnodes = this.$slots.default;
    // 拿到所有的标题元素
    const headNodes = vnodes.filter((v) => headingFlag.test(v.tag));
    const links = [];
    for (const head of headNodes) {
      head.data = head.data || {};
      head.data.attrs = head.data.attrs || {};

      const title = getText(head);
      const id = generateId(title);
      head.data.attrs.id = id;

      // 每个标题对应一个a元素
      links.push(
        h(
          'a',
          {
            attrs: {
              href: '#' + id,
            },
          },
          title
        )
      );
    }
    return h('div', [
      h(
        'div',
        {
          attrs: {
            class: 'toc',
          },
        },
        links
      ),
      h('div', vnodes),
    ]);
  },
};
</script>

<style>
.toc {
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px;
  line-height: 2;
}
.toc a {
  display: block;
}
html {
  scroll-behavior: smooth;
}
</style>
