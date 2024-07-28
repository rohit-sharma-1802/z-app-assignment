function generateTreeHTML(node, prefix = '', isLeft = true) {
    if (!node) return '';

    let treeHTML = '';
    treeHTML += prefix + (isLeft ? "├── " : "└── ") + (node.type === 'operator' ? node.operator : `${node.key} ${node.operator} ${node.value}`) + '<br>';

    if (node.left) treeHTML += generateTreeHTML(node.left, prefix + (isLeft ? "│   " : "    "), true);
    if (node.right) treeHTML += generateTreeHTML(node.right, prefix + (isLeft ? "│   " : "    "), false);

    return treeHTML;
}

function displayTree(tree) {
    const treeHTML = generateTreeHTML(tree);
    document.getElementById('combined-rules-tree').innerHTML = treeHTML;
}

document.getElementById('create-rule-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const ruleName = document.getElementById('ruleName').value;
    const ruleString = document.getElementById('ruleString').value;
    const response = await fetch('/api/rules/create_rule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ruleName, ruleString }),
    });
    const result = await response.json();
    let treeHTML = generateTreeHTML(result.ruleAST);
    treeHTML += `<br><p>Rule Name: ${result.ruleName}</p>`;
    document.getElementById('create-rule-result').innerHTML = treeHTML;
});

document.getElementById('combine-rules-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const op = document.getElementById('operator1').value;
    const rules = Array.from(document.querySelectorAll('input[id^="combine-rule"]')).map(input => input.value);
    const response = await fetch('/api/rules/combine_rules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rules, op }),
    });
    const result = await response.json();
    let treeHTML = generateTreeHTML(result.ruleAST);
    treeHTML += `<br><p>Rule Name: ${result.ruleName}</p>`;
    document.getElementById('combine-rules-result').innerHTML = treeHTML;
});

document.getElementById('add-rule').addEventListener('click', function() {
    const ruleInputContainer = document.createElement('div');
    ruleInputContainer.classList.add('rule-container');
    const ruleCount = document.querySelectorAll('input[id^="combine-rule"]').length + 1;
    ruleInputContainer.innerHTML = `
        <label for="combine-rule${ruleCount}">Rule ${ruleCount}:</label>
        <input type="text" id="combine-rule${ruleCount}" name="rule${ruleCount}" required>
        <label for="operator${ruleCount}">Operator:</label>
        <select id="operator${ruleCount}" name="operator${ruleCount}">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
        </select>
    `;
    document.getElementById('rules-inputs').appendChild(ruleInputContainer);
});

document.getElementById('evaluate-rule-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const ast = document.getElementById('evaluate-ast').value;
    const data = document.getElementById('evaluate-data').value;
    const response = await fetch('/api/rules/evaluate_rule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ast, data: JSON.parse(data) }),
    });
    const result = await response.json();
    document.getElementById('evaluate-rule-result').textContent = JSON.stringify(result, null, 2);
});
