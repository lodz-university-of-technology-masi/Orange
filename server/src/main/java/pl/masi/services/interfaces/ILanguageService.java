package pl.masi.services.interfaces;

import pl.masi.entities.Language;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface ILanguageService {
    List<Language> getAll() throws AppException;
    Language createLanguage(Language languageBean) throws AppException;
    void deleteLanguage(String name) throws AppException;
}
