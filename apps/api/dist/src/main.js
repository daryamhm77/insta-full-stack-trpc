"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const origins_1 = require("./config/origins");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: false,
    });
    const configService = app.get(config_1.ConfigService);
    const webOrigins = (0, origins_1.parseOrigins)(configService.get('WEB_URL') ?? 'http://localhost:3000');
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
    });
    app.enableCors({
        origin: webOrigins,
        credentials: true,
    });
    app.setGlobalPrefix('api', {
        exclude: [{ path: 'health', method: common_1.RequestMethod.GET }],
    });
    await app.listen(configService.get('PORT') ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map