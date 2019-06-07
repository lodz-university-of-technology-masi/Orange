package pl.masi.services.implementations;

import com.google.cloud.translate.Detection;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import pl.masi.services.interfaces.ITranslationService;

public class TranslationService implements ITranslationService {

    private Translate translate;

    public TranslationService() {
        translate = TranslateOptions.getDefaultInstance().getService();
    }

    @Override
    public String translateText(String text, String targetLanguage) {
        Translation translation = translate.translate(
                        text,
                        Translate.TranslateOption.targetLanguage(targetLanguage));

        return translation.getTranslatedText();
    }
}
