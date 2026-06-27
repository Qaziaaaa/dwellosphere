import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { QueryPropertyDto } from './dto/query-property.dto';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('api/v1/properties')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get()
  findAll(@Query() query: QueryPropertyDto) {
    return this.propertyService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('agent', 'admin')
  create(@Body() dto: CreatePropertyDto, @Req() req: any) {
    return this.propertyService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('agent', 'admin')
  update(@Param('id') id: string, @Body() dto: Partial<CreatePropertyDto>, @Req() req: any) {
    return this.propertyService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('agent', 'admin')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.propertyService.remove(id, req.user.id);
  }
}
