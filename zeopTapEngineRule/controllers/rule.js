const Rule = require('../models/Rule');
const { parseRuleString, combineNodes, evaluate, printTree } = require('../utils/abstractDatastructure');

function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    const totalChars = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * totalChars);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

exports.createRule = async (req, res) => {
    try {
        const { ruleName, ruleString } = req.body;
        if (!ruleName || !ruleString) {
            return res.status(400).json({ error: 'Both ruleName and ruleString are required.' });
        }
        const rootNode = parseRuleString(ruleString);
        const newRule = new Rule({ ruleName, ruleAST: rootNode });
        await newRule.save();
        printTree(rootNode);
        res.status(201).json(newRule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.combineRules = async (req, res) => {
    try {
        const { rules, op } = req.body;
        const ruleDocuments = await Rule.find({ ruleName: { $in: rules } });
        if (ruleDocuments.length === 0) {
            return res.status(404).json({ error: 'No matching rules found.' });
        }
        const ruleASTs = ruleDocuments.map(rule => rule.ruleAST);
        const combinedRootNode = combineNodes(ruleASTs, op);
        const randomString = getRandomString(4);
        const combinedRule = new Rule({ ruleName: `combined${randomString}`, ruleAST: combinedRootNode });
        await combinedRule.save();
        printTree(combinedRootNode);
        res.status(201).json(combinedRule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.evaluateRule = async (req, res) => {
    try {
        const { ast, data } = req.body;
        const rule = await Rule.findOne({ ruleName: ast });
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found.' });
        }
        const evaluationResult = evaluate(rule.ruleAST, data);
        res.status(200).json({ result: evaluationResult });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
