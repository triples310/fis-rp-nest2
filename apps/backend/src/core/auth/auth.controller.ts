import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard, LineAuthGuard } from './guards';
import { CurrentUser } from '@shared/decorators';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/login
   * 登入（帳密）
   */
  @ApiOperation({
    summary: '使用者登入',
    description: '使用 email 和 password 登入，回傳 JWT token',
  })
  @ApiResponse({ status: 200, description: '登入成功' })
  @ApiResponse({ status: 401, description: '帳號或密碼錯誤' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * GET /auth/me
   * 取得當前使用者資訊（需 JWT）
   */
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '取得當前使用者資訊',
    description: '需要 JWT token，回傳當前登入使用者的完整資料',
  })
  @ApiResponse({ status: 200, description: '成功取得使用者資訊' })
  @ApiResponse({ status: 401, description: '未授權或 token 無效' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.id);
  }

  /**
   * GET /auth/line
   * LINE Login - 導向 LINE 授權頁面
   */
  @ApiOperation({
    summary: 'LINE Login',
    description: '導向 LINE OAuth 授權頁面',
  })
  @ApiResponse({ status: 302, description: '重導向至 LINE' })
  @Get('line')
  @UseGuards(LineAuthGuard)
  async lineLogin() {
    // Passport 會自動導向 LINE
  }

  /**
   * GET /auth/line/callback
   * LINE Login - 回調處理
   */
  @ApiOperation({
    summary: 'LINE Login 回調',
    description: 'LINE OAuth 回調，處理授權碼並產生 JWT',
  })
  @ApiResponse({ status: 200, description: '登入成功' })
  @Get('line/callback')
  @UseGuards(LineAuthGuard)
  async lineCallback(@Req() req: any) {
    // req.user 已由 LineStrategy 填充
    return this.authService.lineLogin(req.user);
  }
}
