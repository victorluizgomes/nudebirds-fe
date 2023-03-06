import { Component, OnInit } from '@angular/core';
import { MoonbirdsService } from 'src/app/services/moonbirds.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public inputText: string = '';
  public metadata: any;
  public moonbirdImg: string = '';
  public notValidId: boolean = false;
  public metadataUrl = "https://live---metadata-5covpqijaa-uc.a.run.app/metadata/";

  constructor(private api: MoonbirdsService) {}

  ngOnInit(): void {
    // this.api.getMoonbirdsMetadata(this.metadataUrl + '1')
    //   .subscribe(
    //     (data) => {
    //       console.log(data);
    //       console.log('image', data.image);
    //       this.metadata = data.name;
    //     },
    //     (err) => {
    //       console.log(err)
    //     }
    //   );
  }

  public getMoonbirdMetadata(tokenId: string) {
    this.notValidId = false;
    if(!this.isNumericInRange(tokenId)) {
      console.log('Not a valid token ID');
      this.notValidId = true;
      return;
    }
    const url = this.metadataUrl + tokenId;
    this.api.getMoonbirdsMetadata(url)
      .subscribe(
        (data) => {
          console.log(data.image)
          this.moonbirdImg = data.image;
          this.metadata = data.name;
        },
        (err) => {
          console.log(err)
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
