const express = require('express');
const { generateMetadata } = require('./scripts/generateMetadata');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3018;

// 中间件
app.use(express.json());
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

// 服务静态文件
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 处理生成元数据的请求
app.post('/generate-metadata', (req, res) => {
    try {
        const { totalHeroes } = req.body;
        
        if (!totalHeroes || totalHeroes < 1 || totalHeroes > 100) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid number of heroes. Please provide a number between 1 and 100.' 
            });
        }

        const result = generateMetadata(totalHeroes);
        res.json(result);
    } catch (error) {
        console.error('Error generating metadata:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating metadata: ' + error.message 
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 