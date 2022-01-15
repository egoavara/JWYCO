import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseFilters,
} from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { UserService } from "../../database/sql.user.service";
import {
  StatusFailedFilter,
  StatusFailed,
} from "../../errors/ResponseError.handler";
export namespace UserDTO {
  export class LoginInput {
    @ApiProperty()
    id!: string;
    @ApiProperty()
    pw!: string;
  }
  export class LoginOutput {
    @ApiProperty()
    token!: string;
  }
  export class LogoutInput {
    @ApiProperty()
    token!: string;
  }
  export class RegisterInput {
    @ApiProperty()
    id!: string;
    @ApiProperty()
    pw!: string;
  }
  export class MyselfInput {
    @ApiProperty()
    token!: string;
  }
  export class MyselfOutput {
    @ApiProperty()
    id!: string;
  }
}

@Controller("user")
export class UserController {
  @Inject()
  service!: UserService;

  @Post("/login")
  @UseFilters(StatusFailedFilter)
  async login(@Body() input: UserDTO.LoginInput): Promise<UserDTO.LoginOutput> {
    try {
      const token = await this.service.login(input.id, input.pw);
      return {
        token: token,
      };
    } catch {
      throw StatusFailed.fail("1001", { id: input.id });
    }
  }

  @Post("/logout")
  async logout(@Body() input: UserDTO.LogoutInput) {
    try {
      await this.service.logout(input.token);
    } catch {
      throw StatusFailed.fail("1002", { token: input.token });
    }
  }
  @Get("/register")
  async register(@Body() input: UserDTO.RegisterInput) {
    try {
      this.service.register(input.id, input.pw);
    } catch {
      throw StatusFailed.fail("1003", { id: input.id });
    }
  }
  @Get("/myself/:token")
  async session(@Param("token") token: string): Promise<UserDTO.MyselfOutput> {
    try {
      const myself = await this.service.myself(token);
      return {
        id: myself.id,
      };
    } catch {
      throw StatusFailed.fail("1004", { token: token });
    }
  }
}
