import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/user';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  createAndSave(
    email: string,
    password: string,
    name: string,
    imageUrl = 'https://s3.ap-northeast-2.amazonaws.com/image.mercuryeunoia.com/images/user/default_image.jpeg',
    gender: boolean | null,
    age?: number | null,
    type = 0
  ) {
    const user = new User();
    user.email = email;
    user.password = password;
    user.name = name;
    user.imageUrl = imageUrl;
    if (age) {
      user.age = age;
    }
    if (gender !== null) {
      user.gender = gender;
    }
    user.type = type;
    return this.manager.save(user);
  }

  findByEmail(email: string) {
    return this.findOne({
      where: { email },
      select: ['id', 'password', 'email', 'imageUrl'],
    });
  }

  findById(id: number) {
    return this.findOne({ id });
  }

  updateAndProfile(id: number, updateProfile: any) {
    return this.update(id, updateProfile);
  }

  updateAndEnabled(id: number) {
    return this.update(id, { enabled: false });
  }
}
