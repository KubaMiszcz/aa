import { Injectable } from '@angular/core';
import { KolonyService } from './kolony.service';
import { IAsset, ISimplifiedResource } from '../models/Entity';
import { ResourceTypesEnum, AssetTypesEnum } from '../models/enums/Types.enum';
import { Kolony } from '../models/Kolony';
import { ResourceName } from '../models/Resource';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private assetList: IAsset[];

  constructor(
    private kolonyService: KolonyService,
  ) {
    this.assetList = this.kolonyService.getAllAssets();
  }

  getAllAssets(): IAsset[] {
    return this.assetList;
  }

  getKolonyVolatileAssets(): IAsset[] {
    return this.assetList.filter(i => i.SubType === ResourceTypesEnum.Volatile);
  }



  getAssetByName(name: string): IAsset {
    return this.assetList.find(i => i.Name === name);
  }

  getAssetsByType(type: AssetTypesEnum): IAsset[] {
    return this.assetList.filter(i => i.Type === type);
  }



  getAssetConsumption(cosnumedAsset: IAsset): number {
    let consumedQty = 0;
    this.assetList.forEach(asset => {
      let consumedItem = asset.MaintenanceCost.find(item => item.Name === cosnumedAsset.Name);
      if (consumedItem) {
        consumedQty += (asset.Quantity * consumedItem.Quantity);
      }
    });
    return consumedQty;
  }

  getAssetConsumptionByName(assetName: ResourceName): number {
    return this.getAssetConsumption(this.getAssetByName(assetName));
  }




  getAssetProduction(producedAsset: IAsset): number {
    let producedQty = 0;
    this.assetList.forEach(asset => {
      let producedItem = asset.PassiveIncome.find(item => item.Name === producedAsset.Name);
      if (producedItem) {
        producedQty += (asset.Quantity * producedItem.Quantity);
      }
    });
    return producedQty;
  }

  getAssetProductionByName(assetName: ResourceName): number {
    return this.getAssetProduction(this.getAssetByName(assetName));
  }



  getAssetsByConsumedAsset(consumedAsset: IAsset): IAsset[] {
    return this.getAssetsByConsumedAssetName(consumedAsset.Name as ResourceName);
  }

  getAssetsByConsumedAssetName(consumedAssetName: ResourceName): IAsset[] {
    let res = [];
    this.assetList.forEach(asset => {
      if (!!asset.MaintenanceCost.find(item => item.Name === consumedAssetName)) {
        res.push(asset);
      }
    });
    return res;
  }



  getAssetByProducedAsset(producedAsset: IAsset): IAsset[] {
    return this.getAssetsByProducedAssetName(producedAsset.Name as ResourceName);
  }

  getAssetsByProducedAssetName(producedAssetName: ResourceName): IAsset[] {
    let res = [];
    this.assetList.forEach(asset => {
      if (!!asset.PassiveIncome.find(item => item.Name === producedAssetName)) {
        res.push(asset);
      }
    });
    return res;
  }



  findSimplifiedResourceInListByName(resourcesList: ISimplifiedResource[], name: ResourceName): ISimplifiedResource {
    return resourcesList.find(r => r.Name === name);
  }



  // findAssetInListByName(resourcesList: IAsset[], name: string): IAsset {
  //   return resourcesList.find(i => i.Name === name);
  // }

  // getAssetQuantityFromListByName(assetsList: ISimplifiedResource[], name: string) {
  //   const asset = assetsList.find(s => s.Name === name);
  //   return !!asset ? asset.Quantity : 0;
  // }


  convertSimplifiedResourceToAsset(resource: ISimplifiedResource): IAsset {
    return this.convertSimplifiedResourceToAssetByName(resource.Name);
  }

  convertSimplifiedResourceToAssetByName(resourceName: string): IAsset {
    return this.assetList.find(a => a.Name === resourceName);
  }






}
