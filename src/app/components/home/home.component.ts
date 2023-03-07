import { Component, isDevMode, OnInit } from '@angular/core';
import { MoonbirdsService } from 'src/app/services/moonbirds.service';

const MetadataUrl = isDevMode() ? 'metadata/' : "https://xr5jdctc70.execute-api.us-east-2.amazonaws.com/prod/";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public inputText: string = '';
  public tokenID: any;
  public moonbirdImg: string = '';
  public notValidId: boolean = false;
  public isNudebird: boolean = false;

  constructor(private api: MoonbirdsService) {}

  // TODO: read from the in-chain contract for custom backgrounds

  ngOnInit(): void {
  }

  public getMoonbirdMetadata(tokenId: string) {
    this.notValidId = false;
    if(!this.isNumericInRange(tokenId)) {
      console.log('Not a valid token ID');
      this.notValidId = true;
      return;
    }
    const url = MetadataUrl + tokenId;
    this.api.getMoonbirdsMetadata(url)
      .subscribe(
        (data) => {
          console.log(data.image)
          this.moonbirdImg = data.image;
          this.tokenID = data.name;
        },
        (err) => {
          console.log(err);
        }
      );
    this.isMoonbirdNudebird(tokenId);
  }

  public isMoonbirdNudebird(tokenId: string) {
    this.notValidId = false;
    if(!this.isNumericInRange(tokenId)) {
      console.log('Not a valid token ID');
      this.notValidId = true;
      return;
    }

    this.api.getNudebirdsData('/assets/nudebirds_token_ids.txt')
    .subscribe(
      (data: any) => {
        data = data.split(', ');
        this.isNudebird = data.includes(tokenId);
        console.log(data);
      },
      error => {
        console.log(error)
      }
    );
  }

  submit() {
    console.log(this.inputText);
    this.getMoonbirdMetadata(this.inputText)
  }

  isNumericInRange(str: string): boolean {
    const num = Number(str);
    if (isNaN(num) || !Number.isInteger(num)) {
      // Not a number
      return false;
    }
    if (num < 0 || num >= 10000) {
      // Number is not within range
      return false;
    }
    // Number is numeric and within range
    return true;
  }
}
