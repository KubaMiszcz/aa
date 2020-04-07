import { IFullEntity } from "./Entity";
import { UoMsEnum } from "./enums/UoMs.enum";
import { AssetTypesEnum, ResourceTypesEnum } from "./enums/Types.enum";

export enum ResourceNames {
  Cash = 'Space Beads',
  Energy = 'Energy',
  StorageSpace = 'Storage space',
  LivingSpace = 'Living space',
  Food = 'Food',
  Stone = 'Stone',
  Steel = 'Steel',
}

export const AllResources: IFullEntity[] = [
  //cash
  {
    Name: ResourceNames.Cash,
    Description: 'Space Beads, galactic currency', ImageUrl: '/assets/cash.svg',
    Size: 0,
    Type: AssetTypesEnum.Resource,
    SubType: ResourceTypesEnum.NotSet,
    CreationCost: [],
    ConsumedItems: [],
    ProducedItems: [],
    UoM: UoMsEnum.SB,
    InitialQuantity: 5000
  },
  {
    Name: ResourceNames.Energy,
    Description: 'Energy', ImageUrl: '/assets/cash.svg',
    Size: 0,
    Type: AssetTypesEnum.Resource,
    SubType: ResourceTypesEnum.Volatile,
    CreationCost: [],
    ConsumedItems: [],
    ProducedItems: [],
    UoM: UoMsEnum.kW,
    InitialQuantity: 1
  },
  {
    Name: ResourceNames.StorageSpace,
    Description: 'StorageSpace', ImageUrl: '/assets/cash.svg',
    Size: 0,
    Type: AssetTypesEnum.Resource,
    SubType: ResourceTypesEnum.Volatile,
    CreationCost: [],
    ConsumedItems: [],
    ProducedItems: [],
    UoM: UoMsEnum.m2,
    InitialQuantity: 1
  },
  {
    Name: ResourceNames.LivingSpace,
    Description: 'Energy', ImageUrl: '/assets/cash.svg',
    Size: 0,
    Type: AssetTypesEnum.Resource,
    SubType: ResourceTypesEnum.Volatile,
    CreationCost: [],
    ConsumedItems: [],
    ProducedItems: [],
    UoM: UoMsEnum.m2,
    InitialQuantity: 1
  },
  {
    Name: ResourceNames.Food,
    Description: 'food for feeding your men and animals;]', ImageUrl: '/assets/item.svg',
    Size: 1,
    Type: AssetTypesEnum.Resource,
    SubType: ResourceTypesEnum.Production,
    CreationCost: [],
    ConsumedItems: [],
    ProducedItems: [],
    UoM: UoMsEnum.t,
    InitialQuantity: 100
  },
  {
    Name: ResourceNames.Stone,
    Description: 'A piece of stone', ImageUrl: '/assets/property.png',
    Size: 1,
    Type: AssetTypesEnum.Resource,
    SubType: ResourceTypesEnum.Production,
    CreationCost: [],
    ConsumedItems: [],
    ProducedItems: [],
    UoM: UoMsEnum.t,
    InitialQuantity: 1000
  },
  {
    Name: ResourceNames.Steel,
    Description: 'A piece of steel', ImageUrl: '/assets/property.png',
    Size: 1,
    Type: AssetTypesEnum.Resource,
    SubType: ResourceTypesEnum.Production,
    CreationCost: [],
    ConsumedItems: [],
    ProducedItems: [],
    UoM: UoMsEnum.t,
    InitialQuantity: 1000
  }
]
