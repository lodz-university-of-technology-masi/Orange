package pl.masi.services.implementations;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.beans.LanguageBean;
import pl.masi.entities.Language;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.LanguageRepository;
import pl.masi.services.interfaces.ILanguageService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class LanguageService implements ILanguageService {

    private final LanguageRepository languageRepository;

    @Override
    public List<Language> getAll() throws AppException {
        return languageRepository.findAll();
    }

    @Override
    public Language createLanguage(Language language) throws AppException {
        try {
            if (language.getName().equals("English")) {
                throw new DuplicateKeyException("Tried to create language with name reserved for default (English) language");
            }
            return languageRepository.save(language);
        } catch (DuplicateKeyException e) {
            throw new AppException("LANGUAGE_DUPLICATE_NAME", "Language with given name already exists");
        }
    }
    @Override
    public void deleteLanguage(String name) throws AppException {
        languageRepository.deleteByName(name);
    }
}
