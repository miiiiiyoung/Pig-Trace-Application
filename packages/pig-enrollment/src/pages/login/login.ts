import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DesignerPage } from '../designer/designer';
import { FarmerPage } from '../farmer/farmer';
import { ButcheryPage } from '../butchery/butchery';
import { PackagePage } from '../package/package';
import { RetailerPage } from '../retailer/retailer';
import { SearchPage } from '../search/search';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  farmerPage: FarmerPage;
  butcheryPage: ButcheryPage;
  designerPage: DesignerPage;
  packagePage: PackagePage;
  retailerPage: RetailerPage;
  searchPage: SearchPage;

  memberId: any;

  constructor(public navController: NavController, public navParams: NavParams) {
  }

  searchList() {
    this.navController.push(SearchPage);
  }

  // Farmer 이미지 클릭 시 memberId = FARMER
  loginFarmer() {
    this.memberId = 'FARMER';
    console.log("Select memberId : " + this.memberId);
    this.navController.push(FarmerPage, {
      memberId: this.memberId
    });
  }

  // Butchery 이미지 클릭 시 memberId = BUTCHERY
  loginButchery() {
    this.memberId = 'BUTCHERY';
    console.log("Select memberId : " + this.memberId);
    this.navController.push(ButcheryPage, {
      memberId: this.memberId
    });
  }

  // Package 이미지 클릭 시 memberId =PACKAGEFARMER
  loginPackage() {
    this.memberId = 'PACKAGE';
    console.log("Select memberId : " + this.memberId);
    this.navController.push(PackagePage, {
      memberId: this.memberId
    });
  }

  // Retailer 이미지 클릭 시 memberId = RETAILER
  loginRetailer() {
    this.memberId = 'RETAILER';
    console.log("Select memberId : " + this.memberId);
    this.navController.push(RetailerPage, {
      memberId: this.memberId
    });
  }
}
