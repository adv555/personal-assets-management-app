import { AllUserCostsResponseDto } from '../dto/allUserCostsResponse.dto';

export type AllUserCostsResponseType = Omit<
  AllUserCostsResponseDto,
  'hashPassword'
>;
