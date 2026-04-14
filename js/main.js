const root = document.getElementById('root');
const model = {
  input: m.stream(''),
  result: m.stream([]),
  list: m.stream([]),
  isDuplicate: m.stream(true),
  number: m.stream(1),
  setList: (input) => {
    model.list(input.split("\n").filter((v) => { return v.trim(); }));
  },
  execute: () => {
    if (!window.crypto?.getRandomValues) {
      alert('このブラウザは window.crypto に対応していないため利用できません。');
      return;
    }
    const result = [];
    const list = model.list().slice();
    for (let i = 0; i < model.number(); i++) {
      if (list.length < 1) {
        break;
      }
      const index = execRandom(list.length);
      result.push(list[index]);
      if (!model.isDuplicate()) {
        list.splice(index, 1);
      }
    }
    model.result(result);
  },
  reset: () => {
    model.result([]);
    model.list([]);
    model.input('');
  }
};
function execRandom(max) {
  const buff = new Uint32Array(1);
  const rand = window.crypto.getRandomValues(buff)[0] / 2**32;
  return Math.floor(rand * max);
}
const Component = {
  view: () => {
    return [
      m('h1', 'Choose at Random'),
      m('.container', [
        m('.input-area', [
          m('.controls', [
            m('label', [
              '回数：',
              m('input.num[type=number]', {
                value: model.number(),
                oninput: (e) => model.number(Number(e.target.value))
              })
            ]),
            m('label', [
              'リスト長：',
              m('input.length[type=number]', {
                disabled: 'disabled',
                value: model.list().length
              })
            ]),
            m('label', [
              '重複：',
              m('input[type=checkbox]', {
                onchange: (e) => model.isDuplicate(e.target.checked),
                checked: model.isDuplicate()
              })
            ]),
            m('button', {
              onclick: (e) => {
                e.preventDefault();
                model.execute();
              }
            }, 'EXEC'),
            m('button', {
              onclick: (e) => {
                e.preventDefault();
                model.reset();
              }
            }, 'RESET')
          ]),
          m('.list-edit', [
            m('textarea.list-text', {
              placeholder: 'input item list',
              value: model.input(),
              oninput: (e) => {
                model.input(e.target.value);
                model.setList(e.target.value);
              }
            }),
            m('ul.item-list', model.list().map((item) => {
              return m('li', item)
            }))
          ])
        ]),
        m('.output-area', [
          m('h2', 'RESULT'),
          m('.result', [
            m('textarea', {
              readonly: 'readonly'
            }, model.result().join("\n"))
          ])
        ])
      ])
    ];
  }
}

m.mount(root, Component);
