import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LiffService } from './liff.service';
import { VerifyLiffTokenDto } from '@core/auth/dto';

@ApiTags('LIFF')
@Controller('liff')
export class LiffController {
  constructor(private liffService: LiffService) {}

  /**
   * POST /liff/verify
   * 驗證 LIFF Token
   */
  @ApiOperation({
    summary: '驗證 LIFF Token',
    description: 'LIFF 前端呼叫，驗證 LINE Access Token 並取得綁定的員工資料',
  })
  @ApiResponse({ status: 200, description: '驗證成功' })
  @ApiResponse({ status: 401, description: 'Token 無效' })
  @Post('verify')
  async verifyToken(@Body() dto: VerifyLiffTokenDto) {
    return this.liffService.verifyLiffToken(dto.liffToken);
  }

  /**
   * GET /liff/stock
   * LIFF - 查看庫存（需要 LIFF Token 在 header）
   */
  @ApiOperation({
    summary: 'LIFF 查看庫存',
    description: '員工透過 LINE LIFF 查看庫存資料（需要 liff.stock.view 權限）',
  })
  @ApiResponse({ status: 200, description: '成功取得庫存資料' })
  @ApiResponse({ status: 403, description: '無權限或未綁定帳號' })
  @Get('stock')
  async getStock(@Query('lineUserId') lineUserId: string) {
    return this.liffService.getStockForLiff(lineUserId);
  }

  /**
   * GET /liff/orders
   * LIFF - 查看訂單（需要 LIFF Token 在 header）
   */
  @ApiOperation({
    summary: 'LIFF 查看訂單',
    description: '員工透過 LINE LIFF 查看訂單資料（需要 liff.order.view 權限）',
  })
  @ApiResponse({ status: 200, description: '成功取得訂單資料' })
  @ApiResponse({ status: 403, description: '無權限或未綁定帳號' })
  @Get('orders')
  async getOrders(@Query('lineUserId') lineUserId: string) {
    return this.liffService.getOrdersForLiff(lineUserId);
  }
}
