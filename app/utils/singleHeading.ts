import { Fragment, Slice, type Node } from '@tiptap/pm/model'
import { Plugin } from '@tiptap/pm/state'
import { Extension } from '@tiptap/vue-3'

function isH1(node: Node) {
  return node.type.name === 'heading' && node.attrs.level === 1
}

export function countH1(content: Node | Fragment) {
  let count = 0
  content.descendants((node) => {
    if (isH1(node)) count++
  })
  return count
}

export const SingleHeading = Extension.create({
  name: 'singleHeading',

  addProseMirrorPlugins() {
    return [new Plugin({
      filterTransaction(transaction) {
        return !transaction.docChanged || countH1(transaction.doc) <= 1
      },

      props: {
        handlePaste(view, _event, slice) {
          const pastedHeadings = countH1(slice.content)
          if (!pastedHeadings) return false

          let hasH1 = countH1(view.state.tr.deleteSelection().doc) > 0
          if (!hasH1 && pastedHeadings === 1) return false

          function demoteExtraHeadings(content: Fragment): Fragment {
            return Fragment.fromArray(content.content.map((node) => {
              if (!isH1(node)) return node.copy(demoteExtraHeadings(node.content))
              if (hasH1) return node.type.create({ ...node.attrs, level: 2 }, node.content, node.marks)

              hasH1 = true
              return node
            }))
          }

          const normalized = new Slice(demoteExtraHeadings(slice.content), slice.openStart, slice.openEnd)
          const transaction = view.state.tr.replaceSelection(normalized)
          view.dispatch(transaction.setMeta('paste', true).setMeta('uiEvent', 'paste').scrollIntoView())
          return true
        },
      },
    })]
  },
})
