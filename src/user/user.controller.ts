import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/CurrentUser.decorator';
import { UserPayload } from 'src/auth/types/UserPayload';
import { UnauthorizedException } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const user = await this.userService.findOne(id);
    if (user.id !== currentUser.sub) {
      throw new UnauthorizedException(
        'Avaliação não pode ser criada para outro usuário',
      );
    }

    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const user = await this.userService.findOne(id);
    if (user.id !== currentUser.sub) {
      throw new UnauthorizedException(
        'Avaliação não pode ser criada para outro usuário',
      );
    }

    return await this.userService.remove(id);
  }
}
