import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KolonyService } from './kolony.service';
import { ResourceName, AllResources } from '../models/Resource';
import { OverviewService } from '../overview-module/overview.service';
import { AssetService } from '../assets-module/asset.service';
import { IAsset, Asset, ICountableEntity } from '../models/Entity';
import { TradeService } from '../trade-module/trade.service';
import { AllCivilianCrew } from '../models/Crew';
import { AllBuildings, IBuilding, Building } from '../models/Building';
import { AllMachines } from '../models/Machine';
import { CrewService } from '../crew-module/crew.service';
import { FinanceService } from '../finances-module/finance.service';
import { WikiService } from '../wiki-module/wiki.service';
import { AssetTypesEnum, GenericTypesEnum } from '../models/enums/Types.enum';
import { IKolony } from '../models/Kolony';
import { BehaviorSubject } from 'rxjs';
import { PowerService } from '../power-module/power.service';
import { BuildingService } from '../buildings-module/building.service';
import { CommonService } from './common.service';
import { SharedService } from './shared.service';
import { EntityService } from './entity.service';
import { GameDataProviderService } from './game-data-provider.service';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  // todo move age to kolony and kolony to gameservice
  private age = 100;
  get Age(): number { return Math.round(this.age * 10) / 10; }
  set Age(value: number) { this.age = value; this.AgeBS.next(value); }
  AgeBS = new BehaviorSubject<number>(100);

  private playerNotes = '';
  get PlayerNotes() { return this.playerNotes; }
  set PlayerNotes(value: string) { this.playerNotes = value; this.PlayerNotesBS.next(value); }
  PlayerNotesBS = new BehaviorSubject<string>('');

  allGameAssets: IAsset[] = [];
  allGameBuildings: IBuilding[] = [];
  allGameEntities: ICountableEntity[] = [];

  // isTurnComputing = false;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private sharedService: SharedService,
    private gameStaticDataContainerService: GameDataProviderService,
    private kolonyService: KolonyService,
    private entityService: EntityService,
    private assetService: AssetService,
    private crewService: CrewService,
    private financeService: FinanceService,
    private overviewService: OverviewService,
    private powerService: PowerService,
    private tradeService: TradeService,
    private wikiService: WikiService,
    private buildingService: BuildingService,
  ) {
    this.playerNotes = sessionStorage.getItem('savedState');

    this.allGameEntities = this.gameStaticDataContainerService.ALL_ENTITIES_LIST;
    this.allGameBuildings = this.gameStaticDataContainerService.ALL_BUILDINGS_LIST;
    this.allGameAssets = this.gameStaticDataContainerService.ALL_ASSETS_LIST;

    this.InitNewGame();
    this.nextTurn();
  }






  nextTurn() {
    console.log('nexturn');
    this.router.navigate(['/loading-screen']);
    setTimeout(() => {

      // ##########################################
      // #region TURN ENDS
      // update inventory after production

      // update production queue, and assets array
      // this.productionService.produceAssetsInQueue(production);

      // update construction queue, and assets array
      // this.productionService.produceAssetsInQueue();

      // #ENDREGION
      // ##########################################


      {
        console.log('newMonthBegins');
        this.Age += 0.1;
        this.overviewService.clearNews();
      }


      // ##########################################
      // #REGION NEW TURN BEGINS
      this.assetService.ClearVolatileAssets();
      this.entityService.updateInventoryDueToMaintenanceCost();
      // todo MINING       // this.MiningService.mining
      this.entityService.updateInventoryDueToPassiveProducedItems();

      this.tradeService.prepareIncomingShip();
      this.tradeService.setTradeAnnouncement();


      //   //UPDATE powerstatus with newly produced assets
      //   this.powerService.updatePowerStatus();

      // ##########################################


      // this.tradeService.setTradeAnnouncement(); console.log('setTradeAnnouncement');
      // this.kolonyService.setTradeAnnouncement();
      // this.isTurnComputing.next(false);

      this.updateNews();
      this.router.navigate(['/start']);
    }, 200);
  }

  updateNews() {
    let resource: ICountableEntity;
    let consumption: number;
    let production: number;
    let msg: string;

    this.overviewService.addNews('Welcome in new month, current time is: ' + this.Age + ' of New Era');
    this.overviewService.addNews('');

    // news about ship
    this.overviewService.addNews(this.tradeService.tradeAnnouncement);


    // news about cash
    resource = this.assetService.getAssetByName(ResourceName.Cash);
    consumption = this.entityService.getEntityConsumptionQtyByName(resource.Name);
    if (resource.Quantity < 0) {
      this.overviewService.addNews('!!! CASH RUNS OUT, BAILIFF IS COMING TO KOLONY !!!');
    }
    msg = 'Last month expenses: ' + consumption + resource.UoM
      + ', ' + resource.Name + ' is enough for ' + (Math.floor(resource.Quantity / consumption)) + ' months';
    this.overviewService.addNews(msg);

    // news about food
    resource = this.assetService.getAssetByName(ResourceName.Food);
    consumption = this.entityService.getEntityConsumptionQtyByName(resource.Name);
    if (resource.Quantity < 0) {
      this.overviewService.addNews('!!! HUNGER IN KOLONY !!!');
    }
    msg = 'Your Crew last month ate: ' + consumption + resource.UoM
      + ', ' + resource.Name + ' is enough for ' + (Math.floor(resource.Quantity / consumption)) + ' months';
    this.overviewService.addNews(msg);

    // news about power
    resource = this.assetService.getAssetByName(ResourceName.Energy);
    consumption = this.powerService.getEnergyUsage();
    production = this.powerService.getEnergyProduction();
    if (consumption > production) {
      msg = '!!! ' + (((consumption / production) * 100) - 100).toFixed(1) + '%  OVERLOADED !!!';
      this.overviewService.addNews(msg);
    }
    // Your kolony Energy usage 6200kW is 120 % of total production 6000kW
    msg = 'Your kolony ' + resource.Name + ' usage ' + consumption + resource.UoM
      + ' (' + ((consumption / production) * 100).toFixed(1) + '%) of total ' + production + resource.UoM;
    this.overviewService.addNews(msg);

  }






  saveGame() {
    let gameState = new Object() as IGameState;
    gameState = {
      Age: this.age,
      playerNotes: this.playerNotes,
      kolony: this.kolonyService.getKolonyState()
    };
    localStorage.setItem('savedGameState', JSON.stringify(gameState));
  }

  loadGame() {
    const gameState: IGameState = JSON.parse(localStorage.getItem('savedGameState'));
    this.Age = gameState.Age;
    this.PlayerNotes = gameState.playerNotes;
    // this.kolonyService.setKolonyState(gameState.kolony);
  }



  //#region init new game
  InitNewGame() {
    this.tradeService.tradeableCargo = this.fillTradeableAssets();
  }

  fillTradeableAssets(): IAsset[] { // todo change it to interface tradebale asset
    const list = this.commonService.cloneObject<IAsset[]>(this.allGameAssets);

    return list.filter(a => a.Tags.includes(GenericTypesEnum.Tradeable));
  }

  //#endregion
}

interface IGameState {
  Age: number;
  playerNotes: string;
  kolony: IKolony;
}


