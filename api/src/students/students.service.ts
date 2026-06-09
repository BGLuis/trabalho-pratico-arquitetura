import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    const exists = await this.prisma.student.findFirst({
      where: {
        OR: [
          { cpf: createStudentDto.cpf },
          { email: createStudentDto.email }
        ]
      }
    });

    if (exists) {
      throw new BadRequestException('Student with same CPF or Email already exists');
    }

    return this.prisma.student.create({
      data: createStudentDto,
    });
  }

  async findAllOffset(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.student.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllCursor(cursor: string | undefined, limit: number = 10) {
    const findArgs: any = {
      take: limit + 1, // take one extra to check if there is a next page
      orderBy: { id: 'asc' },
    };

    if (cursor && cursor !== 'none') {
      findArgs.cursor = { id: cursor };
      // skip the cursor itself
      findArgs.skip = 1;
    }

    const data = await this.prisma.student.findMany(findArgs);
    let nextCursor = null;

    if (data.length > limit) {
      const nextItem = data.pop(); // remove the extra item
      if (nextItem) nextCursor = nextItem.id;
    }

    return {
      data,
      meta: {
        nextCursor,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    await this.findOne(id); // ensure exists
    return this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // ensure exists
    return this.prisma.student.delete({
      where: { id },
    });
  }
}
