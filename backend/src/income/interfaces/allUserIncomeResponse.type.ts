import { AllUserIncomeResponseDto } from '../dto/allUserIncomeResponse.dto';

export type AllUserIncomeResponseType = Omit<
  AllUserIncomeResponseDto,
  'hashPassword'
>;
