const express = require('express');
const { generateMetadata } = require('./scripts/generateMetadata');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3018;

// 中间件
app.use(express.json());

// 修改静态文件服务的顺序和配置
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

// API 路由
// 更新英雄属性的路由 - 将API路由放在静态文件服务之前
app.post('/update-hero/:id', (req, res) => {
    try {
        const heroId = parseInt(req.params.id);
        const { race, class: heroClass, gender } = req.body;
        
        if (!heroId || isNaN(heroId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid hero ID'
            });
        }

        // 检查文件是否存在
        const filePath = path.join(__dirname, 'assets', 'metadata', `${heroId}.json`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: `Hero #${heroId} metadata not found`
            });
        }

        // 读取和解析元数据
        let metadata;
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            metadata = JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading metadata:', error);
            return res.status(500).json({
                success: false,
                message: 'Error reading hero metadata'
            });
        }

        // 更新属性
        metadata.attributes = metadata.attributes.map(attr => {
            switch (attr.trait_type) {
                case "race":
                    return { trait_type: "race", value: race };
                case "class":
                    return { trait_type: "class", value: heroClass };
                case "gender":
                    return { trait_type: "gender", value: gender };
                default:
                    return attr;
            }
        });

        // 保存更新后的元数据
        try {
            fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
        } catch (error) {
            console.error('Error writing metadata:', error);
            return res.status(500).json({
                success: false,
                message: 'Error saving hero metadata'
            });
        }

        res.json({
            success: true,
            message: `Hero #${heroId} attributes updated successfully!`
        });
    } catch (error) {
        console.error('Error updating hero:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating hero attributes: ' + error.message 
        });
    }
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

// 服务静态文件 - 放在 API 路由之后
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Not Found'
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 