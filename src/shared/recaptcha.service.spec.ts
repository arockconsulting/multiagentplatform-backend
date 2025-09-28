```typescript
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { RecaptchaService } from './recaptcha.service';

describe('RecaptchaService', () => {
  let service: RecaptchaService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'RECAPTCHA_SECRET_KEY') {
        return 'testSecretKey';
      }
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        RecaptchaService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<RecaptchaService>(RecaptchaService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateRecaptcha', () => {
    it('should return true for a valid recaptcha token', async () => {
      const mockResponse = {
        data: {
          success: true,
          score: 0.9,
          'error-codes': [],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(mockResponse));

      const result = await service.validateRecaptcha('validToken');
      expect(result).toBe(true);
    });

    it('should return false for an invalid recaptcha token (success: false)', async () => {
      const mockResponse = {
        data: {
          success: false,
          score: 0.1,
          'error-codes': ['invalid-input-secret'],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(mockResponse));

      const result = await service.validateRecaptcha('invalidToken');
      expect(result).toBe(false);
    });

    it('should return false for an invalid recaptcha token (score too low)', async () => {
      const mockResponse = {
        data: {
          success: true,
          score: 0.1,
          'error-codes': [],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(mockResponse));

      const result = await service.validateRecaptcha('invalidToken');
      expect(result).toBe(false);
    });

    it('should handle errors from the HTTP request', async () => {
      jest.spyOn(httpService, 'post').mockImplementationOnce(() => {
        throw new Error('Network error');
      });

      await expect(service.validateRecaptcha('token')).rejects.toThrow('Network error');
    });

    it('should use the recaptcha secret key from config service', async () => {
      const mockResponse = {
        data: {
          success: true,
          score: 0.9,
          'error-codes': [],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const httpPostSpy = jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(mockResponse));

      await service.validateRecaptcha('validToken');

      expect(httpPostSpy).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        `secret=testSecretKey&response=validToken`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    });
  });
});
```