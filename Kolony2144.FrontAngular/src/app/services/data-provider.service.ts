import { Injectable } from '@angular/core';
import { IEntity, IAsset, ITradeableEntity } from '../models/Entity';
import { IBuilding, AllBuildings } from '../models/Building';
import { AllResources, IResource, AllVolatileResources } from '../models/Resource';
import { AllCrew, ICrew } from '../models/Crew';
import { AllMachines, IMachine } from '../models/Machine';
import { CommonService } from './common.service';
import { SharedService } from './shared.service';
import { GenericTypesEnum } from '../models/enums/Types.enum';
import { IKolony } from '../models/Kolony';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  KOLONY: IKolony;

  ALL_BUILDINGS_LIST: IBuilding[] = [];
  ALL_CREW_LIST: ICrew[] = [];
  ALL_MACHINES_LIST: IMachine[] = [];
  ALL_RESOURCES_LIST: IResource[] = [];

  PlayerNotes = '';


  constructor(
    private commonService: CommonService,
    private sharedService: SharedService,
  ) {
    this.fillListWithInitialValues(AllBuildings, this.ALL_BUILDINGS_LIST);
    this.fillListWithInitialValues(AllCrew, this.ALL_CREW_LIST);
    this.fillListWithInitialValues(AllMachines, this.ALL_MACHINES_LIST);
    this.fillListWithInitialValues(AllResources, this.ALL_RESOURCES_LIST);
    this.fillListWithInitialValues(AllVolatileResources, this.ALL_RESOURCES_LIST);

    this.fillDataFromSavedState();

    // todo add method for auto fill tags like 'power source' etc and get kolony assets from this service not files
  }

  get ALL_ENTITIES_LIST(): IEntity[] {
    return [
      ...this.ALL_BUILDINGS_LIST,
      ...this.ALL_CREW_LIST,
      ...this.ALL_MACHINES_LIST,
      ...this.ALL_RESOURCES_LIST
    ];
  }

  get ALL_ASSETS_LIST(): IAsset[] {
    return [
      ...this.ALL_CREW_LIST,
      ...this.ALL_MACHINES_LIST,
      ...this.ALL_RESOURCES_LIST
    ];
  }

  get ALL_TRADEABLE_ASSETS_LIST(): ITradeableEntity[] {
    return this.ALL_ASSETS_LIST
      .filter(a => a.Price >= 0) as ITradeableEntity[];
  }

  getEntityByName(name: string): IEntity {
    return this.sharedService.findItemInListByName(this.ALL_ENTITIES_LIST, name);
  }


  fillDataFromSavedState() {
    this.PlayerNotes = sessionStorage.getItem('savedState');
  }

















  private fillListWithInitialValues<T, T2>(srcList: T[], targetList: T2[]) {
    [...srcList].forEach(item => {
      const clonedItem = this.commonService.cloneObject(item) as unknown as T2;
      targetList.push(clonedItem);
      // res.push(new Asset().Deserialize(i));
    });
  }

}


interface IGameState {
  Age: number;
  playerNotes: string;
  kolony: IKolony;
}
